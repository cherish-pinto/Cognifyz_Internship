# Advanced Server Functionality

A robust Node.js/Express server showcasing advanced server-side features.

## Features

- **Request Middleware**: Automatic logging and request tracking
- **Caching Layer**: Redis-based caching with TTL support
- **Job Queue**: Background task processing using Bull queues
- **Email Service**: Queue-based email job processing
- **Data Processing**: Async data processing pipeline
- **Server Stats**: Real-time performance metrics

## Installation

```bash
npm install
```

## Requirements

- Node.js (v14 or higher)
- Redis server running locally on port 6379

## Usage

```bash
npm start
```

Visit `http://localhost:3000` to access the web interface.

## API Endpoints

- `GET /api/data` - Fetch cached user data
- `POST /api/send-email` - Queue email job
- `POST /api/process-data` - Queue data processing job
- `GET /api/job/:jobId` - Check job status
- `GET /api/stats` - Server statistics

## Architecture

- **Express**: Web framework
- **Redis**: Caching and session management
- **Bull**: Job queue library
- **Body Parser**: Request middleware
- **CORS**: Cross-origin support

## License

MIT
