# Brainstone

## Description

Brainstone is a project for a cross-platform online learning system.

## Project Setup Guide

### Prerequisites

- [Node.js](https://nodejs.org/en/download/package-manager) (version 18.x.x - 20.x.x)
- pnpm (install globally if not already installed: `npm install -g pnpm`)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/ndthanh143/elearning-deploy
   ```

2. Change directory to the project
   ```bash
   cd elearning-deploy
   ```
3. Install dependencies using pnpm:

   ```bash
   pnpm install
   ```

4. Create a `.env` file based on `.env.example` and fill in the required environment variables. or use this command to create .env file
   ```bash
   cp .env.example .env
   ```

### Development

To start the development server, run:

```bash
pnpm dev
```

### Production Build

To build the project for production, run:

```bash
pnpm build
```

### Start Production App

To start the app on production mode, run:

```bash
pnpm start
```

## Technologies Used

- [ReactJS](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Material-UI (MUI)](https://mui.com/)
- [React Hook Form (Form handler)](https://react-hook-form.com/)
- [Tanstack Query (v5)](https://tanstack.com/query/latest)
- [React Flow](https://reactflow.dev/)

## Environment Variables

The project uses environment variables. Create a `.env` file in the root directory based on `.env.example`. Ensure to fill in the necessary values.

```
# Example .env file

# API keys and other secrets
VITE_API_URL=
VITE_SOCKET_API_URL=
VITE_CLIENT_URL=
VITE_GOOGLE_CLIENT_ID=
VITE_INVITE_SECRET_KEY=
VITE_API_UPLOAD_VIDEO=
VITE_ADMIN_AUTH_CLIENT_ID=
VITE_ADMIN_AUTH_CLIENT_SECRET=
VITE_API_AUTH_URL=
```

To get the key of those variables, please call the owner of this project to get information !

## Author

- Nguyen Duy Thanh - Frontend Developer
- Truong Tan Phuc - Backend Developer
