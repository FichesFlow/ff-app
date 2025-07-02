## Local Setup

### Development

```bash
# 1. Install dependencies
yarn install

# 2. Start the dev server
yarn dev
```

App will be available at `http://localhost:5173`

### ️Production

```bash
# 1. Build the app, The static files will be in the `dist` directory
yarn build

# 2. Start the server with the built files using your preferred server
yarn preview
```

App will be available at `http://127.0.0.1:3000`

## Docker Setup

### Development

```bash
docker compose up -d
```

App will be available at `http://localhost:5173`

### Production

```bash
docker compose -f compose.prod.yml up --build -d
```

App will be available at `http://127.0.0.1:3000`