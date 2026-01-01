# IDE Container

A containerized web-based IDE backend built with NestJS, providing real-time terminal access, file management, and WebSocket communication for browser-based development environments.

## Features

- **Terminal Management**: Create and manage multiple terminal sessions with PTY support
- **WebSocket Communication**: Real-time bidirectional communication between server and clients
- **File System Operations**: Watch, modify, and archive project files
- **Docker-based Environment**: Pre-configured with Node.js, Python, and Go development tools
- **Multi-port Support**: Separate ports for communication and web app previews

## Prerequisites

- Docker (for containerized deployment)
- Node.js 16.x or higher (for local development)
- npm or yarn package manager

## Installation

### Local Development

1. Clone the repository:
```bash
git clone https://github.com/SSMM0498/ide-container.git
cd ide-container
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Configure environment variables:
   - Copy `.env` file and adjust settings as needed
   - Default ports: 1234 (communication), 1337 & 1338 (preview)

4. Start the development server:
```bash
npm run start:dev
```

### Docker Deployment

1. Build the Docker image:
```bash
npm run build:Docker
```

2. Run the container:
```bash
npm run start:Docker
```

The container exposes:
- Port 1234: WebSocket communication
- Port 1337: Preview port 1
- Port 1338: Preview port 2

## Usage

The IDE container provides WebSocket endpoints for:

- **Terminal Operations**: Create, interact with, and close terminal sessions
- **File Management**: Real-time file system monitoring and archiving
- **Event Broadcasting**: Distribute events to connected clients

### Example Connection

```javascript
const socket = io('http://localhost:1234');

socket.on('connect', () => {
  console.log('Connected to IDE container');
});
```

## Development Scripts

- `npm run build` - Build the TypeScript project
- `npm run start` - Start the production server
- `npm run start:dev` - Start development server with hot reload
- `npm run start:debug` - Start server in debug mode
- `npm run lint` - Lint and fix code issues
- `npm run format` - Format code with Prettier
- `npm run test` - Run unit tests
- `npm run test:e2e` - Run end-to-end tests
- `npm run test:cov` - Run tests with coverage

## Project Structure

```
ide-container/
├── src/              # Source code
│   ├── constants/    # Application constants
│   ├── events/       # WebSocket event handlers
│   ├── handlers/     # Business logic handlers
│   └── main.ts       # Application entry point
├── test/             # Test files
├── client/           # Client-side code
├── code/             # User code workspace
├── Dockerfile        # Docker configuration
└── package.json      # Project dependencies
```

## Technology Stack

- **Framework**: NestJS 9.x
- **Runtime**: Node.js 16.x
- **WebSockets**: Socket.IO 4.5.x
- **Terminal**: node-pty
- **Language**: TypeScript 4.7.x
- **Testing**: Jest

## Docker Environment

The container includes:
- Ubuntu 20.04 base
- Node.js 16.x with npm and yarn
- Python 3 with pip
- Go 1.17.6
- Git, build-essential, and common development tools

## License

MIT License - see [LICENSE](LICENSE) file for details

## Author

Serigne Saliou Mbacké Mbaye

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
