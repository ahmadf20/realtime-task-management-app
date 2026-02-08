<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateTaskStatusRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'status' => ['required', 'in:pending,in_progress,done'],
        ];
    }

    public function messages(): array
    {
        return [
            'status.required' => 'The task status is required.',
            'status.in' => 'The task status must be one of: pending, in_progress, or done.',
        ];
    }
}
