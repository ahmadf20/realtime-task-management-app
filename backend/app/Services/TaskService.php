<?php

namespace App\Services;

use App\Events\TaskDeleted;
use App\Events\TaskStatusUpdated;
use App\Jobs\ProcessTaskCreated;
use App\Models\Task;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class TaskService
{
    public function getTasksForUser(int $userId, int $perPage = 10, int $page = 1): LengthAwarePaginator
    {
        return Task::where('user_id', $userId)
            ->latest()
            ->paginate(perPage: $perPage, page: $page);
    }

    public function createTask(array $data, int $userId): Task
    {
        $task = Task::create([
            'title' => $data['title'],
            'description' => $data['description'] ?? null,
            'status' => 'pending',
            'user_id' => $userId,
        ]);

        ProcessTaskCreated::dispatch($task);

        return $task;
    }

    public function updateTaskStatus(Task $task, string $status): Task
    {
        $oldStatus = $task->status;
        $task->update(['status' => $status]);

        TaskStatusUpdated::dispatch($task, $oldStatus);

        return $task->fresh();
    }

    public function deleteTask(Task $task): void
    {
        $taskId = $task->id;
        $userId = $task->user_id;

        $task->delete();

        TaskDeleted::dispatch($taskId, $userId);
    }

    public function getTaskById(int $taskId): ?Task
    {
        return Task::find($taskId);
    }

    public function userOwnsTask(int $userId, int $taskId): bool
    {
        return Task::where('id', $taskId)
            ->where('user_id', $userId)
            ->exists();
    }
}
