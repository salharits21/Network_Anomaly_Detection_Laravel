<?php

namespace App\Services;

use App\Models\NetflowRecords;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http; 

class NetflowCollectorService
{
    private $socket;
    private $port;

    public function __construct($port = 2055)
    {
        $this->port = $port;
    }

    public function start()
    {
        $this->socket = socket_create(AF_INET, SOCK_DGRAM, SOL_UDP);
        
        if (!$this->socket) {
            throw new \Exception('Could not create socket: ' . socket_strerror(socket_last_error()));
        }

        socket_set_option($this->socket, SOL_SOCKET, SO_REUSEADDR, 1);
        
        if (!socket_bind($this->socket, '0.0.0.0', $this->port)) {
            throw new \Exception('Could not bind socket: ' . socket_strerror(socket_last_error()));
        }

        Log::info("NetFlow collector started on port {$this->port}");

        while (true) {
            $buffer = '';
            $from = '';
            $port = 0;

            $bytes = socket_recvfrom($this->socket, $buffer, 65536, 0, $from, $port);
            
            if ($bytes === false) {
                Log::error('Error receiving data: ' . socket_strerror(socket_last_error()));
                continue;
            }

            Log::info("Received NetFlow packet from {$from}:{$port}");
            
            try {
                $this->processNetflowPacket($buffer);
            } catch (\Exception $e) {
                Log::error('Error processing NetFlow packet: ' . $e->getMessage());
            }
        }
    }

    private function processNetflowPacket($buffer)
    {
        $parser = new NetflowV5Parser();
        $parsed = $parser->parse($buffer);

        $recordsToInsert = [];
        foreach ($parsed['records'] as $record) {
            // 1. Hitung fitur yang dibutuhkan model ML
            $duration = $record['last'] - $record['first'];
            $sbytes = $record['dOctets']; // Netflow V5 umumnya hanya punya satu arah bytes/packets
            $dbytes = 0; // Asumsi, karena V5 tidak punya dOctets
            $pkts = $record['dPkts'];
            
            // Hindari pembagian dengan nol
            $sload = ($duration > 0) ? ($sbytes * 8) / $duration : 0;
            $smeansz = ($pkts > 0) ? $sbytes / $pkts : 0;

            // Data yang akan dikirim ke service ML
            $features = [
                'dur' => (float) $duration,
                'sbytes' => (int) $sbytes,
                'dbytes' => (int) $dbytes,
                'Sload' => (float) $sload,
                'smeansz' => (float) $smeansz,
                'Stime' => (int) $record['first'],
                'duration' => (float) $duration,
                'byte_pkt_interaction_dst' => (float) ($dbytes * $pkts),
            ];

            // 2. Panggil API Prediksi
            try {
                // Pastikan URL API Python benar
                $response = Http::post('http://127.0.0.1:8000/predict', $features);

                if ($response->successful()) {
                    $prediction = $response->json();
                    $label = $prediction['label'];
                    $attack_category = $prediction['attack_category'];
                } else {
                    // Jika API gagal, set nilai default agar data tetap masuk
                    $label = null;
                    $attack_category = 'PREDICTION_FAILED';
                    Log::error('Prediction API call failed: ' . $response->body());
                }
            } catch (\Exception $e) {
                $label = null;
                $attack_category = 'PREDICTION_UNAVAILABLE';
                Log::error('Could not connect to Prediction API: ' . $e->getMessage());
            }
            
            // 3. Siapkan data lengkap untuk dimasukkan ke database
            $recordsToInsert[] = [
                'timestamp' => now(),
                'source_ip' => $record['srcaddr'],
                'destination_ip' => $record['dstaddr'],
                'source_port' => $record['srcport'],
                'destination_port' => $record['dstport'],
                'protocol' => $record['prot'],
                'bytes_in' => $sbytes, // Menggunakan dOctets sebagai bytes_in
                'bytes_out' => 0, // V5 tidak menyediakan ini
                'packets_in' => $pkts, // Menggunakan dPkts sebagai packets_in
                'packets_out' => 0, // V5 tidak menyediakan ini
                'flow_start_time' => $record['first'],
                'flow_end_time' => $record['last'],
                'tcp_flags' => $record['tcpFlags'],
                'tos' => $record['tos'],
                'src_as' => $record['srcAs'],
                'dst_as' => $record['dstAs'],
                'src_mask' => $record['srcMask'],
                'dst_mask' => $record['dstMask'],
                'next_hop' => $record['nexthop'],
                'input_interface' => $record['input'],
                'output_interface' => $record['output'],
                'label' => $label, // <-- Data dari model
                'attack_category' => $attack_category, // <-- Data dari model
                'created_at' => now(),
                'updated_at' => now()
            ];
        }
        
        // Batch insert untuk performa
        if (!empty($recordsToInsert)) {
            NetflowRecords::insert($recordsToInsert);
            Log::info("Inserted " . count($recordsToInsert) . " NetFlow records with predictions");
        }
    }

    public function stop()
    {
        if ($this->socket) {
            socket_close($this->socket);
        }
    }
}