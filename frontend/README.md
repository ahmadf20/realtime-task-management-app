# Real-Time Task Management Frontend

A Next.js frontend application for real-time task management with WebSocket integration.

## Features

- **Authentication**: Token-based login/logout system
- **Task Management**: Create, read, update, and delete tasks
- **Real-time Updates**: Live task updates using Laravel Echo and WebSocket
- **State Management**: Redux Toolkit for global state management
- **Responsive UI**: Clean, modern interface using Tailwind CSS

## Tech Stack

- **Framework**: Next.js 16+ with App Router
- **Language**: TypeScript
- **State Management**: Redux Toolkit
- **UI**: Tailwind CSS
- **WebSocket**: Laravel Echo with Pusher/Reverb
- **HTTP Client**: Axios
- **Authentication**: Token-based (Bearer tokens)

## Prerequisites

- Node.js 18+
- Backend server running on http://localhost:8000
- WebSocket server (Reverb) running on http://localhost:8080

## Getting Started

1. Install dependencies:

```bash
pnpm install
```

2. Set up environment variables:

```bash
cp .env.local.example .env.local
```

3. Configure your environment variables in `.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_REVERB_APP_KEY=laravel-key
NEXT_PUBLIC_REVERB_HOST=localhost
NEXT_PUBLIC_REVERB_PORT=8080
NEXT_PUBLIC_REVERB_SCHEME=http
NEXT_PUBLIC_REVERB_USE_TLS=false
```

4. Run the development server:

```bash
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── login/             # Login page
│   ├── tasks/             # Tasks management page
│   └── layout.tsx         # Root layout with Redux provider
├── components/            # Reusable React components
│   ├── TaskForm.tsx       # Task creation form
│   ├── TaskList.tsx       # Task list with status updates
│   └── WebSocketStatus.tsx # Connection status indicator
├── store/                 # Redux store configuration
│   ├── index.ts           # Store setup
│   ├── api.ts             # Axios API service
│   └── slices/            # Redux slices
│       ├── authSlice.ts   # Authentication state
│       ├── tasksSlice.ts  # Tasks state
│       └── websocketSlice.ts # WebSocket connection state
├── services/              # External services
│   └── websocket.ts       # WebSocket initialization
└── providers/             # React providers
    └── ReduxProvider.tsx  # Redux store provider
```

## Key Features

### Authentication

- Login page with email/password
- Token storage in localStorage
- Automatic redirect based on auth status
- Token expiration handling

### Task Management

- Create tasks with title and description
- Update task status (pending, in_progress, done)
- Delete tasks
- Paginated task list
- Real-time updates across multiple browser tabs

### WebSocket Integration

- Laravel Echo for WebSocket communication
- Real-time task creation/updates/deletion
- Connection status indicator
- Automatic reconnection handling

### State Management

- Redux Toolkit for predictable state updates
- Separate slices for auth, tasks, and WebSocket
- Async thunks for API calls
- Error handling and loading states

## API Integration

The frontend integrates with the following backend API endpoints:

- `POST /api/login` - User authentication
- `POST /api/logout` - User logout
- `GET /api/tasks` - List tasks (paginated)
- `POST /api/tasks` - Create new task
- `PATCH /api/tasks/{id}/status` - Update task status
- `DELETE /api/tasks/{id}` - Delete task

## WebSocket Events

Listens for real-time events on the `tasks` channel:

- `.TaskCreated` - New task created
- `.TaskUpdated` - Task status updated
- `.TaskDeleted` - Task deleted

## Development

### Adding New Features

1. Create new components in `src/components/`
2. Add Redux slices in `src/store/slices/`
3. Update API service in `src/store/api.ts`
4. Add WebSocket listeners in `src/services/websocket.ts`

### Environment Variables

All frontend environment variables must be prefixed with `NEXT_PUBLIC_` to be exposed to the browser.

### Build and Deploy

```bash
pnpm build
pnpm start
```

## Troubleshooting

### WebSocket Connection Issues

- Ensure Reverb server is running on port 8080
- Check environment variables configuration
- Verify backend CORS settings

### Authentication Issues

- Check API URL in environment variables
- Verify backend authentication endpoints
- Clear localStorage if token issues occur

### Build Issues

- Ensure all TypeScript errors are resolved
- Check for missing dependencies
- Verify environment variables are set
