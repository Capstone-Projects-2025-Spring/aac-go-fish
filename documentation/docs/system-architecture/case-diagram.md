# Frontend Diagram

The following is a diagram of the main pieces and components involved in making our frontend application work. The flow goes from left to right where the App or entry point is on the left and the pieces that compose it are to the right. The diagram is sideways to allow everything to fit on the documentation screen.
```mermaid
---
config:
  theme: default
---
classDiagram

direction LR

class App {
  +manages global state
  +routes views by selected role
  +render()
}
class WebSocketContext {
  +connects to backend
  +manages message listeners
  +provides send/receive methods
}
class HomePage {
  +lobby creation/join
  +displays errors
  +sets selected role
}
class AACBoard {
  +shows communication board
  +tracks selected items
}
class BurgerBuilder {
  +handles burger assembly
  +tracks ingredient state
}
class DrinkBuilder {
  +handles drink assembly
  +selects size and type
}
class SideBuilder {
  +handles side assembly
  +raw/chopped/cooked states
}
class Score {
  +displays points earned
}
class StationStartModal {
  +intro UI for role
}
class DayCompleteModal {
  +shows end-of-day stats
  +play sound on show
}
class GameCompleteModal {
  +final score and return button
  +play sound on show
}
class ItemButton {
  +represents AAC symbol
  +onClick selects item
}
class ItemGrid {
  +renders grid of buttons
}
class SelectedItemsDisplay {
  +shows selected symbols
}
class BurgerDisplay {
  +renders current burger visual
}
class BurgerStation {
  +layout and interactive zone for burgers
}
class DrinkDisplay {
  +renders current drink visual
}
class SideDisplay {
  +renders current side item visual
}
class MiniOrderDisplay {
  +tracks and shows orders
  +updated via WebSocket
}
class IngredientScrollPicker {
  +select ingredients via scrolling
}
class Tutorial {
  +step-by-step onboarding
  +highlights UI elements
}
App *-- WebSocketContext
App *-- HomePage
App *-- AACBoard
App *-- BurgerBuilder
App *-- DrinkBuilder
App *-- SideBuilder
App *-- Score
App *-- StationStartModal
App *-- DayCompleteModal
App *-- GameCompleteModal

AACBoard *-- ItemButton
AACBoard *-- ItemGrid
AACBoard *-- SelectedItemsDisplay

BurgerBuilder *-- BurgerDisplay
BurgerBuilder *-- BurgerStation
BurgerBuilder o-- IngredientScrollPicker

DrinkBuilder *-- DrinkDisplay
DrinkBuilder o-- IngredientScrollPicker

SideBuilder *-- SideDisplay
SideBuilder o-- IngredientScrollPicker

```
