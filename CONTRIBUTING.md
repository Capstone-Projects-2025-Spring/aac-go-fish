# Contributing

## Running everything

### Prod
`docker compose --profile prod up`

### Dev
`docker compose -f compose.yaml -f compose.dev.yaml up --build`

This will run the frontend and backend. The frontend is accessible at
`localhost:8000` and the backend is accessible at `localhost:8000/api`.

## Backend

The backend uses FastAPI. We use `uv` (see [uv](https://docs.astral.sh/uv/) to
install). Use `uv sync --dev` to create a venv.

To run the tests, use `uv run -- pytest`.
