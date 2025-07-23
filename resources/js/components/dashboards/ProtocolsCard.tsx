import { type Protocol } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const protocolColors: { [key: string]: string } = {
    TCP: 'bg-blue-500',
    UDP: 'bg-green-500',
    ICMP: 'bg-red-500',
    Other: 'bg-gray-500',
};

export function ProtocolsCard({ protocols }: { protocols: Protocol[] | null }) {
    if (!protocols) return <Card className="flex items-center justify-center"><p>Loading protocols...</p></Card>;
    
    const totalFlows = protocols.reduce((sum, p) => sum + p.flow_count, 0);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Protocol Distribution</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {protocols.map((p) => {
                    const percentage = totalFlows > 0 ? (p.flow_count / totalFlows) * 100 : 0;
                    return (
                        <div key={p.protocol_name}>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="font-medium">{p.protocol_name}</span>
                                <span className="text-muted-foreground">{percentage.toFixed(1)}%</span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2.5">
                                <div
                                    className={`${protocolColors[p.protocol_name] || 'bg-gray-400'} h-2.5 rounded-full`}
                                    style={{ width: `${percentage}%` }}
                                ></div>
                            </div>
                        </div>
                    );
                })}
            </CardContent>
        </Card>
    );
}