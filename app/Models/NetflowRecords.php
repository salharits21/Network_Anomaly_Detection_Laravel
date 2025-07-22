<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class NetflowRecords extends Model
{
    use HasFactory;

    protected $fillable = [
        'timestamp',
        'source_ip',
        'destination_ip',
        'source_port',
        'destination_port',
        'protocol',
        'bytes_in',
        'bytes_out',
        'packets_in',
        'packets_out',
        'flow_start_time',
        'flow_end_time',
        'tcp_flags',
        'tos',
        'src_as',
        'dst_as',
        'src_mask',
        'dst_mask',
        'next_hop',
        'input_interface',
        'output_interface',
        'label', // Tambahan baru
        'attack_category' // Tambahan baru
    ];

    protected $casts = [
        'timestamp' => 'datetime',
        'bytes_in' => 'integer',
        'bytes_out' => 'integer',
        'packets_in' => 'integer',
        'packets_out' => 'integer',
    ];

    public function getProtocolNameAttribute()
    {
        return match($this->protocol) {
            1 => 'ICMP',
            6 => 'TCP',
            17 => 'UDP',
            default => 'Other'
        };
    }

    public function scopeByIp($query, $ip)
    {
        return $query->where('source_ip', $ip)
                    ->orWhere('destination_ip', $ip);
    }
}