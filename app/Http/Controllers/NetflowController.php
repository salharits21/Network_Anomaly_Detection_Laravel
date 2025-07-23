<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\NetflowRecords;
use DB;

class NetflowController extends Controller
{
    /**
     * Menampilkan daftar record anomali dengan paginasi dinamis.
     */
    public function index(Request $request) // 1. Inject objek Request
    {
        // 2. Validasi input 'per_page'. Jika tidak valid, gunakan default 100.
        $perPage = $request->input('per_page', 100);
        if (!in_array($perPage, [25, 50, 100])) {
            $perPage = 100;
        }

        // 3. Gunakan variabel $perPage untuk paginate dan tambahkan query string ke link paginasi
        $netflow = NetflowRecords::orderBy('timestamp', 'desc')
                    ->paginate($perPage)
                    ->withQueryString(); // <-- Kunci agar filter tetap ada saat pindah halaman

        return Inertia::render('anomaly-records/index', [
            'netflow' => $netflow,
            // 4. Kirim filter yang sedang aktif kembali ke view
            'filters' => $request->only(['per_page'])
        ]);
    }
    public function stats()
    {
        $stats = DB::table('netflow_records')
                   ->select([
                       DB::raw('COUNT(*) as total_flows'),
                       DB::raw('SUM(bytes_in) as total_bytes'),
                       DB::raw('SUM(packets_in) as total_packets'),
                       DB::raw('COUNT(DISTINCT source_ip) as unique_sources'),
                       DB::raw('COUNT(DISTINCT destination_ip) as unique_destinations')
                   ])
                   ->first();

        return response()->json([
            'totalFlows' => $stats->total_flows,
            'totalBytes' => $stats->total_bytes ?? 0,
            'totalPackets' => $stats->total_packets ?? 0,
            'uniqueSources' => $stats->unique_sources,
            'uniqueDestinations' => $stats->unique_destinations
        ]);
    }
}