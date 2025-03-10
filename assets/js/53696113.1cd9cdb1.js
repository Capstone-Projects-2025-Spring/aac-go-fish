"use strict";(self.webpackChunkcreate_project_docs=self.webpackChunkcreate_project_docs||[]).push([[4767],{78641:(e,a,n)=>{n.r(a),n.d(a,{assets:()=>o,contentTitle:()=>r,default:()=>d,frontMatter:()=>i,metadata:()=>c,toc:()=>p});var t=n(74848),s=n(28453);const i={sidebar_position:5},r="Use Case Sequences",c={id:"system-architecture/use-case-sequences",title:"Use Case Sequences",description:"Use Case 1 - Start a Lobby",source:"@site/docs/system-architecture/use-case-sequences.md",sourceDirName:"system-architecture",slug:"/system-architecture/use-case-sequences",permalink:"/aac-go-fish/docs/system-architecture/use-case-sequences",draft:!1,unlisted:!1,editUrl:"https://github.com/Capstone-Projects-2025-Spring/aac-go-fish/edit/main/documentation/docs/system-architecture/use-case-sequences.md",tags:[],version:"current",lastUpdatedBy:"Andriy Luchko",sidebarPosition:5,frontMatter:{sidebar_position:5},sidebar:"docsSidebar",previous:{title:"Development Environment",permalink:"/aac-go-fish/docs/system-architecture/development-environment"},next:{title:"Version Control",permalink:"/aac-go-fish/docs/system-architecture/version-control"}},o={},p=[{value:"<strong>Use Case 1 - Start a Lobby</strong>",id:"use-case-1---start-a-lobby",level:2},{value:"<strong>Use Case 2 - Join a Lobby</strong>",id:"use-case-2---join-a-lobby",level:2},{value:"<strong>Use Case 3 - Start a Game</strong>",id:"use-case-3---start-a-game",level:2},{value:"<strong>Use Case 4 - Lobby starts</strong>",id:"use-case-4---lobby-starts",level:2},{value:"<strong>Use Case 5 - Take a Card from a Player Successfully</strong>",id:"use-case-5---take-a-card-from-a-player-successfully",level:2},{value:"<strong>Use Case 6 - Take a Card from a Player and Fail (&quot;Go Fish&quot;)</strong>",id:"use-case-6---take-a-card-from-a-player-and-fail-go-fish",level:2},{value:"<strong>Use Case 7 - Place a Four-of-a-Kind Set in the Pool Automatically</strong>",id:"use-case-7---place-a-four-of-a-kind-set-in-the-pool-automatically",level:2},{value:"<strong>Use Case 8 - Run Out of Cards and Draw More</strong>",id:"use-case-8---run-out-of-cards-and-draw-more",level:2},{value:"<strong>Use Case 9 - Use Game Text Chat</strong>",id:"use-case-9---use-game-text-chat",level:2},{value:"<strong>Use Case 10 - Receive Message in Game Text Chat</strong>",id:"use-case-10---receive-message-in-game-text-chat",level:2},{value:"<strong>Use Case 11 - Use the AAC Menu</strong>",id:"use-case-11---use-the-aac-menu",level:2},{value:"<strong>Use Case 12 - Receive AAC Communication</strong>",id:"use-case-12---receive-aac-communication",level:2},{value:"<strong>Use Case 13 - Win the Game</strong>",id:"use-case-13---win-the-game",level:2}];function l(e){const a={h1:"h1",h2:"h2",mermaid:"mermaid",strong:"strong",...(0,s.R)(),...e.components};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(a.h1,{id:"use-case-sequences",children:"Use Case Sequences"}),"\n",(0,t.jsx)(a.h2,{id:"use-case-1---start-a-lobby",children:(0,t.jsx)(a.strong,{children:"Use Case 1 - Start a Lobby"})}),"\n",(0,t.jsx)(a.mermaid,{value:'sequenceDiagram\n    participant LobbyCreator as Lobby Creator\n    participant WebApplication as Web Application\n    participant Backend\n    participant OtherPlayers as Other Players\n\n    LobbyCreator->>WebApplication: Accesses the web application\n    WebApplication--\x3e>LobbyCreator: Return landing page\n    LobbyCreator->>WebApplication: Clicks the "Start Lobby" button\n    WebApplication->>Backend: Request unique game code\n    Backend--\x3e>WebApplication: Return unique game code\n    WebApplication--\x3e>LobbyCreator: Return the lobby leader screen with the unique game code\n    LobbyCreator->>OtherPlayers: Shares the game code with external communication'}),"\n",(0,t.jsx)(a.h2,{id:"use-case-2---join-a-lobby",children:(0,t.jsx)(a.strong,{children:"Use Case 2 - Join a Lobby"})}),"\n",(0,t.jsx)(a.mermaid,{value:'sequenceDiagram\n    participant User\n    participant WebApplication as Web Application\n    participant Backend\n\n    User->>WebApplication: Accesses the web application\n    WebApplication--\x3e>User: Return landing page\n    User->>WebApplication: Clicks the "Join Game" button\n    WebApplication--\x3e>User: Displays game code entry screen\n    User->>WebApplication: Enters game code\n    User->>WebApplication: Clicks the "Join" button\n    WebApplication->>Backend: Validates game code and informs of new player\n    Backend--\x3e>WebApplication: Return game details or error\n    WebApplication--\x3e>User: Display lobby page'}),"\n",(0,t.jsx)(a.h2,{id:"use-case-3---start-a-game",children:(0,t.jsx)(a.strong,{children:"Use Case 3 - Start a Game"})}),"\n",(0,t.jsx)(a.mermaid,{value:'sequenceDiagram\n\n    participant LobbyCreator as Lobby Creator\n    participant WebApplication as Web Application\n    participant Backend\n\n    LobbyCreator->>WebApplication: Sees list of players in the lobby\n    LobbyCreator->>WebApplication: Clicks the "Start Game" button\n    WebApplication->>Backend: Initiates game start\n    Backend--\x3e>WebApplication: Return game state and starting hands\n    WebApplication--\x3e>LobbyCreator: Displays game page and starting hand'}),"\n",(0,t.jsx)(a.h2,{id:"use-case-4---lobby-starts",children:(0,t.jsx)(a.strong,{children:"Use Case 4 - Lobby starts"})}),"\n",(0,t.jsx)(a.mermaid,{value:'sequenceDiagram\n\n    participant User\n    participant LobbyLeader as Lobby Leader\n    participant WebApplication as Web Application\n    participant Backend\n\n    LobbyLeader->>WebApplication: Clicks the "Start Game" button\n    WebApplication->>Backend: Initiates game start\n    Backend--\x3e>WebApplication: Return game state and starting hands\n    WebApplication--\x3e>User: Displays message that game has started\n    WebApplication--\x3e>User: Displays game board and starting hand'}),"\n",(0,t.jsx)(a.h2,{id:"use-case-5---take-a-card-from-a-player-successfully",children:(0,t.jsx)(a.strong,{children:"Use Case 5 - Take a Card from a Player Successfully"})}),"\n",(0,t.jsx)(a.mermaid,{value:"sequenceDiagram\n\n    participant User\n    participant WebApplication as Web Application\n    participant Backend\n    participant OtherPlayer as Other Player\n\n    User->>WebApplication: Clicks on a card in their hand to select that type\n    User->>WebApplication: Clicks on another player's hand to request that type from the player\n    WebApplication->>Backend: Update backend on card request\n    Backend--\x3e>WebApplication: Return result of request\n    WebApplication--\x3e>User: Move requested card(s) from the other player's hand to user's hand\n    WebApplication--\x3e>User: Display message confirming result of card request\n    WebApplication--\x3e>User: Continue user's turn\n"}),"\n",(0,t.jsx)(a.h2,{id:"use-case-6---take-a-card-from-a-player-and-fail-go-fish",children:(0,t.jsx)(a.strong,{children:'Use Case 6 - Take a Card from a Player and Fail ("Go Fish")'})}),"\n",(0,t.jsx)(a.mermaid,{value:"sequenceDiagram\n\n    participant User\n    participant WebApplication as Web Application\n    participant Backend\n    participant OtherPlayer as Other Player\n\n    User->>WebApplication: Clicks on a card in their hand to select that type\n    User->>WebApplication: Clicks on another player's hand to request that type from the player\n    WebApplication->>Backend: Update backend on card request\n    Backend--\x3e>WebApplication: Return result (player does not have the requested card)\n    WebApplication--\x3e>User: Display \"Go Fish\" message and sound\n    WebApplication->>WebApplication: Check if card is available in the deck\n    WebApplication--\x3e>User: Give the user a card from the deck (if available)\n    WebApplication->>Backend: Update backend on card draw\n    WebApplication--\x3e>User: End user's turn automatically\n"}),"\n",(0,t.jsx)(a.h2,{id:"use-case-7---place-a-four-of-a-kind-set-in-the-pool-automatically",children:(0,t.jsx)(a.strong,{children:"Use Case 7 - Place a Four-of-a-Kind Set in the Pool Automatically"})}),"\n",(0,t.jsx)(a.mermaid,{value:"sequenceDiagram\n\n    participant User\n    participant WebApplication as Web Application\n    participant Backend\n\n    User->>WebApplication: Collects four matching cards in their hand\n    WebApplication->>Backend: Update backend with the completed set\n    WebApplication--\x3e>User: Move four matching cards to the pool\n    WebApplication--\x3e>User: Display completed set on the board\n    WebApplication--\x3e>User: Display message confirming completed set"}),"\n",(0,t.jsx)(a.h2,{id:"use-case-8---run-out-of-cards-and-draw-more",children:(0,t.jsx)(a.strong,{children:"Use Case 8 - Run Out of Cards and Draw More"})}),"\n",(0,t.jsx)(a.mermaid,{value:"sequenceDiagram\n    participant User\n    participant WebApplication as Web Application\n    participant Backend\n\n    User->>WebApplication: Puts down a set or gets cards taken, hand is empty\n    WebApplication->>Backend: Update backend with request to draw up to 3 cards\n    Backend--\x3e>WebApplication: Return up to 3 cards\n    WebApplication--\x3e>User: Show user receiving up to 3 cards"}),"\n",(0,t.jsx)(a.h2,{id:"use-case-9---use-game-text-chat",children:(0,t.jsx)(a.strong,{children:"Use Case 9 - Use Game Text Chat"})}),"\n",(0,t.jsx)(a.mermaid,{value:'sequenceDiagram\n    participant User\n    participant WebApplication as Web Application\n    participant Backend\n\n    User->>WebApplication: Clicks the "Chat" button\n    WebApplication--\x3e>User: Display chat window\n    User->>WebApplication: Starts typing a message\n    WebApplication--\x3e>User: Display message as it is being typed\n    User->>WebApplication: Clicks the send button\n    WebApplication->>Backend: Send message to backend\n    Backend--\x3e>WebApplication: Acknowledge message received\n    WebApplication--\x3e>User: Display message in chat window'}),"\n",(0,t.jsx)(a.h2,{id:"use-case-10---receive-message-in-game-text-chat",children:(0,t.jsx)(a.strong,{children:"Use Case 10 - Receive Message in Game Text Chat"})}),"\n",(0,t.jsx)(a.mermaid,{value:'sequenceDiagram\n    participant User\n    participant WebApplication as Web Application\n    participant Backend\n    participant Player 2\n    participant Player 2 Web Application\n\n    User->>WebApplication: Clicks the "Chat" button\n    WebApplication->>Backend: Retrieve previously sent messages\n    Backend--\x3e>WebApplication: Return list of previously sent messages\n    WebApplication--\x3e>User: Display previously sent messages\n\n    Player 2->>Player 2 Web Application: Starts typing a message\n    Player 2 Web Application->>Backend: Notify that Player 2 is typing\n    Backend--\x3e>WebApplication: Broadcast that Player 2 is typing\n    WebApplication--\x3e>User: Show indicator that Player 2 is typing\n\n    Player 2 Web Application->>Player 2: Clicks the "Send" button\n    Player 2 Web Application->>Backend: Sends typed message to backend\n    Backend--\x3e>Player 2 Web Application: Acknowledge that the message was received\n    Backend--\x3e>WebApplication: Send out Player 2\'s message to other users\n    WebApplication--\x3e>User: Display Player 2\'s message in chat window'}),"\n",(0,t.jsx)(a.h2,{id:"use-case-11---use-the-aac-menu",children:(0,t.jsx)(a.strong,{children:"Use Case 11 - Use the AAC Menu"})}),"\n",(0,t.jsx)(a.mermaid,{value:"sequenceDiagram\n    participant User\n    participant WebApplication as Web Application\n    participant Backend\n    participant Other User's Frontend\n\n    User->>WebApplication: Clicks the \"AAC Menu\" button\n    WebApplication--\x3e>User: Display AAC Menu with available phrases/words with pictures\n    User->>WebApplication: Selects a phrase or word from the menu\n    WebApplication->>Backend: Send selected phrase or word\n    Backend--\x3e>WebApplication: Acknowledge selected phrase or word\n    WebApplication--\x3e>User: Display selected phrase or word in the chat\n    Backend->>Other User's Frontend: Broadcast selected phrase to other users\n    WebApplication--\x3e>User: Play the phrase out loud"}),"\n",(0,t.jsx)(a.h2,{id:"use-case-12---receive-aac-communication",children:(0,t.jsx)(a.strong,{children:"Use Case 12 - Receive AAC Communication"})}),"\n",(0,t.jsx)(a.mermaid,{value:"sequenceDiagram\n    participant User as User\n    participant WebApplication as Web Application\n    participant Backend\n    participant OtherUsersWebApplication as Other User's Web Application\n    participant OtherUser as Other User\n\n    OtherUser->>OtherUsersWebApplication: Selects AAC phrase or word\n    OtherUsersWebApplication->>Backend: Sends selected AAC phrase or word\n    Backend--\x3e>WebApplication: Broadcasts AAC phrase or word\n    WebApplication--\x3e>User: Displays selected phrase or word in the chat\n    WebApplication--\x3e>User: Plays the phrase or word out loud"}),"\n",(0,t.jsx)(a.h2,{id:"use-case-13---win-the-game",children:(0,t.jsx)(a.strong,{children:"Use Case 13 - Win the Game"})}),"\n",(0,t.jsx)(a.mermaid,{value:"sequenceDiagram\n    participant User\n    participant WebApplication as Web Application\n    participant Backend\n\n    User->>WebApplication: Places second four-of-a-kind set in the pool\n    WebApplication->>Backend: Update backend with the completed set\n    Backend--\x3e>WebApplication: Acknowledge the second completed set and game result\n    WebApplication--\x3e>User: Display message indicating user won\n    WebApplication--\x3e>User: Display end game screen"})]})}function d(e={}){const{wrapper:a}={...(0,s.R)(),...e.components};return a?(0,t.jsx)(a,{...e,children:(0,t.jsx)(l,{...e})}):l(e)}},28453:(e,a,n)=>{n.d(a,{R:()=>r,x:()=>c});var t=n(96540);const s={},i=t.createContext(s);function r(e){const a=t.useContext(i);return t.useMemo((function(){return"function"==typeof e?e(a):{...a,...e}}),[a,e])}function c(e){let a;return a=e.disableParentContext?"function"==typeof e.components?e.components(s):e.components||s:r(e.components),t.createElement(i.Provider,{value:a},e.children)}}}]);