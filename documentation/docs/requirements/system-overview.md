---
sidebar_position: 1
---

# System Overview
## Project Abstract
This project is a web-based cooking game that offers an interactive and accessible social experience for children in elementary school who struggle with verbal communication.

The goal of this project is to provide a seamless, interactive, connection building experience for children, regardless of their ability to communicate verbally. This is done by creating an environment where a nonverbal child can drive the game using AAC, resulting in decreased social isolation.

The game is played with relevant Augmentative and Alternative Communication (AAC) on-screen at all times throughout gameplay, so both verbal and nonverbal children can play the game.

The game itself gives each player a role: one player becomes the manager who takes orders from customers and must communicate them to the team. Everyone else becomes cooks who follow the orders and respond to the manager. For both roles, an on-screen interactive AAC interface will cover all communication needs and provide visual indicators when someone else is utilizing its functions.

## Conceptual Design
The game will be played on two to four separate devices. One player will host the game and others can join using a unique code. The frontend will be built using React.js, which will be used to build and manage the game components. The backend will be built using Python, which will be used to store game identifiers, connections, state, and logic. FastAPI will be used to process requests between the frontend and backend.

## Background
The system used to connect devices together will mirror what is used by Kahoot. Specifically, the creation of the unique code to connect to a game session through a web browser. The game will also abide by AAC system design guidelines and principles, as well as prior research on AAC communication. This includes the use of grid displays, a commonly used tool that creates sentences for people who struggle with verbal communication. Inclusion of features such as showing in-progress AAC communication, as well as a customizable AAC interface, aim to reduce social isolation by meeting the communication needs of each individual user and promoting empathy building.
