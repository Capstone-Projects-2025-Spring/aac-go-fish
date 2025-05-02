---
sidebar_position: 2
---

# Integration tests

Our backend and frontend contain tests which cover receiving mock WebSocket messages and fully test functionality through the expected message flow.

- Backend: [`test_ws.py`](https://github.com/Capstone-Projects-2025-Spring/aac-go-fish/blob/main/backend/tests/test_ws.py)
- Frontend: [`App.test.jsx`](https://github.com/Capstone-Projects-2025-Spring/aac-go-fish/blob/main/frontend/src/tests/App.test.jsx)

These tests run as part of the docs deploy workflow in order to generate the coverage reports (see [Unit Testing](./unit-testing.md)).

Latests results of the runs can be found in the logs of the coverage parts of the [Deploy Docs Workflow](https://github.com/Capstone-Projects-2025-Spring/aac-go-fish/actions/workflows/deploy.yml).

An example output:

Backend:

============================= 436 passed in 5.29s ==============================

Frontend:

Test Suites: 29 passed, 29 total

Tests:       115 passed, 115 total
