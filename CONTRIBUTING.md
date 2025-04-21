# Contributing

## Running everything

### Prod
`docker compose -f compose.yaml up`

### Dev
`docker compose -f compose.dev.yaml up --build`

This will run the frontend, backend, and observability stack. The frontend is accessible at
`localhost:3000` and the backend is accessible at `localhost:3000/api`.

Grafana is accessible at `localhost:3000/grafana`.

## Backend

The backend uses FastAPI. We use `uv` (see [uv](https://docs.astral.sh/uv/) to
install). Use `uv sync --dev` to create a venv.

To run the tests, use `uv run -- pytest`.
