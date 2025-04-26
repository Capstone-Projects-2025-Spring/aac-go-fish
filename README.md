[![Open in Codespaces](https://classroom.github.com/assets/launch-codespace-2972f46106e565e64193e422d61a12cf1da4916b45550586e14ef0a7c637dd04.svg)](https://classroom.github.com/open-in-codespaces?assignment_repo_id=17853707)
<div align="center">

# Order Up!
[![Report Issue on Jira](https://img.shields.io/badge/Report%20Issues-Jira-0052CC?style=flat&logo=jira-software)](https://temple-cis-projects-in-cs.atlassian.net/jira/software/c/projects/AGTC/issues)
[![Deploy Docs](https://github.com/Capstone-Projects-2025-Spring/aac-go-fish/actions/workflows/deploy.yml/badge.svg)](https://github.com/Capstone-Projects-2025-Spring/aac-go-fish/actions/workflows/deploy.yml)
[![Documentation Website Link](https://img.shields.io/badge/-Documentation%20Website-brightgreen)](https://capstone-projects-2025-spring.github.io/aac-go-fish/)


</div>

## Project Abstract

Order Up! is a web-based cooking game that offers an interactive and accessible social experience for children in elementary school who struggle with verbal communication, using Augmentative and Alternative Communication (AAC).

The goal of this project is to provide a seamless, interactive, connection building experience for children, regardless of their ability to communicate verbally. This is done by creating an environment where a nonverbal child can drive the game using AAC, resulting in decreased social isolation.

Previously established power dynamics have placed AAC users into reactionary roles. The project challenges these social dynamics by positioning AAC users as active game leaders rather than passive participants. The game is played with relevant AAC on-screen at all times throughout gameplay, so both verbal and nonverbal children can play the game.

The game itself gives each player a role: one player becomes the manager who takes orders from customers and must communicate them to the team. Everyone else becomes cooks who follow the orders and respond to the manager. For both roles, an on-screen interactive AAC interface will cover all communication needs and provide visual indicators when someone else is utilizing its functions.

## How to Run

For development, see [CONTRIBUTING.md](./CONTRIBUTING.md).

## Conceptual Design

The game will be played on two to four separate devices. One player will host the game and others can join using a unique code. The frontend will be built using React.js, which will be used to build and manage the game components. The backend will be built using Python, which will be used to store game identifiers, connections, state, and logic. FastAPI will be used to process requests between the frontend and backend.

## Background

The system used to connect devices together will mirror what is used by Kahoot. Specifically, the creation of the unique code to connect to a game session through a web browser. The game will also abide by AAC system design guidelines and principles, as well as prior research on AAC communication. This includes the use of grid displays, a commonly used tool that creates sentences for people who struggle with verbal communication. Inclusion of features such as showing in-progress AAC communication, as well as a customizable AAC interface, aim to reduce social isolation by meeting the communication needs of each individual user and promoting empathy building.

## Collaborators

[//]: # ( readme: collaborators -start )
<table>
<tr>
    <td align="center">
        <a href="https://github.com/sethbern">
            <img src="https://avatars.githubusercontent.com/u/70603981?v=4" width="100;" alt="sethbern"/>
            <br />
            <sub><b>Seth Bernstein</b></sub>
        </a>
    </td>
    <td align="center">
        <a href="https://github.com/akhilkasturi">
            <img src="https://avatars.githubusercontent.com/u/117470270?v=4" width="100;" alt="akhilkasturi"/>
            <br />
            <sub><b>Akhil Kasturi</b></sub>
        </a>
    </td>
    <td align="center">
        <a href="https://github.com/Matt-Littlefield">
            <img src="https://avatars.githubusercontent.com/u/102620930?v=4" width="100;" alt="Matt-Littlefield"/>
            <br />
            <sub><b>Matt Littlefield</b></sub>
        </a>
    </td>
    <td align="center">
        <a href="https://github.com/Andriy-Luchko">
            <img src="https://avatars.githubusercontent.com/u/112499339?v=4" width="100;" alt="Andriy-Luchko"/>
            <br />
            <sub><b>Andriy Luchko</b></sub>
        </a>
    </td>
    <td align="center">
        <a href="https://github.com/tjmcb">
            <img src="https://avatars.githubusercontent.com/u/143619558?v=4" width="100;" alt="tjmcb"/>
            <br />
            <sub><b>TJ McBride</b></sub>
        </a>
    </td>
    <td align="center">
        <a href="https://github.com/tuo20482">
            <img src="https://avatars.githubusercontent.com/u/143641615?v=4" width="100;" alt="tuo20482"/>
            <br />
            <sub><b>Addison Migash</b></sub>
        </a>
    </td>
    <td align="center">
        <a href="https://github.com/jonathan-d-zhang">
            <img src="https://avatars.githubusercontent.com/u/69145546?v=4" width="100;" alt="jonathan-d-zhang"/>
            <br />
            <sub><b>Jonathan Zhang</b></sub>
        </a>
    </td>
</tr>
</table>

[//]: # ( readme: collaborators -end )
