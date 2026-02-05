<?php

namespace App\Events;

use App\Models\Task;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class TaskStatusUpdated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * The task instance.
     *
     * @var \App\Models\Task
     */
    public $task;

    /**
     * The old status.
     *
     * @var string
     */
    public $oldStatus;

    /**
     * Create a new event instance.
     *
     * @param \App\Models\Task $task
     * @param string $oldStatus
     * @return void
     */
    public function __construct(Task $task, string $oldStatus)
    {
        $this->task = $task;
        $this->oldStatus = $oldStatus;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return \Illuminate\Broadcasting\Channel|array
     */
    public function broadcastOn()
    {
        return new PrivateChannel('tasks.' . $this->task->user_id);
    }

    /**
     * The event's broadcast name.
     *
     * @return string
     */
    public function broadcastAs()
    {
        return 'task.status.updated';
    }

    /**
     * Get the data to broadcast.
     *
     * @return array
     */
    public function broadcastWith()
    {
        return [
            'task' => [
                'id' => $this->task->id,
                'title' => $this->task->title,
                'description' => $this->task->description,
                'status' => $this->task->status,
                'old_status' => $this->oldStatus,
                'updated_at' => $this->task->updated_at,
            ]
        ];
    }
}
