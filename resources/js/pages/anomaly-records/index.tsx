import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
// 1. Import 'router' dari inertia untuk navigasi
import { Head, Link, usePage, router } from '@inertiajs/react';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { cn } from '@/lib/utils';
import React from 'react'; // Import React jika belum ada

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Anomaly Records',
        href: '/anomaly-records',
    },
];

// Interface Netflow (tidak berubah)
interface Netflow {
    id: number;
    timestamp: string;
    source_ip: string;
    destination_ip: string;
    source_port: number;
    destination_port: number;
    protocol: number;
    bytes_in: number;
    bytes_out: number;
    packets_in: number;
    packets_out: number;
    flow_start_time: string;
    flow_end_time: string;
    tcp_flags: string;
    tos: number;
    src_as: number;
    dst_as: number;
    src_mask: string;
    dst_mask: string;
    next_hop: string;
    input_interface: string;
    output_interface: string;
    label: string;
    attack_category: string;
}

// Interface Paginator (tidak berubah)
interface Paginator<T> {
    data: T[];
    links: { url: string | null; label: string; active: boolean; }[];
    current_page: number;
    last_page: number;
    total: number;
}

// 2. Update PageProps untuk menyertakan 'filters'
interface PageProps {
    netflow: Paginator<Netflow>;
    filters: {
        per_page?: string; // per_page bisa jadi tidak ada
    };
}

export default function Index() {
    // 3. Ambil 'filters' dari props
    const { netflow, filters } = usePage().props as unknown as PageProps;

    const stickyColumnClass = "sticky right-0 bg-background text-right shadow-sm";

    // 4. Buat fungsi untuk menangani perubahan pada dropdown
    function handlePerPageChange(event: React.ChangeEvent<HTMLSelectElement>) {
        const perPage = event.target.value;
        
        router.get(
            // Ganti dengan nama route Anda jika ada, jika tidak gunakan URL
            '/anomaly-records', 
            { per_page: perPage }, 
            {
                preserveState: true, // Menjaga state lokal komponen (jika ada)
                replace: true,       // Mengganti history browser agar tombol back berfungsi normal
            }
        );
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Anomaly Records" />
            <div className='m-4'>
                {/* 5. Tambahkan UI Dropdown untuk memilih jumlah data */}
                <div className="mb-4 flex items-center">
                    <label htmlFor="per_page" className="mr-2 text-sm font-medium text-gray-700">
                        Tampilkan:
                    </label>
                    <select
                        id="per_page"
                        value={filters.per_page || '100'} // Set nilai dropdown dari props
                        onChange={handlePerPageChange}
                        className="block w-14 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    >
                        <option value="25">25</option>
                        <option value="50">50</option>
                        <option value="100">100</option>
                    </select>
                    <span className="ml-2 text-sm text-gray-600">data per halaman</span>
                </div>

                {netflow.data.length > 0 ? (
                    <>
                        <div className="relative w-full overflow-x-auto border rounded-lg">
                            {/* ... Isi Tabel Anda (tidak ada perubahan di sini) ... */}
                            <Table className="min-w-max">
                                <TableCaption>
                                    Menampilkan {netflow.data.length} dari {netflow.total} data. Halaman {netflow.current_page} dari {netflow.last_page}.
                                </TableCaption>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Timestamp</TableHead>
                                        <TableHead>Source IP</TableHead>
                                        <TableHead>Dest IP</TableHead>
                                        <TableHead>Src Port</TableHead>
                                        <TableHead>Dest Port</TableHead>
                                        <TableHead>Protocol</TableHead>
                                        <TableHead>Bytes In</TableHead>
                                        <TableHead>Bytes Out</TableHead>
                                        <TableHead>Packets In</TableHead>
                                        <TableHead>Packets Out</TableHead>
                                        <TableHead>Flow Start</TableHead>
                                        <TableHead>Flow End</TableHead>
                                        <TableHead>TCP Flags</TableHead>
                                        <TableHead>TOS</TableHead>
                                        <TableHead>Src AS</TableHead>
                                        <TableHead>Dst AS</TableHead>
                                        <TableHead>Src Mask</TableHead>
                                        <TableHead>Dst Mask</TableHead>
                                        <TableHead>Next Hop</TableHead>
                                        <TableHead>Input If</TableHead>
                                        <TableHead>Output If</TableHead>
                                        <TableHead>Label</TableHead>
                                        <TableHead className={cn("w-[200px]", stickyColumnClass)}>Attack Category</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {netflow.data.map((record) => (
                                        <TableRow key={record.id}>
                                            <TableCell className="font-medium">{record.timestamp}</TableCell>
                                            <TableCell>{record.source_ip}</TableCell>
                                            <TableCell>{record.destination_ip}</TableCell>
                                            <TableCell>{record.source_port}</TableCell>
                                            <TableCell>{record.destination_port}</TableCell>
                                            <TableCell>{record.protocol}</TableCell>
                                            <TableCell>{record.bytes_in}</TableCell>
                                            <TableCell>{record.bytes_out}</TableCell>
                                            <TableCell>{record.packets_in}</TableCell>
                                            <TableCell>{record.packets_out}</TableCell>
                                            <TableCell>{record.flow_start_time}</TableCell>
                                            <TableCell>{record.flow_end_time}</TableCell>
                                            <TableCell>{record.tcp_flags}</TableCell>
                                            <TableCell>{record.tos}</TableCell>
                                            <TableCell>{record.src_as}</TableCell>
                                            <TableCell>{record.dst_as}</TableCell>
                                            <TableCell>{record.src_mask}</TableCell>
                                            <TableCell>{record.dst_mask}</TableCell>
                                            <TableCell>{record.next_hop}</TableCell>
                                            <TableCell>{record.input_interface}</TableCell>
                                            <TableCell>{record.output_interface}</TableCell>
                                            <TableCell>{record.label}</TableCell>
                                            <TableCell className={stickyColumnClass}>{record.attack_category}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>

                        {/* Komponen Paginasi (tidak berubah) */}
                        <div className="mt-6 flex justify-center items-center gap-2">
                            {netflow.links.map((link, index) => (
                                <Link
                                    key={index}
                                    href={link.url || '#'}
                                    className={`px-4 py-2 text-sm rounded-md transition ${
                                        link.active ? 'bg-blue-600 text-white' : link.url ? 'bg-white text-gray-700 hover:bg-gray-100' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                    }`}
                                    as={link.url ? 'a' : 'span'}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    </>
                ) : (
                    <p>No anomaly records found.</p>
                )}
            </div>
        </AppLayout>
    );
}