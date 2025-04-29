# Use Case Sequences

These are sequence diagrams that line up with the use cases, along with descriptions of how the system functions at each step.

---

## Use Case 1 – Create Lobby
```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Backend

    User->>Frontend: open site
    Frontend-->>User: landing page
    User->>Frontend: click Create Lobby
    Frontend->>Backend: POST /lobby
    Backend-->>Frontend: returns lobby code (3 ingredients)
    Frontend-->>User: show lobby with code images
```
1. Frontend makes a POST /lobby request.  
2. Backend returns a unique three ingredient code.  
3. Frontend shows the lobby screen with the code.

---

## Use Case 2 – Share Lobby via Link
```mermaid
sequenceDiagram
    participant User
    participant Frontend

    User->>Frontend: click copy icon
    Frontend-->>User: URL copied confirmation
```
1. User clicks the copy icon.  
2. Frontend copies the lobby URL and shows a check mark.  
3. User pastes the link in an external chat.

---

## Use Case 3 – Share Lobby Code (Audio)
```mermaid
sequenceDiagram
    participant User
    participant Frontend

    User->>Frontend: click speaker icon
    Frontend-->>User: device speaks ingredient code
```
1. User clicks the speaker icon.  
2. Device reads each ingredient aloud for nearby friends.

---

## Use Case 4 – Join Lobby via Link
```mermaid
sequenceDiagram
    participant User
    participant Browser
    participant Frontend
    participant Backend

    User->>Browser: follow lobby link
    Browser->>Frontend: open home screen with code filled in
    User->>Frontend: click Join Lobby
    Frontend->>Backend: POST /lobby/join with code
    Backend-->>Frontend: returns player id
    Frontend-->>User: show lobby with player count
```
1. Join screen opens with the code filled in.  
2. Frontend POSTS /lobby/join with the code.  
3. Backend returns the player ID.  
4. Frontend shows the lobby view.

---

## Use Case 5 – Join Lobby via Manual Code Entry
```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Backend

    User->>Frontend: set carousel 1
    User->>Frontend: set carousel 2
    User->>Frontend: set carousel 3
    User->>Frontend: click Join Lobby
    Frontend->>Backend: POST /lobby/join with code
    Backend-->>Frontend: returns player id
    Frontend-->>User: show lobby view
```
1. User selects the three ingredients.  
2. Frontend POSTS /lobby/join with the code.  
3. Backend returns the player ID.  
4. Frontend shows the lobby view.

---

## Use Case 6 – Start Game
```mermaid
sequenceDiagram
    participant User as User
    participant Frontend
    participant WS as WebSocket (server)

    User->>Frontend: click Start Game
    Frontend-->>WS: sends start game message
    WS-->>Frontend: broadcasts start game message and role assignments
    Frontend-->>User: shows role assignment in a modal and displays station
```
1. A user in the lobby clicks start game.
2. Frontend sends a start game message over WebSocket.  
3. Server broadcasts start game message and role assignments.  
4. Frontend shows the role modal and station.

---

## Use Case 7 – Walk through Joyride
```mermaid
sequenceDiagram
    participant User
    participant Frontend

    Frontend-->>User: tutorial screen 1
    loop next
        User->>Frontend: click Next
        Frontend-->>User: highlight element + narration
    end
    User->>Frontend: click Done
    Frontend-->>User: overlay closes
```
1. Frontend shows tutorial screens with narration.  
2. User steps through each screen.  
3. User clicks Done and gains control of the station.

---

## Use Case 8 – Skip Joyride
```mermaid
sequenceDiagram
    participant User
    participant Frontend

    Frontend-->>User: tutorial screen 1
    User->>Frontend: click Close
    Frontend-->>User: overlay removed
```
1. Frontend shows the first tutorial screen.  
2. User closes it, and Frontend enables station controls.

---

## Use Case 9 – Manager Receives Customer Order
```mermaid
sequenceDiagram
    participant WS as WebSocket (server)
    participant Frontend
    participant Manager as User

    WS-->>Frontend: sends new customer order
    Frontend-->>Manager: show thought bubble with items
```
1. Server sends a new order message.  
2. Frontend shows the customer's order in a thought bubble.

---

## Use Case 10 – Manager Relays Order with AAC
```mermaid
sequenceDiagram
    participant Manager as User
    participant Frontend

    Manager->>Frontend: select burger folder and corresponding items on AAC board
    Frontend-->>Manager: device plays each item aloud
    Manager->>Frontend: select side folder and corresponding items on AAC board
    Frontend-->>Manager: device plays each item aloud
    Manager->>Frontend: select drink folder and corresponding items on AAC board
    Frontend-->>Manager: device plays each item aloud
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
    participant Frontend

    Employee->>Frontend: click Repeat Order
    Frontend-->>Employee: device asks manager to repeat the order aloud
```
1. Employee presses the button to repeat the order.  
2. Employee’s device asks the manager to repeat the order aloud.

---

## Use Case 13 – Prepare Burger
```mermaid
sequenceDiagram
    participant BurgerCook as User
    participant Frontend
    participant WS as WebSocket (server)
    participant ManagerClient

    BurgerCook->>Frontend: stack ingredients (device names each) and undo any mistakes
    BurgerCook->>Frontend: click Send Burger
    Frontend-->>WS: sends burger complete message
    WS-->>ManagerClient: adds burger to manager screen
```
1. Burger cook selects and stacks ingredients, with the device speaking each ingredient name aloud - if they make any mistake they can press undo to take off the last ingredient placed.
2. Burger cook clicks the Send Burger button.
3. Frontend sends a burger message to the server.
4. Server sends a message to the manager's client, adding the burger to their screen.

---

## Use Case 14 – Prepare Sides

```mermaid
sequenceDiagram
    participant SidesCook as Employee
    participant Frontend as Frontend
    participant WS as WebSocket Server
    participant ManagerView as Manager's Screen

    SidesCook->>Frontend: recall requested side
    SidesCook->>Frontend: click/drag ingredient to board
    Frontend-->>SidesCook: play ingredient name aloud
    SidesCook->>Frontend: click/drag knife onto ingredient
    Frontend-->>SidesCook: show and play chopping animation/sound
    SidesCook->>Frontend: drag chopped pieces to fryer
    Frontend-->>SidesCook: start countdown timer
    Frontend-->>SidesCook: display completed item when done
    SidesCook->>Frontend: click send
    Frontend-->>SidesCook: play confirmation sound
    Frontend-->>WS: send side message
    WS-->>ManagerView: display side item
```

1. User does the cooking process on client side.
2. User clicks the send button.
3. Frontend sends the side message to the server.
4. Server displays the side item on the manager's screen.

---

## Use Case 15 – Prepare Drinks
```mermaid
sequenceDiagram
    participant DrinksCook as Employee
    participant Frontend as Frontend
    participant WS as WebSocket Server
    participant ManagerView as Manager's Screen

    DrinksCook->>Frontend: recall drink size and color
    DrinksCook->>Frontend: click size cup
    DrinksCook->>Frontend: click matching color dispenser
    DrinksCook->>Frontend: hold fill button
    Frontend-->>DrinksCook: show drink filling animation
    DrinksCook->>Frontend: click send
    Frontend-->>DrinksCook: play confirmation sound
    Frontend-->>WS: send drink message
    WS-->>ManagerView: display drink item
```
1. Drinks cook fills the correct drink.  
2. Frontend sends a drink message.  
3. Drink item appears on the manager’s screen.

---

## Use Case 16 – Manager Serves Order
```mermaid
sequenceDiagram
    participant Manager as User
    participant Frontend
    participant WS as WebSocket (server)
    participant Backend
    participant AllPlayers

    Manager->>Frontend: verify order items on screen
    Manager->>Frontend: click Serve Order
    Frontend-->>WS: sends order submitted message
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
    participant Frontend
    participant User

    Server->>Frontend: send day complete message
    Frontend->>User: show Day Complete modal and summary
    User->>Frontend: click Next Day
    Frontend->>User: load next day scene
```
1. Server sends a day complete message.  
2. Frontend shows the Day Complete modal and summary.  
3. User clicks Next Day.  
4. Frontend loads the next day’s restaurant scene.

---

## Use Case 18 – Role Assignment for Next Day
```mermaid
sequenceDiagram
    participant Server as WebSocket (server)
    participant Frontend
    participant User

    Server->>Frontend: send role assignment message (if randomization on)
    Frontend->>User: display new role card
    User->>Frontend: click Confirm Role
    Frontend->>User: load assigned station scene
```
1. Server sends a role assignment message when roles change.  
2. Frontend displays the new role card.  
4. Frontend loads the station screen for that role.

---

## Use Case 19 – Game Complete
```mermaid
sequenceDiagram
    participant Server as WebSocket (server)
    participant Frontend
    participant User

    Server->>Frontend: send game complete message
    Frontend->>User: show Game Complete modal and final summary
    User->>Frontend: click Back to Home
    Frontend->>User: display landing screen
```
1. Server sends a game complete message after the final day.  
2. Frontend shows the Game Complete modal and final summary.  
3. User clicks Back to Home.  
4. Frontend displays the landing screen.
