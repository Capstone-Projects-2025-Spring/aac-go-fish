# How to Run
### Website Access
https://bankruptcyassociation.com

## Running locally
Make sure you have [Docker Compose](https://docs.docker.com/compose/install/) installed to run our project.
- Check that you have Docker Compose installed with the following command:
```
docker compose version
```

- Clone the repository or download the project from the [latest release](https://github.com/Capstone-Projects-2025-Spring/aac-go-fish/releases/).
- Navigate to the root directory of the project `aac-go-fish` which contains the `compose.yaml` files.
- Run the following command from the root directory of the project:
```
docker compose -f compose.dev.yaml up --build
```
Once the containers are running, the project will be accessible from `http://localhost:3000`

## Additional Information

### Backend

The backend uses FastAPI. We use `uv` (see [uv](https://docs.astral.sh/uv/) to
install). Use `uv sync --dev` to create a venv.

To run the tests, use `uv run -- pytest`.

### Frontend

To run the tests, use `npm test -- --coverage --watchAll=false` inside the frontend folder

### Prod
The prod profile uses our public docker containers for deploying to a website, **ignore this if you are not deploying to a website**

`docker compose -f compose.yaml up`

See [the example compose file](./compose-example.yaml) to set up your own.
