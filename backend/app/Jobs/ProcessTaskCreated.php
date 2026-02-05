<?php

namespace App\Jobs;

use App\Events\TaskCreated;
use App\Models\Task;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class ProcessTaskCreated implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * The task instance.
     *
     * @var \App\Models\Task
     */
    protected $task;

    /**
     * The number of times the job may be attempted.
     *
     * @var int
     */
    public $tries = 3;

    /**
     * The number of seconds to wait before retrying the job.
     *
     * @var int
     */
    public $retryAfter = 5;

    /**
     * Create a new job instance.
     *
     * @param \App\Models\Task $task
     * @return void
     */
    public function __construct(Task $task)
    {
        $this->task = $task;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        try {
            // Simulate heavy processing (3-5 seconds as required)
            $processingTime = rand(3, 5);
            sleep($processingTime);

            // Refresh the task to ensure we have the latest data and prevent race conditions
            $this->task->refresh();

            // Validate task still exists and has required data
            if (!$this->task->user_id) {
                throw new \InvalidArgumentException('Task must have a user_id for broadcasting');
            }

            // After processing, broadcast the task created event
            TaskCreated::dispatch($this->task);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            \Log::warning('Task was deleted before processing could complete', [
                'task_id' => $this->task->id ?? 'unknown'
            ]);
            // Don't re-throw - task was deleted, so no need to broadcast
        } catch (\Exception $e) {
            \Log::error('Error during task processing: ' . $e->getMessage(), [
                'task_id' => $this->task->id ?? 'unknown',
                'exception' => $e
            ]);
            throw $e; // Re-throw to trigger job retry mechanism
        }
    }

    /**
     * Handle a job failure.
     *
     * @param \Throwable $exception
     * @return void
     */
    public function failed(\Throwable $exception)
    {
        // Log the failure or handle it as needed
        \Log::error('Task processing failed: ' . $exception->getMessage(), [
            'task_id' => $this->task->id,
            'exception' => $exception
        ]);
    }
}
