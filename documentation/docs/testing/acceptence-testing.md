---
sidebar_position: 3
---
# Acceptance Testing

[Manual Acceptance Testing Results](https://docs.google.com/spreadsheets/d/1w59h2TDEgsLKfotqiQMtGGDFK_rZyjdIDcJefLkfqpQ/edit?usp=sharing)

## Lobby

| ID | Scenario                        | Action                                               | Expected Result                                 |
|----|----------------------------------|------------------------------------------------------|-------------------------------------------------|
| 1  | Creating a lobby                | User selects the "Create Lobby" button | Lobby is created and a 3-icon code is generated and presented on the screen|
| 2  | Joining a lobby                 | User enters 3-icon code and selects the "Join Lobby" button | User successfully joins existing lobby    |
| 3  | Playing lobby code aloud       | After creation, user selects option to play code via AAC | Code is spoken clearly and audibly from the user's device|

---

## Manager Role

| ID | Scenario                  | Action                                              | Expected Result                                    |
|----|---------------------------|-----------------------------------------------------|----------------------------------------------------|
| 4  | Customer appears          | A customer image appears with a new order           | Order details (burger, drink, side) are shown clearly to the manager |
| 5  | Communicating order       | Manager uses AAC board to communicate order | Order plays aloud from manager's device and employees can understand the orders |
| 6  | Repeating order to stations | Manager can repeat the order to the stations at any point by pressing play all | The currently selected phrase/order is audibly played again |
| 7  | Sending completed order  | Manager selects "Send to Customer"         | Order is marked as complete, score updates, new order appears |

---

## Burger Station

| ID | Scenario                           | Action                                          | Expected Result                                 |
|----|------------------------------------|-------------------------------------------------|-------------------------------------------------|
| 8  | Burger customization               | User selects ingredients via AAC interface      | Ingredients appear correctly on burger stack and ingredients are stated aloud|
| 9  | Removing ingredients               | User removes all ingredients by pressing reset | Ingredients visually removed from burger stack  |
| 10 | Send burger            | User sends the burger                   | Burger is sent to the manager and presented on their screen       |

---

## Drink Station

| ID | Scenario                           | Action                                          | Expected Result                                 |
|----|------------------------------------|-------------------------------------------------|-------------------------------------------------|
| 11 | Selecting drink size and color | User selects drink size (S, M, L) using AAC and color for dispenser    | Correct drink size confirmed visually and cup is placed under correct color dispenser |
| 12 | Filling drink                      | User presses to fill the drink                  | Drink fills to accurate level visually          |
| 13 | Send drink                         | User sends the drink                            | Drink is sent to the manager and presented on their screen|

---

## Side Station

| ID | Scenario                           | Action                                          | Expected Result                                 |
|----|------------------------------------|-------------------------------------------------|-------------------------------------------------|
| 14 | Selecting side item                | User selects base ingredient                    | Side item visually added to the table           |
| 15 | Chopping the base ingredient       | User clicks on the knife to chop item           | Chopping audio plays, chopped item appears      |
| 16 | Frying the base ingredient         | User drags chopped item to fryer                | Side is completed and shown visually            |
| 17 | Send final side selection          | User sends the side                             | Side is sent to the manager and presented on their screen|

---

## Accessibility

| ID | Scenario                           | Action                                          | Expected Result                                 |
|----|------------------------------------|-------------------------------------------------|-------------------------------------------------|
| 18 | Navigation consistency             | Navigate roles via AAC interface                | Navigation is intuitive and consistent           |
| 19 | Non-text content                   | User is able to rely on images/icons            | Icons/images are clear and intuitive             |
| 20 | Contrast and visual clarity        | Visual clarity evaluated                        | Meets AASPIRE and WCAG contrast standards       |
