<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTaskRequest;
use App\Http\Requests\UpdateTaskStatusRequest;
use App\Http\Resources\BaseResource;
use App\Models\Task;
use App\Services\TaskService;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    public function __construct(
        private TaskService $taskService
    ) {
    }

    public function index(Request $request)
    {
        $perPage = $request->input('limit', 10);
        $page = $request->input('page', 1);

        $tasks = $this->taskService->getTasksForUser(
            auth()->id(),
            $perPage,
            $page
        );

        return BaseResource::collection($tasks);
    }

    public function store(StoreTaskRequest $request)
    {
        $task = $this->taskService->createTask(
            $request->validated(),
            $request->user()->id
        );

        return new BaseResource($task);
    }

    public function updateStatus(UpdateTaskStatusRequest $request, Task $task)
    {
        $this->authorize('update', $task);

        $updatedTask = $this->taskService->updateTaskStatus(
            $task,
            $request->validated()['status']
        );

        return new BaseResource($updatedTask);
    }

    public function destroy(Task $task)
    {
        $this->authorize('delete', $task);

        $this->taskService->deleteTask($task);

        return response()->noContent();
    }

    public function show(Task $task)
    {
        $this->authorize('view', $task);

        return new BaseResource($task);
    }
}
