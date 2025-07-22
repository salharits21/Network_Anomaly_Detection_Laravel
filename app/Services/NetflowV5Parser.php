<?php

namespace App\Services;

class NetflowV5Parser
{
    private $headerSize = 24;
    private $recordSize = 48;

    public function parse($buffer)
    {
        $header = $this->parseHeader($buffer);
        $records = [];

        if ($header['version'] !== 5) {
            throw new \Exception("Unsupported NetFlow version: {$header['version']}");
        }

        for ($i = 0; $i < $header['count']; $i++) {
            $offset = $this->headerSize + ($i * $this->recordSize);
            if ($offset + $this->recordSize <= strlen($buffer)) {
                $records[] = $this->parseRecord($buffer, $offset);
            }
        }

        return [
            'header' => $header,
            'records' => $records
        ];
    }

    private function parseHeader($buffer)
    {
        $data = unpack('nversion/ncount/Nsysuptime/Nunixsecs/Nunixnsecs/Nflowseq/Cengtype/Cengid/nsample', $buffer);
        
        return [
            'version' => $data['version'],
            'count' => $data['count'],
            'sysUptime' => $data['sysuptime'],
            'unixSecs' => $data['unixsecs'],
            'unixNsecs' => $data['unixnsecs'],
            'flowSequence' => $data['flowseq'],
            'engineType' => $data['engtype'],
            'engineId' => $data['engid'],
            'samplingInterval' => $data['sample']
        ];
    }

    private function parseRecord($buffer, $offset)
    {
        $data = unpack(
            'Nsrcaddr/Ndstaddr/Nnexthop/ninput/noutput/NdPkts/NdOctets/Nfirst/Nlast/nsrcport/ndstport/Cpad1/CtcpFlags/Cprot/Ctos/nsrcAs/ndstAs/CsrcMask/CdstMask/npad2',
            substr($buffer, $offset, $this->recordSize)
        );

        return [
            'srcaddr' => $this->ipToString($data['srcaddr']),
            'dstaddr' => $this->ipToString($data['dstaddr']),
            'nexthop' => $this->ipToString($data['nexthop']),
            'input' => $data['input'],
            'output' => $data['output'],
            'dPkts' => $data['dPkts'],
            'dOctets' => $data['dOctets'],
            'first' => $data['first'],
            'last' => $data['last'],
            'srcport' => $data['srcport'],
            'dstport' => $data['dstport'],
            'tcpFlags' => $data['tcpFlags'],
            'prot' => $data['prot'],
            'tos' => $data['tos'],
            'srcAs' => $data['srcAs'],
            'dstAs' => $data['dstAs'],
            'srcMask' => $data['srcMask'],
            'dstMask' => $data['dstMask']
        ];
    }

    private function ipToString($ip)
    {
        return long2ip($ip);
    }
}