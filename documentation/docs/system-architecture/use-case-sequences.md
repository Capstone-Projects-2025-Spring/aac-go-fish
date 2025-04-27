# Use Case Sequences

These are sequence diagrams that line up with the use cases, along with descriptions of how the system functions at each step.

---

## Use Case 1 – Create Lobby
```mermaid
sequenceDiagram
    participant User
    participant WebApp
    participant Backend

    User->>WebApp: open site
    WebApp-->>User: landing page
    User->>WebApp: click Create Lobby
    WebApp->>Backend: POST /lobby
    Backend-->>WebApp: returns lobby code (3 ingredients)
    WebApp-->>User: show lobby with code images
```
1. WebApp makes a POST /lobby request.  
2. Backend returns a unique three ingredient code.  
3. WebApp shows the lobby screen with the code.

---

## Use Case 2 – Share Lobby via Link
```mermaid
sequenceDiagram
    participant User
    participant WebApp

    User->>WebApp: click copy icon
    WebApp-->>User: URL copied confirmation
```
1. User clicks the copy icon.  
2. WebApp copies the lobby URL and shows a check mark.  
3. User pastes the link in an external chat.

---

## Use Case 3 – Share Lobby Code (Audio)
```mermaid
sequenceDiagram
    participant User
    participant WebApp

    User->>WebApp: click speaker icon
    WebApp-->>User: device speaks ingredient code
```
1. User clicks the speaker icon.  
2. Device reads each ingredient aloud for nearby friends.

---

## Use Case 4 – Join Lobby via Link
```mermaid
sequenceDiagram
    participant User
    participant Browser
    participant WebApp
    participant Backend

    User->>Browser: follow lobby link
    Browser->>WebApp: open home screen with code filled in
    User->>WebApp: click Join Lobby
    WebApp->>Backend: POST /lobby/join with code
    Backend-->>WebApp: returns player id
    WebApp-->>User: show lobby with player count
```
1. Join screen opens with the code filled in.  
2. WebApp POSTS /lobby/join with the code.  
3. Backend returns the player ID.  
4. WebApp shows the lobby view.

---

## Use Case 5 – Join Lobby via Manual Code Entry
```mermaid
sequenceDiagram
    participant User
    participant WebApp
    participant Backend

    User->>WebApp: set carousel 1
    User->>WebApp: set carousel 2
    User->>WebApp: set carousel 3
    User->>WebApp: click Join Lobby
    WebApp->>Backend: POST /lobby/join with code
    Backend-->>WebApp: returns player id
    WebApp-->>User: show lobby view
```
1. User selects the three ingredients.  
2. WebApp POSTS /lobby/join with the code.  
3. Backend returns the player ID.  
4. WebApp shows the lobby view.

---

## Use Case 6 – Start Game
```mermaid
sequenceDiagram
    participant User as User
    participant WebApp
    participant WS as WebSocket (server)

    User->>WebApp: click Start Game
    WebApp-->>WS: sends start game message
    WS-->>WebApp: broadcasts start game message and role assignments
    WebApp-->>User: shows role assignment in a modal and displays station
```
1. A user in the lobby clicks start game.
2. WebApp sends a start game message over WebSocket.  
3. Server broadcasts start game message and role assignments.  
4. WebApp shows the role modal and station.

---

## Use Case 7 – Walk through Joyride
```mermaid
sequenceDiagram
    participant User
    participant WebApp

    WebApp-->>User: tutorial screen 1
    loop next
        User->>WebApp: click Next
        WebApp-->>User: highlight element + narration
    end
    User->>WebApp: click Done
    WebApp-->>User: overlay closes
```
1. WebApp shows tutorial screens with narration.  
2. User steps through each screen.  
3. User clicks Done and gains control of the station.

---

## Use Case 8 – Skip Joyride
```mermaid
sequenceDiagram
    participant User
    participant WebApp

    WebApp-->>User: tutorial screen 1
    User->>WebApp: click Close
    WebApp-->>User: overlay removed
```
1. WebApp shows the first tutorial screen.  
2. User closes it, and WebApp enables station controls.

---

## Use Case 9 – Manager Receives Customer Order
```mermaid
sequenceDiagram
    participant WS as WebSocket (server)
    participant WebApp
    participant Manager as User

    WS-->>WebApp: sends new customer order
    WebApp-->>Manager: show thought bubble with items
```
1. Server sends a new order message.  
2. WebApp shows the customer's order in a thought bubble.

---

## Use Case 10 – Manager Relays Order with AAC
```mermaid
sequenceDiagram
    participant Manager as User
    participant WebApp

    Manager->>WebApp: select burger folder and corresponding items on AAC board
    WebApp-->>Manager: device plays each item aloud
    Manager->>WebApp: select side folder and corresponding items on AAC board
    WebApp-->>Manager: device plays each item aloud
    Manager->>WebApp: select drink folder and corresponding items on AAC board
    WebApp-->>Manager: device plays each item aloud
```
1. Manager taps the categories and the items needed in each one to play them aloud via the AAC Board.  
2. Device speaks each part of the order for employees to hear.

---

## Use Case 11 – Employee Listens to Order
```mermaid
sequenceDiagram
    participant ManagerDevice as Manager’s Device
    participant Employee as User

    ManagerDevice-->>Employee: speaks all order parts using AAC
```
1. Employee hears the customer's order request from the manager.  
2. Employee notes the items for their station.

---

## Use Case 12 – Employee Requests Order Repeat
```mermaid
sequenceDiagram
    participant Employee as User
    participant WebApp

    Employee->>WebApp: click Repeat Order
    WebApp-->>Employee: device asks manager to repeat the order aloud
```
1. Employee presses the button to repeat the order.  
2. Employee’s device asks the manager to repeat the order aloud.

---

## Use Case 13 – Prepare Burger
```mermaid
sequenceDiagram
    participant BurgerCook as User
    participant WebApp
    participant WS as WebSocket (server)
    participant ManagerClient

    BurgerCook->>WebApp: stack ingredients (device names each)
    BurgerCook->>WebApp: click Send Burger
    WebApp-->>WS: sends burger complete message
    WS-->>ManagerClient: adds burger to manager screen
```
1. Burger cook selects and stacks ingredients, with the device speaking each ingredient name aloud.
2. Burger cook clicks the Send Burger button.
3. WebApp sends a burger message to the server.
4. Server sends a message to the manager's client, adding the burger to their screen.

---

## Use Case 14 – Prepare Sides

```mermaid
sequenceDiagram
    participant SidesCook as Employee
    participant WebApp as Frontend
    participant WS as WebSocket Server
    participant ManagerView as Manager's Screen

    SidesCook->>WebApp: recall requested side
    SidesCook->>WebApp: click/drag ingredient to board
    WebApp-->>SidesCook: play ingredient name aloud
    SidesCook->>WebApp: click/drag knife onto ingredient
    WebApp-->>SidesCook: show and play chopping animation/sound
    SidesCook->>WebApp: drag chopped pieces to fryer
    WebApp-->>SidesCook: start countdown timer
    WebApp-->>SidesCook: display completed item when done
    SidesCook->>WebApp: click send
    WebApp-->>SidesCook: play confirmation sound
    WebApp-->>WS: send side message
    WS-->>ManagerView: display side item
```

1. User does the cooking process on client side.
2. User clicks the send button.
3. WebApp sends the side message to the server.
4. Server displays the side item on the manager's screen.

---

## Use Case 15 – Prepare Drinks
```mermaid
sequenceDiagram
    participant DrinksCook as Employee
    participant WebApp as Frontend
    participant WS as WebSocket Server
    participant ManagerView as Manager's Screen

    DrinksCook->>WebApp: recall drink size and color
    DrinksCook->>WebApp: click size cup
    DrinksCook->>WebApp: click matching color dispenser
    DrinksCook->>WebApp: hold fill button
    WebApp-->>DrinksCook: show drink filling animation
    DrinksCook->>WebApp: click send
    WebApp-->>DrinksCook: play confirmation sound
    WebApp-->>WS: send drink message
    WS-->>ManagerView: display drink item
```
1. Drinks cook fills the correct drink.  
2. WebApp sends a drink message.  
3. Drink item appears on the manager’s screen.

---

## Use Case 16 – Manager Serves Order
```mermaid
sequenceDiagram
    participant Manager as User
    participant WebApp
    participant WS as WebSocket (server)
    participant Backend
    participant AllPlayers

    Manager->>WebApp: verify order items on screen
    Manager->>WebApp: click Serve Order
    WebApp-->>WS: sends order submitted message
    WS->>Backend: forward submission
    Backend-->>WS: returns order score and earnings
    WS-->>AllPlayers: broadcast updated earnings
```
1. Manager sees completed order items on the screen.  
2. Manager clicks Send Order.  
3. Backend scores the order and broadcasts new earnings.

---

## Use Case 17 – Day Complete
```mermaid
sequenceDiagram
    participant Server as WebSocket (server)
    participant WebApp as Web Application
    participant User

    Server->>WebApp: send day complete message
    WebApp->>User: show Day Complete modal and summary
    User->>WebApp: click Next Day
    WebApp->>User: load next day scene
```
1. Server sends a day complete message.  
2. WebApp shows the Day Complete modal and summary.  
3. User clicks Next Day.  
4. WebApp loads the next day’s restaurant scene.

---

## Use Case 18 – Role Assignment for Next Day
```mermaid
sequenceDiagram
    participant Server as WebSocket (server)
    participant WebApp as Web Application
    participant User

    Server->>WebApp: send role assignment message (if randomization on)
    WebApp->>User: display new role card
    User->>WebApp: click Confirm Role
    WebApp->>User: load assigned station scene
```
1. Server sends a role assignment message when roles change.  
2. WebApp displays the new role card.  
4. WebApp loads the station screen for that role.

---

## Use Case 19 – Game Complete
```mermaid
sequenceDiagram
    participant Server as WebSocket (server)
    participant WebApp as Web Application
    participant User

    Server->>WebApp: send game complete message
    WebApp->>User: show Game Complete modal and final summary
    User->>WebApp: click Back to Home
    WebApp->>User: display landing screen
```
1. Server sends a game complete message after the final day.  
2. WebApp shows the Game Complete modal and final summary.  
3. User clicks Back to Home.  
4. WebApp displays the landing screen.
