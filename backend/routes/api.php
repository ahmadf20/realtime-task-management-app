<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\TaskController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
});

Route::get('/ping', fn() => response()->json(['ok' => true]));

Route::middleware('auth:sanctum')->group(function () {
   Route::get('/tasks', [TaskController::class, 'index']);
   Route::get('/tasks/{task}', [TaskController::class,'show']);
   Route::post('/tasks', [TaskController::class, 'store']);
   Route::patch('/tasks/{task}/status', [TaskController::class, 'updateStatus']);
   Route::delete('/tasks/{task}', [TaskController::class, 'destroy']);
});
