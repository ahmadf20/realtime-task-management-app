# Realtime Task Management App

A modern, real-time task management application built with Laravel and Next.js, featuring WebSocket communication for live updates and a robust queuing system for background processing.

## Project Overview

This application provides a seamless task management experience with real-time updates, allowing multiple users to collaborate on tasks simultaneously. The system automatically broadcasts changes to all connected clients when tasks are created, updated, or deleted, ensuring everyone stays in sync.

## Tech Stack

### Backend

- **Laravel 12** - PHP framework for API development
- **Laravel Reverb** - WebSocket server for real-time communication
- **Laravel Sanctum** - API authentication
- **MySQL 8.0** - Primary database
- **Redis** - Caching and queue driver
- **PHP 8.2+** - Backend runtime

### Frontend

- **Next.js 16** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS 4** - Utility-first CSS framework
- **Redux Toolkit** - State management
- **Laravel Echo** - WebSocket client
- **Axios** - HTTP client

### Infrastructure

- **Docker & Docker Compose** - Containerization

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Services      │
│   (Next.js)     │    │   (Laravel)     │    │                 │
│                 │    │                 │    │                 │
│ ┌─────────────┐ │    │ ┌─────────────┐ │    │ ┌─────────────┐ │
│ │ React UI    │ │    │ │ API Routes  │ │    │ │ MySQL       │ │
│ │ Redux Store │ │◄──►│ │ Controllers │ │◄──►│ │ Database    │ │
│ │ Echo Client │ │    │ │ Services    │ │    │ │             │ │
│ └─────────────┘ │    │ │ Policies    │ │    │ └─────────────┘ │
│                 │    │ │ Events      │ │    │                 │
└─────────────────┘    │ │ Jobs        │ │    │ ┌─────────────┐ │
                       │ └─────────────┘ │    │ │ Redis       │ │
                       │                 │    │ │ Cache/Queue │ │
                       │ ┌─────────────┐ │    │ │             │ │
                       │ │ Reverb      │ │    │ └─────────────┘ │
                       │ │ WebSocket   │ │    │                 │
                       │ │ Server      │ │    │ ┌─────────────┐ │
                       │ └─────────────┘ │    │ │ Queue       │ │
                       └─────────────────┘    │ │ Worker      │ │
                                              │ │             │ │
                                              │ └─────────────┘ │
                                              └─────────────────┘
```

### Data Flow

1. **User Actions** → Frontend sends HTTP requests to Laravel API
2. **API Processing** → Laravel validates, processes, and stores data
3. **Event Broadcasting** → Laravel fires events that are broadcast via Reverb
4. **Real-time Updates** → All connected clients receive updates via WebSocket
5. **Background Jobs** → Heavy operations are queued and processed asynchronously

## Setup & Running

### Prerequisites

- Docker & Docker Compose
- Node.js 18+ (for local frontend development)
- PHP 8.2+ (for local backend development)
- Composer

### Quick Start with Docker

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd realtime-task-app
   ```

2. **Environment setup**

   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start all services**

   ```bash
   docker-compose up -d
   ```

4. **Install dependencies and setup**

   ```bash
   # Backend setup
   docker-compose exec backend composer install
   docker-compose exec backend php artisan key:generate
   docker-compose exec backend php artisan migrate

   # Frontend setup (if running locally)
   cd frontend
   npm install
   ```

5. **Access the application**
   - Backend API: http://localhost:8000
   - Frontend: http://localhost:3000 (if running locally)
   - Reverb WebSocket: ws://localhost:8080
   - MySQL: localhost:3306
   - Redis: localhost:6379

### Local Development Setup

#### Backend

1. **Install dependencies**

   ```bash
   cd backend
   composer install
   ```

2. **Environment setup**

   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

3. **Database setup**

   ```bash
   php artisan migrate
   php artisan db:seed
   ```

4. **Start development server**

   ```bash
   # Using composer script (recommended)
   composer run dev

   # Or manually
   php artisan serve
   php artisan queue:listen --tries=1 --timeout=0
   php artisan reverb:start
   ```

#### Frontend

1. **Install dependencies**

   ```bash
   cd frontend
   npm install
   ```

2. **Environment setup**

   ```bash
   cp .env.example .env.local
   # Configure NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

## WebSocket Explanation

### How Real-time Communication Works

This application uses **Laravel Reverb** for WebSocket communication, providing real-time updates between the server and connected clients.

#### Architecture

```
Client (Browser)           Laravel Backend         WebSocket Server (Reverb)
     │                           │                        │
     │ 1. WebSocket Connect      │                        │
     ├──────────────────────────►│                        │
     │                           │ 2. Authenticate        │
     │                           ├───────────────────────►│
     │                           │                        │
     │ 3. Listen to Events       │                        │
     │ ◄─────────────────────────│◄───────────────────────│
     │                           │                        │
     │ 4. Task Created/Updated   │                        │
     │ ◄─────────────────────────│ 5. Broadcast Event     │
     │                           ├───────────────────────►│
     │                           │                        │
```

#### Events

The application broadcasts the following real-time events:

- **`TaskCreated`** - Fired when a new task is created
- **`TaskStatusUpdated`** - Fired when a task status changes
- **`TaskDeleted`** - Fired when a task is deleted

#### Client-Side Implementation

```typescript
// Laravel Echo configuration
import Echo from "laravel-echo";
import Pusher from "pusher-js";

window.Echo = new Echo({
  broadcaster: "reverb",
  key: process.env.NEXT_PUBLIC_REVERB_APP_KEY,
  wsHost: process.env.NEXT_PUBLIC_REVERB_HOST,
  wsPort: process.env.NEXT_PUBLIC_REVERB_PORT,
  forceTLS: false,
  enabledTransports: ["ws"],
});

// Listening to task events
window.Echo.private("tasks")
  .listen("TaskCreated", (e) => {
    // Handle new task
  })
  .listen("TaskStatusUpdated", (e) => {
    // Handle task status update
  })
  .listen("TaskDeleted", (e) => {
    // Handle task deletion
  });
```

#### Authentication

WebSocket connections are authenticated using Laravel Sanctum tokens. Clients must include their authentication token when establishing connections to private channels.

## Queue Explanation

### Background Job Processing

The application uses **Redis queues** with **Laravel's queue system** to handle background processing, ensuring the API remains responsive for heavy operations.

#### Queue Configuration

```php
// config/queue.php
'connections' => [
    'redis' => [
        'driver' => 'redis',
        'connection' => 'default',
        'queue' => env('REDIS_QUEUE', 'default'),
        'retry_after' => 90,
        'block_for' => null,
    ],
],
```

#### Queue Jobs

The application includes several queued jobs:

1. **`ProcessTaskCreated`** - Handles post-creation tasks
   - Sending notifications
   - Updating analytics
   - Generating reports

2. **`ProcessTaskStatusUpdate`** - Handles status change side effects
   - Logging changes
   - Triggering workflows
   - Sending notifications

#### Queue Workers

Queue workers process jobs asynchronously:

```bash
# Start queue worker
php artisan queue:work --sleep=3 --tries=3 --max-time=3600

# Monitor queue failures
php artisan queue:failed
```

#### Failed Job Handling

Failed jobs are automatically retried up to 3 times before being marked as failed. Failed jobs can be retried manually:

```bash
# Retry all failed jobs
php artisan queue:retry all

# Retry specific failed job
php artisan queue:retry <job-id>
```

#### Queue Monitoring

The application includes queue monitoring through Laravel's built-in tools:

- **Queue Dashboard** - Monitor job processing in real-time
- **Failed Job Table** - Track and retry failed jobs
- **Job Batching** - Group related jobs together

### Benefits of Queuing

1. **Improved Performance** - Heavy operations don't block API responses
2. **Reliability** - Jobs are retried automatically on failure
3. **Scalability** - Multiple workers can process jobs in parallel
4. **Monitoring** - Built-in tools for tracking job status

## API Endpoints

### Authentication

- `POST /api/login` - User authentication
- `POST /api/logout` - User logout (requires auth)

### Tasks

- `GET /api/tasks` - List all tasks (requires auth)
- `POST /api/tasks` - Create new task (requires auth)
- `GET /api/tasks/{id}` - Get specific task (requires auth)
- `PATCH /api/tasks/{id}/status` - Update task status (requires auth)
- `DELETE /api/tasks/{id}` - Delete task (requires auth)

### Utilities

- `GET /api/ping` - Health check endpoint
- `GET /api/user` - Get authenticated user info (requires auth)

## Development

### Code Style

- **Backend**: Laravel Pint for PHP code formatting
- **Frontend**: ESLint for JavaScript/TypeScript linting

### Testing

```bash
# Backend tests
cd backend
php artisan test

# Frontend tests (when implemented)
cd frontend
npm run test
```

### Database Migrations

```bash
# Create new migration
php artisan make:migration create_table_name

# Run migrations
php artisan migrate

# Rollback migration
php artisan migrate:rollback
```
