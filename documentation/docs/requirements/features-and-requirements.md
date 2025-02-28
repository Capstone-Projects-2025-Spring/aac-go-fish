---
sidebar_position: 4
---

# Features and Requirements

## Functional

### Lobby Lifecycle
- The system must let users create a game room or join others with a code.
- The system must allow up to 4 users to join a lobby.
- The system must provide each player with an avatar that they will be referred to by.

### AAC Communication
- The system must provide a way for users to communicate using AAC.
- The system must play AAC communication out loud through text-to-speech on the speaker’s device.
- The system must show a speech bubble on other players' devices to indicate that someone else is communicating using AAC.

### Game Start
- The system must include four roles in the game: one manager role and three cooking station roles.
- The system must include the following cooking roles:
  - Burger
  - Sides
  - Drinks
- The system must support gameplay with 2 to 4 players.
- The system must designate one of up to four roles for each player, with the manager role being mandatory.
- The system must assign remaining players to one of the three cooking roles, scaled to the number of players:
  - If there are 2 players, the cook must be assigned to making the burger.
  - If there are 3 players, two cooks must be randomly assigned to making the burger and sides.
  - If there are 4 players, the three cooks must be randomly assigned to all stations.
- The system must allow players to start the game.

### Manager Roles
- The system must allow the manager to receive orders from NPC customers.
- The system must allow the manager to communicate orders to employees using AAC.
- The system must allow the manager to serve the customer once the order has been completed by the employees.

### Employee Roles
- The system must allow employees to communicate requests to repeat orders or update the manager on their status using AAC.
- The system must allow employees to receive orders from the manager.
- The system must allow employees to complete orders by processing ingredients, placing ingredients, and following the manager’s orders.

### Game Progression
- The system must put players through rounds presented as days.
- The system must end each day when all customers have been served.
- The system must include five days in each game session.
- The system must increase the difficulty each day by adding more customer orders each day.

### Scoring
- The system must calculate money earned from an order based on the items completed and a tip based on how quickly the order is completed.

### Game Rules

- The game can be played with 2-4 players.  
- Customers will approach the counter and order a combination of three menu items:  
  - **Burger**
  - **Side**
  - **Drink**  

#### Cooking Process  

- **Burgers**  
  - Assemble buns, lettuce, patty, cheese, tomatoes, and pickles in a specific order.  
  - Cook the patty before assembling the burger.  

- **Drinks**  
  - Fill a cup with the correct drink from a set of machines.  
  - Ensure the correct drink is selected and adjust for ice/no ice preference.  

- **Sides**  
  - Fries
    - Chop potatoes and place them in a deep fryer.  
    - Wait for the fries to cook before serving.  

#### Gameplay Flow  

- The manager will relay customer orders to the employees.  
- Employees must prepare orders at their assigned stations.  
- Once an order is complete, employees send it to the manager, who serves it to the customer.  
- Customers will pay based on the accuracy and speed of order completion.  

#### Scoring System  

- **Order Pricing for Each Correct Item:**  
  - Burger: **$5**  
  - Side: **$2.50**  
  - Drink: **$1**  
- **Tip Bonus:**  
  - 0% to 25% based on completion speed.  
- **Customer Patience Indicator:**  
  - Displays remaining patience to help gauge the tip amount.  
  - Faster service results in higher tips.  

## Non-Functional
- The system must integrate AAC communication seamlessly and ensure it is easy to use.  
- The system must support real-time communication with minimal latency.  
- The system must provide an intuitive and accessible user interface.  
- The system must ensure secure access to game lobbies and protect user data.  
- The system must support many concurrent game lobbies without performance degradation.  
- The system must maintain consistent performance and handle network disruptions gracefully.  
- The system must be designed for easy updates and future feature expansions.  
- The system must be compatible with mobile devices and modern web browsers.
