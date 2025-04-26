---
sidebar_position: 2
---

# Component Overview

Describes component functionality, their interfaces, and how they fit together. The system block diagram provides an overview (see [system block diagram](../requirements/system-block-diagram.md)).

## Web Application (FastAPI)

Handles game state, lobby creation, and chat. Issues state updates to the Single Page Application.

### External Interface

* HTTP - Creating and joining lobbies.
* WSS - Used for game state updates (whose turn, player queries, etc.) and chat.

#### HTTP

* `POST /create` - Initialize game state, creates randomized lobby code.
* `POST /join` - Users specify a game code for a lobby to join.
* `POST /start` - Starts the game. Only available to users that have created a lobby.

#### WSS

See [WebSocket Schema](../api-specification/wss-schema.mdx) to browse the WebSocket Schema.

## Single Page Application (React)

Two-way communication of moves and chat messages between client and server. Communicates with the FastAPI backend via common WebSocket protocol. Currently, no functionality with HTTP endpoints.
