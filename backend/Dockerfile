FROM python:3.12.7-slim-bookworm@sha256:60d9996b6a8a3689d36db740b49f4327be3be09a21122bd02fb8895abb38b50d AS builder
ENV UV_COMPILE_BYTECODE=1 UV_LINK_MODE=copy

COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

WORKDIR /app

RUN --mount=type=cache,target=/root/.cache/uv \
    --mount=type=bind,from=metadata,source=uv.lock,target=uv.lock \
    --mount=type=bind,from=metadata,source=pyproject.toml,target=pyproject.toml \
    uv sync --frozen --no-install-project --no-dev

ADD . /app/
RUN --mount=type=cache,target=/root/.cache/uv \
    --mount=type=bind,from=metadata,source=uv.lock,target=uv.lock \
    --mount=type=bind,from=metadata,source=pyproject.toml,target=pyproject.toml \
    uv sync --frozen --no-dev

FROM python:3.12.7-slim-bookworm@sha256:60d9996b6a8a3689d36db740b49f4327be3be09a21122bd02fb8895abb38b50d AS prod

COPY --from=builder --chown=app:app /app /app

ENV PATH="/app/.venv/bin:$PATH"

WORKDIR /app

CMD ["fastapi", "run", "./hello.py", "--proxy-headers", "--port", "8000"]
