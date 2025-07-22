<?php

namespace App\Console\Commands;
use App\Services\NetflowCollectorService;
use Illuminate\Console\Command;

class StartNetflowController extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:start-netflow-controller {--port=2055}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $port = $this->option('port');
        
        $this->info("Starting NetFlow collector on port {$port}");
        
        $collector = new NetflowCollectorService($port);
        
        try {
            $collector->start();
        } catch (\Exception $e) {
            $this->error("Failed to start NetFlow collector: " . $e->getMessage());
            return 1;
        }
        
        return 0;
    }
}
