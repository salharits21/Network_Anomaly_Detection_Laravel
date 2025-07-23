import { type TopTalker } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

// Fungsi bantuan untuk memformat byte
const formatBytes = (bytes: number, decimals = 2): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

export function TopTalkersCard({ topTalkers }: { topTalkers: TopTalker[] | null }) {
    if (!topTalkers) return <Card className="flex items-center justify-center"><p>Loading top talkers...</p></Card>;

    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle>Top Talkers (by Bytes)</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Source IP</TableHead>
                            <TableHead className="text-right">Total Bytes</TableHead>
                            <TableHead className="text-right">Flows</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {topTalkers.map((talker) => (
                            <TableRow key={talker.source_ip}>
                                <TableCell className="font-mono">{talker.source_ip}</TableCell>
                                <TableCell className="text-right">{formatBytes(talker.total_bytes)}</TableCell>
                                <TableCell className="text-right">{talker.flow_count}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}