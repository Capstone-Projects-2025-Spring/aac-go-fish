# Use Case Descriptions

## **Use Case 1 - Create Lobby**
1. The user accesses the web application and sees the option to create or join a lobby.
2. The user clicks the "Create Lobby" button.
3. The lobby screen shows three ingredient images that form a unique lobby code.  

---

## **Use Case 2 – Share Lobby via Link**
**Starts from:** [Use Case 1 – Create Lobby](#use-case-1--create-lobby)

1. The user clicks the copy icon below the code images.  
2. The lobby link is copied to the device clipboard.  
3. A brief check mark confirmation appears over the copy button.  
4. The user pastes the link into a chat or text messaging platform outside the game.

---

## **Use Case 3 – Share Lobby Code (Audio)**
**Starts from:** [Use Case 1 – Create Lobby](#use-case-1--create-lobby)

1. The user clicks the speaker icon below the code images.  
2. The device speaks each ingredient aloud in order.
3. Nearby friends hear the spoken code.

---

## **Use Case 4 – Join Lobby via Link**
**Starts from:** [Use Case 2 – Share Lobby via Link](#use-case-2--share-lobby-via-link)

1. The user receives a lobby link from a friend.  
2. The user clicks the link.  
3. The game home screen opens in the browser.  
5. The three ingredient images are already filled in.  
6. The user taps the join lobby button.  
7. The user joins the lobby.


---

## **Use Case 5 – Join Lobby via Manual Code Entry**
**Starts from:** [Use Case 3 – Share Lobby Code (Audio)](#use-case-3--share-lobby-code-audio)

1. The user sets the first carousel to the first ingredient.  
2. The user sets the second carousel to the second ingredient.  
3. The user sets the third carousel to the third ingredient.  
4. The user clicks the join lobby button.  
5. The user joins the lobby.  

---

## **Use Case 6 – Start Game**
**Starts from:**  
* [Use Case 1 – Create Lobby](#use-case-1--create-lobby)  
* [Use Case 4 – Join Lobby via Link](#use-case-4--join-lobby-via-link)  
* [Use Case 5 – Join Lobby via Manual Code Entry](#use-case-5--join-lobby-via-manual-code-entry)

---

1. The lobby screen shows the current player count.
3. The user clicks the start game button.
5. The game selects one player as Manager.
6. The game assigns all other players to cooking stations.
7. A modal showing their assigned station name pops up on each player’s screen.
8. The modal shows the station name.
9. The user taps start on the modal.
10. The game shows the scene for that role.

Note: There will always be a manager, each person added after that will add one more role: burger, drink, and side - in that order.

## **Use Case 7 – Walk-through Joyride**
**Starts from:** [Use Case 6 – Start Game](#use-case-6--start-game)

1. The station scene appears.  
2. A tutorial overlay appears.  
3. The user clicks the next arrow.
3. The overlay highlights an important aspect of the station and explains the scene aloud.  
6. The user clicks the next arrow to go through all important parts of the station and listens to the audio directions.
8. The user clicks the done button.  
9. The overlay closes.  
10. The station screen is now interactive.  

---

## **Use Case 8 – Skip Joyride**
**Starts from:** [Use Case 6 – Start Game](#use-case-6--start-game)

1. The station screen appears.  
2. A tutorial overlay opens at step 1.  
3. The user clicks the close button.  
4. The overlay closes.  
5. The station screen is now interactive.  

---

## **Use Case 9 – Manager Receives Customer Order**
**Starts from:**  
* [Use Case 7 – Walk-through Joyride](#use-case-7--walk-through-joyride)  
* [Use Case 8 – Skip Joyride](#use-case-8--skip-joyride)

1. A customer walks to the counter, thinks for a moment, and presents an order request.  
2. A thought bubble shows the customer's order.

---

## **Use Case 10 – Manager Relays Order with AAC**
**Starts from:** [Use Case 9 – Manager Receives Customer Order](#use-case-9--manager-receives-customer-order)

1. The manager clicks the burger category on the AAC board.  
2. The manager clicks each burger ingredient in the order the customer requested and the device plays aloud selected ingredients.
3. The manager clicks the side category.
4. The manager clicks the side type the customer requested and the device plays the request aloud.
5. The manager clicks the drink category.  
6. The manager clicks the drink size and drink color and the device plays the selections aloud.  

---

## **Use Case 11 – Employee Listens to Order**
**Starts from:**  
* [Use Case 7 – Walk-through Joyride](#use-case-7--walk-through-joyride)  
* [Use Case 8 – Skip Joyride](#use-case-8--skip-joyride)  
* [Use Case 10 – Manager Relays Order with AAC](#use-case-10--manager-relays-order-with-aac)

1. The employee hears the manager's device say the full order aloud.  
2. The employee notes the part that belongs to their station.

---

## **Use Case 12 – Employee Requests Order Repeat**
**Starts from:** [Use Case 11 – Employee Listens to Order](#use-case-11--employee-listens-to-order)

1. The employee clicks the repeat the order button.
2. The device asks the manager to repeat the order aloud.
3. The employee waits for the manager to relay the order again.

## **Use Case 13 – Prepare Burger**
**Starts from:** [Use Case 11 – Employee Listens to Order](#use-case-11--employee-listens-to-order)

1. The burger employee clicks each ingredient in order, they are placed on the burger stack and each ingredient added is read aloud.
2. The burger employee can press the undo button to unplace the last ingredient placed
3. The employee clicks send and hears a confirmation that their burger was sent to the manager.  

---

## **Use Case 14 – Prepare Sides**
**Starts from:** [Use Case 11 – Employee Listens to Order](#use-case-11--employee-listens-to-order)

1. The sides employee recalls the requested side.  
2. The employee clicks the ingredient or drags it to the board to place it and the ingredient is stated aloud.  
3. The employee clicks the knife or drags it onto the ingredient to chop it.
4. The employee sees and hears the ingredient being chopped.  
4. The employee drags the chopped pieces to the fryer.  
5. A timer counts down until the frying is done.
6. The completed item appears.  
7. The employee clicks send and hears a confirmation that the item was sent to the manager.  

---

## **Use Case 15 – Prepare Drinks**
**Starts from:** [Use Case 11 – Employee Listens to Order](#use-case-11--employee-listens-to-order)

1. The drinks employee recalls the drink size and color.  
2. The employee clicks the cup of the correct size.  
4. The employee clicks the matching color dispenser.  
5. The employee clicks fill to watch the drink fill up with the correct drink dispenser.
6. The employee clicks send and hears a confirmation that the drink was sent to the manager.  

## **Use Case 16 – Manager Serves Order**
**Starts from:**  
* [Use Case 13 – Prepare Burger](#use-case-13--prepare-burger)  
* [Use Case 14 – Prepare Sides](#use-case-14--prepare-sides)  
* [Use Case 15 – Prepare Drinks](#use-case-15--prepare-drinks)

1. A burger appears on the manager’s screen when the burger employee finishes it.  
2. A side appears on the manager’s screen when the side employee finishes it.  
3. A drink appears on the manager’s screen when the drink employee finishes it.  
4. The manager clicks the send order button.  
5. The customer is served and leaves the counter.  
6. The earnings total updates on every screen.  

---

## **Use Case 17 – Day Complete**
**Starts from:** [Use Case 16 – Manager Serves Order](#use-case-16--manager-serves-order)

1. The last customer of the day leaves.  
2. A Day Complete banner appears.  
3. A summary shows number of orders and earnings.  
4. The user clicks the next day button.  
5. The summary closes.

---

## **Use Case 18 – Role Assignment for Next Day**
**Starts from:** [Use Case 17 – Day Complete](#use-case-17--day-complete)

1. If randomization is on, every player will be in a new role for the next day.  
2. If randomization is off, the current roles remain.  

---

## **Use Case 19 – Game Complete**
**Starts from:** [Use Case 17 – Day Complete](#use-case-17--day-complete) after the fifth day

1. A Game Complete banner appears.  
2. A final summary shows total earnings.  
4. The user clicks the back to home button.  
5. The home screen loads.  
