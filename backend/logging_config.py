import logging
import logging.config
import time
import typing

import structlog
from asgi_correlation_id.context import correlation_id
from fastapi import Request
from starlette.types import ASGIApp, Message, Receive, Scope, Send


def configure_logger(config: dict[str, typing.Any], additional_processors: list[typing.Any] | None = None) -> None:
    """
    Configure the logger instance.

    Args:
        config: The configuration to be applied.
        additional_processors: Any additional processors to be configured.
    """
    # Define the shared processors, regardless of whether API is running in prod or dev.
    shared_processors: list[structlog.types.Processor] = [
        structlog.contextvars.merge_contextvars,
        structlog.stdlib.add_log_level,
        structlog.stdlib.PositionalArgumentsFormatter(),
        structlog.stdlib.ExtraAdder(),
        structlog.processors.format_exc_info,
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.processors.StackInfoRenderer(),
        structlog.processors.CallsiteParameterAdder(
            {
                structlog.processors.CallsiteParameter.FILENAME,
                structlog.processors.CallsiteParameter.FUNC_NAME,
                structlog.processors.CallsiteParameter.MODULE,
                structlog.processors.CallsiteParameter.LINENO,
            },
        ),
    ]

    if additional_processors:
        shared_processors.extend(additional_processors)

    config.update(
        {
            "version": 1,
            "formatters": {
                "json": {
                    "()": structlog.stdlib.ProcessorFormatter,
                    "processors": [
                        structlog.stdlib.ProcessorFormatter.remove_processors_meta,
                        structlog.processors.JSONRenderer(),
                    ],
                    "foreign_pre_chain": shared_processors,
                },
                "development": {
                    "()": structlog.stdlib.ProcessorFormatter,
                    "processors": [
                        structlog.stdlib.ProcessorFormatter.remove_processors_meta,
                        structlog.dev.ConsoleRenderer(colors=False),
                    ],
                    "foreign_pre_chain": shared_processors,
                },
            },
        },
    )

    logging.config.dictConfig(config)

    structlog.configure(
        processors=[*shared_processors, structlog.stdlib.ProcessorFormatter.wrap_for_formatter],
        logger_factory=structlog.stdlib.LoggerFactory(),
        wrapper_class=structlog.stdlib.BoundLogger,
        cache_logger_on_first_use=True,
    )


class LoggingMiddleware:
    """
    ASGI middleware for logging.

    Attributes
    ----------
        app: The ASGI app to augment.
    """

    def __init__(self, app: ASGIApp) -> None:
        self.app = app

    async def __call__(self, scope: Scope, receive: Receive, send: Send) -> None:
        """
        Call the middleware.

        Args:
            scope: The scope of the request.
            receive: The function to read the request data.
            send: The function to write the response data.
        """
        if scope["type"] != "http":
            await self.app(scope, receive, send)

            return

        info: Message = {"response": {}}

        async def inner_send(message: Message) -> None:
            if message["type"] == "http.response.start":
                info["response"] = message

            await send(message)

        request = Request(scope)

        structlog.contextvars.clear_contextvars()
        request_id = correlation_id.get() or ""
        url = request.url
        client_host = request.client.host if request.client else ""
        client_port = request.client.port if request.client else ""

        structlog.contextvars.bind_contextvars(
            request_id=request_id,
            url=url,
            network={"client": {"ip": client_host, "port": client_port}},
        )

        logger: structlog.stdlib.BoundLogger = structlog.get_logger()
        start_time = time.perf_counter_ns()

        try:
            await self.app(scope, receive, inner_send)

        except Exception:
            logger.exception("Uncaught exception")

            info["response"]["status"] = 500
            raise
        finally:
            process_time = time.perf_counter_ns() - start_time
            status_code: int = info["response"]["status"]
            http_method = request.method

            http_version = request.scope["http_version"]
            await logger.ainfo(
                f'{client_host}:{client_port} - "{http_method} {url} HTTP/{http_version}" {status_code}',
                http={
                    "url": str(url),
                    "status_code": status_code,
                    "method": http_method,
                    "request_id": request_id,
                    "version": http_version,
                },
                duration=process_time,
                tag="request",
            )
