---
sidebar_position: 3
---
# Acceptance Testing

## Lobby

| ID | Scenario                        | Action                                               | Expected Result                                 |
|----|----------------------------------|------------------------------------------------------|-------------------------------------------------|
| 1  | Creating a lobby                | User selects "Create Lobby" using AAC                | Lobby is created and a 3-icon code is generated |
| 2  | Joining a lobby                 | User selects "Join Lobby" and enters 3-icon code     | User successfully joins existing lobby          |
| 3  | Playing lobby code aloud       | After creation, user selects option to play code via AAC | Code is spoken clearly and audibly             |

---

## Manager Role

| ID | Scenario                  | Action                                              | Expected Result                                    |
|----|---------------------------|-----------------------------------------------------|----------------------------------------------------|
| 4  | Customer appears          | A customer image appears with a new order           | Order details (burger, drink, side) are shown clearly to the manager |
| 5  | Communicating order       | Manager uses AAC board to communicate order to stations | Each station receives and understands their part of the order |
| 6  | Repeating order to stations | Manager can repeat the order to the stations at any point | The same order is audibly sent again to all stations |
| 7  | Sending completed order  | Manager selects "Send to Customer" via AAC         | Order is marked as complete, score updates, new order appears |

---

## Burger Station

| ID | Scenario                           | Action                                          | Expected Result                                 |
|----|------------------------------------|-------------------------------------------------|-------------------------------------------------|
| 8  | Burger customization               | User selects ingredients via AAC interface      | Ingredients appear correctly on burger stack    |
| 9  | Removing ingredients               | User removes all ingredients                    | Ingredients visually removed from burger stack  |
| 10 | Confirm and send burger            | User confirms burger via AAC                    | Burger confirmed and sent to the manager        |

---

## Drink Station

| ID | Scenario                           | Action                                          | Expected Result                                 |
|----|------------------------------------|-------------------------------------------------|-------------------------------------------------|
| 11 | Selecting drink size               | User selects drink size (S, M, L) using AAC     | Correct drink size confirmed visually           |
| 12 | Filling drink                      | User presses to fill the drink                  | Drink fills to accurate level visually          |
| 13 | Confirm and send drink             | User confirms drink via AAC                     | Drink confirmed and sent to the manager         |

---

## Side Station

| ID | Scenario                           | Action                                          | Expected Result                                 |
|----|------------------------------------|-------------------------------------------------|-------------------------------------------------|
| 14 | Selecting side item                | User selects base ingredient                    | Side item visually added to the table           |
| 15 | Chopping the base ingredient       | User clicks on the knife to chop item           | Chopping audio plays, chopped item appears      |
| 16 | Frying the base ingredient         | User drags chopped item to fryer                | Side is completed and shown visually            |
| 17 | Finalizing side selection          | User confirms side via AAC                      | Side confirmed and sent to the manager          |

---

## Accessibility

| ID | Scenario                           | Action                                          | Expected Result                                 |
|----|------------------------------------|-------------------------------------------------|-------------------------------------------------|
| 18 | Navigation consistency             | Navigate roles via AAC interface                | Navigation is intuitive and consistent           |
| 19 | Non-text content                   | User is able to rely on images/icons            | Icons/images are clear and intuitive             |
| 20 | Contrast and visual clarity        | Visual clarity evaluated                        | Meets AASPIRE and WCAG contrast standards       |
