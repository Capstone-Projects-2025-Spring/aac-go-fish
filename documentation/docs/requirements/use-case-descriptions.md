# Use Case Descriptions

## **Use Case 1 - Start a Lobby**
1. The user accesses the web application and sees the option to start or join a game.
2. The user clicks the "Start Lobby" button.
3. The user receives a unique game code.
4. The user copies the game code and shares it with friends.

## **Use Case 2 - Join a Lobby**
1. The user accesses the web application and sees the option to start or join a game.
2. The user clicks the "Join Game" button.
3. The user is taken to a new screen to enter the game code.
4. The user enters the game code provided by a friend.
5. The user clicks the "Join" button.
6. The user sees the lobby page.

## **Use Case 3 - Start a Game**
**Starts from:**
* [Use Case 1](#use-case-1---start-a-lobby).

1. The user sees a list of players who have joined the lobby.
2. The system assigns each player an avatar.
3. The user clicks the "Start Game" button to begin the game.
4. The system assigns roles based on the number of players (Manager and cooking stations).
5. The user is taken to the restaurant scene and sees their assigned role.

## **Use Case 4 - Lobby Starts**
**Starts from:**
* [Use Case 2](#use-case-2---join-a-lobby).

1. The user sees a list of players who have joined the lobby.
2. The system assigns each player an avatar.
3. The user waits for the lobby leader to click the "Start Game" button.
4. The system assigns roles based on the number of players (Manager and cooking stations).
5. The user sees a message indicating that the game has started.
6. The user is taken to the restaurant scene and sees their assigned role.

## **Use Case 5 - Manager Receives Customer Order**
**Starts from:**
* [Use Case 3](#use-case-3---start-a-game).
* [Use Case 4](#use-case-4---lobby-starts).

1. The user sees that they are assigned the manager role.
2. The user sees a customer approach the counter.
3. The user sees the customer's order displayed on their screen.
4. The user sees the AAC board available to relay the order to employees.

## **Use Case 6 - Manager Relays Order to Employees**
**Starts from:**
* [Use Case 5](#use-case-5---manager-receives-customer-order).

1. The user presses buttons on the AAC board that open word categories for different stations (burger, sides, drink)
2. The user (manager role) selects phrases or words from the AAC menu to communicate the order details.
3. The user's AAC communication plays aloud on their device for all employees to hear.
4. The user and the other players see speech bubbles appear on the other players' screens showing the communication in progress.
5. The user waits for employees to prepare the order.

## **Use Case 7 - Employee Receives Order**
**Starts from:**
* [Use Case 3](#use-case-3---start-a-game).
* [Use Case 4](#use-case-4---lobby-starts).
* [Use Case 6](#use-case-6---manager-relays-order-to-employees).

1. The user sees that they are assigned to a cooking station (Burger, Sides, or Drinks).
2. The user hears the manager's AAC communication of the customer's order.
3. The user sees the ingredients and cooking tools available at their station.
4. The user begins preparing their part of the order.

## **Use Case 8 - Employee Requests Order Repeat**
**Starts from:**
* [Use Case 7](#use-case-7---employee-receives-order).

1. The user (employee role) needs clarification on their part of the order.
3. The user selects the phrase "Please repeat the order" from the AAC menu.
4. The user's AAC communication plays aloud on their device.
5. The user and other players see speech bubbles appear on the other players' screens showing the communication in progress.
6. The user waits for the manager to relay the order again.

## **Use Case 9 - Prepare Burger**
**Starts from:**
* [Use Case 7](#use-case-7---employee-receives-order).

1. The user (burger employee) begins preparing the burger.
2. The user clicks on ingredients in the correct order (bun, lettuce, patty, cheese, etc.).
5. The user completes the burger preparation.
6. The user sends the completed burger to the order assembly area.

## **Use Case 10 - Prepare Sides**
**Starts from:**
* [Use Case 7](#use-case-7---employee-receives-order).

1. The user (sides employee) begins preparing the side item.
2. The user drags potatoes out onto their work area.
3. The user selects the chopping knife.
2. The user chops potatoes by clicking on them multiple times.
3. The user drags the chopped potatoes to the deep fryer.
4. The user waits for the fries to cook (timer appears).
5. The user removes the fries when they're done cooking.
6. The user sends the completed side to the order assembly area.

## **Use Case 11 - Prepare Drinks**
**Starts from:**
* [Use Case 7](#use-case-7---employee-receives-order).

1. The user (drinks employee) begins preparing the drink.
2. The user clicks the cup to pick it up.
3. The user selects whether to add ice based on the order.
4. The user clicks on the correct drink dispenser.
5. The user fills the cup with the selected drink.
6. The user sends the completed drink to the order assembly area.

## **Use Case 12 - Manager Serves Completed Order**
**Starts from:**
* [Use Case 9](#use-case-9---prepare-burger).
* [Use Case 10](#use-case-10---prepare-sides).
* [Use Case 11](#use-case-11---prepare-drinks).

1. The user (manager) sees that all parts of the order have been prepared and assembled.
2. The user clicks on the completed order.
3. The user clicks the order complete button.
4. The user sees the customer receive the order.
5. The user sees the payment amount and tip based on order accuracy and completion time.
6. The user sees the day's earnings increase.

## **Use Case 13 - Complete a Day**
**Starts from:**
* [Use Case 12](#use-case-12---manager-serves-completed-order).

1. The user sees all customer orders for the day have been completed.
2. The user sees a "Day Complete" message.
3. The user sees a summary of the day's performance (orders completed, earnings, tips).
4. The user clicks the "Continue to Next Day" button.
5. The user sees that the difficulty increases with more customer orders for the next day.

## **Use Case 14 - Complete the Game**
**Starts from:**
* [Use Case 13](#use-case-13---complete-a-day).

1. The user completes the fifth and final day of the game.
2. The user sees a "Game Complete" message.
3. The user sees the final performance summary (total earnings, tips, best day).
5. The user is presented with options to play again.
