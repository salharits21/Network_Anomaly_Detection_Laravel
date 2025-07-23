import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { Protocol, type BreadcrumbItem, type Stats } from '@/types';
import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatsCard } from '@/components/dashboards/StatsCard';
import { ProtocolsCard } from '@/components/dashboards/ProtocolsCard';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard() {
    // State untuk menyimpan data dari API
    const [stats, setStats] = useState<Stats | null>(null);
    const [protocols, setProtocols] = useState<Protocol[] | null>(null);
    /*const [topTalkers, setTopTalkers] = useState<TopTalker[] | null>(null);*/

    // useEffect untuk mengambil data saat komponen dimuat
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Ambil semua data secara bersamaan
                const [statsRes, protocolsRes/*, topTalkersRes*/] = await Promise.all([
                    axios.get('/api/netflow/stats'),
                    axios.get('/api/netflow/protocols'),
                    /*axios.get('/api/top-talkers?limit=10'),*/ // Ambil top 10
                ]);
                setStats(statsRes.data);
                setProtocols(protocolsRes.data);
                /*setTopTalkers(topTalkersRes.data);*/
            } catch (error) {
                console.error("Failed to fetch dashboard data:", error);
            }
        };

        fetchData();
    }, []); // Array kosong berarti efek ini hanya berjalan sekali
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    {/* Kiri Atas: Stats */}
                    <StatsCard stats={stats} />

                    {/* Tengah Atas: Placeholder */}
                    <Card>
                         <CardHeader><CardTitle>Traffic Over Time</CardTitle></CardHeader>
                         <CardContent className="relative aspect-video">
                            <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <p className="text-muted-foreground text-sm">Chart coming soon</p>
                            </div>
                         </CardContent>
                    </Card>

                    {/* Kanan Atas: Protocols */}
                    <ProtocolsCard protocols={protocols} />
                </div>
                <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
                    <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                </div>
            </div>
        </AppLayout>
    );
}
