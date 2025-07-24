// resources/js/components/dashboard/AttackCategoryChart.tsx

import { type AttackCategory } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// 1. Import komponen yang diperlukan dari Recharts
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Palet warna yang sama seperti sebelumnya
const categoryColors: { [key: string]: string } = {
    Normal: '#22c55e',
    DoS: '#ef4444',
    Reconnaissance: '#f97316',
    Exploits: '#dc2626',
    Fuzzers: '#eab308',
    Analysis: '#8b5cf6',
    Backdoors: '#ec4899',
    Generic: '#64748b',
    Shellcode: '#a855f7',
    Worms: '#d946ef',
    Unknown: '#78716c',
};

export function AttackCategoryChart({ data }: { data: AttackCategory[] | null }) {
    if (!data || data.length === 0) {
        return <Card className="flex items-center justify-center"><p>Loading chart data...</p></Card>;
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Attack Category Distribution</CardTitle>
            </CardHeader>
            <CardContent>
                {/* 2. Gunakan ResponsiveContainer agar chart menyesuaikan ukuran Card */}
                <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                        {/* 3. Tooltip akan muncul saat mouse hover di atas chart */}
                        <Tooltip
                            contentStyle={{ 
                                background: 'white', 
                                border: '1px solid #ccc',
                                borderRadius: '0.5rem' 
                            }}
                        />
                        
                        {/* 4. Legend akan menampilkan daftar kategori di bawah chart */}
                        <Legend iconType="circle" />

                        {/* 5. Komponen Pie yang akan merender chart */}
                        <Pie
                            data={data}
                            dataKey="count"        // Nilai untuk setiap irisan
                            nameKey="attack_category"  // Nama untuk setiap irisan
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            labelLine={false}      // Nonaktifkan garis label
                            label={({ percent }) => (percent ? `${(percent * 100).toFixed(0)}%` : '')} // Tampilkan persentase
                        >
                            {/* 6. Map data untuk memberikan warna pada setiap irisan (Cell) */}
                            {data.map((entry) => (
                                <Cell key={`cell-${entry.attack_category}`} fill={categoryColors[entry.attack_category] || '#ccc'} />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}