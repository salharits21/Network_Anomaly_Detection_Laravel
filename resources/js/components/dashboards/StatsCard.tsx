import { type Stats } from '@/types'; // Anda mungkin perlu mendefinisikan tipe ini
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, FileStack, ArrowRightLeft, RadioTower } from 'lucide-react';

// Fungsi bantuan untuk memformat angka besar
const formatNumber = (num: number): string => {
    if (num >= 1e9) return (num / 1e9).toFixed(2) + ' B';
    if (num >= 1e6) return (num / 1e6).toFixed(2) + ' M';
    if (num >= 1e3) return (num / 1e3).toFixed(2) + ' K';
    return num.toString();
};

const StatItem = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) => (
    <div className="flex items-center gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">{icon}</div>
        <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="text-xl font-bold">{value}</p>
        </div>
    </div>
);

export function StatsCard({ stats }: { stats: Stats | null }) {
    if (!stats) return <Card className="flex items-center justify-center"><p>Loading stats...</p></Card>;

    return (
        <Card>
            <CardHeader>
                <CardTitle>General Statistics</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
                <StatItem icon={<FileStack size={20} />} label="Total Flows" value={formatNumber(stats.totalFlows)} />
                <StatItem icon={<ArrowRightLeft size={20} />} label="Total Bytes" value={formatNumber(stats.totalBytes)} />
                <StatItem icon={<ArrowRightLeft size={20} />} label="Total Packtes" value={formatNumber(stats.totalPackets)} />
                <StatItem icon={<Users size={20} />} label="Unique Sources" value={formatNumber(stats.uniqueSources)} />
                <StatItem icon={<RadioTower size={20} />} label="Unique Destinations" value={formatNumber(stats.uniqueDestinations)} />
            </CardContent>
        </Card>
    );
}