<?php

namespace App\Http\Controllers;

use App\Events\TaskDeleted;
use App\Events\TaskStatusUpdated;
use App\Http\Resources\BaseResource;
use App\Jobs\ProcessTaskCreated;
use App\Models\Task;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    public function index(Request $request)
    {
        $perPage = $request->input('limit', 10);
        $page = $request->input('page', 1);

        return BaseResource::collection(
            Task::where('user_id', auth()->id())->latest()->paginate(perPage: $perPage, page: $page)
        );
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
        ]);

        $task = Task::create([
            'title' => $data['title'],
            'description' => $data['description'] ?? null,
            'status' => 'pending',
            'user_id' => $request->user()->id,
        ]);

        // Dispatch the queue job for processing
        ProcessTaskCreated::dispatch($task);

        return new BaseResource($task);
    }

    public function updateStatus(Request $request, Task $task)
    {
        $this->authorize('update', $task);

        $data = $request->validate([
            'status' => ['required', 'in:pending,in_progress,done'],
        ]);

        $oldStatus = $task->status;
        $task->update($data);

        // Broadcast the status update event
        TaskStatusUpdated::dispatch($task, $oldStatus);

        return new BaseResource($task);
    }

    public function destroy(Task $task)
    {
        $this->authorize('delete', $task);

        $taskId = $task->id;
        $userId = $task->user_id;

        $task->delete();

        // Broadcast the task deleted event
        TaskDeleted::dispatch($taskId, $userId);

        return response()->noContent();
    }

    public function show(Task $task)
    {
        $this->authorize('view', $task);

        return new BaseResource($task);
    }
}
