<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\NetflowRecords;

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
}