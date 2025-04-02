"use strict";(self.webpackChunkcreate_project_docs=self.webpackChunkcreate_project_docs||[]).push([[6024],{28453:(e,n,s)=>{s.d(n,{R:()=>t,x:()=>o});var r=s(96540);const i={},l=r.createContext(i);function t(e){const n=r.useContext(l);return r.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function o(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(i):e.components||i:t(e.components),r.createElement(l.Provider,{value:n},e.children)}},36035:(e,n,s)=>{s.r(n),s.d(n,{assets:()=>a,contentTitle:()=>o,default:()=>h,frontMatter:()=>t,metadata:()=>r,toc:()=>c});const r=JSON.parse('{"id":"requirements/features-and-requirements","title":"Features and Requirements","description":"Functional","source":"@site/docs/requirements/features-and-requirements.md","sourceDirName":"requirements","slug":"/requirements/features-and-requirements","permalink":"/aac-go-fish/docs/requirements/features-and-requirements","draft":false,"unlisted":false,"editUrl":"https://github.com/Capstone-Projects-2025-Spring/aac-go-fish/edit/main/documentation/docs/requirements/features-and-requirements.md","tags":[],"version":"current","lastUpdatedBy":"jonathan-d-zhang","sidebarPosition":4,"frontMatter":{"sidebar_position":4},"sidebar":"docsSidebar","previous":{"title":"General Requirements","permalink":"/aac-go-fish/docs/requirements/general-requirements"},"next":{"title":"Use Case Descriptions","permalink":"/aac-go-fish/docs/requirements/use-case-descriptions"}}');var i=s(74848),l=s(28453);const t={sidebar_position:4},o="Features and Requirements",a={},c=[{value:"Functional",id:"functional",level:2},{value:"AAC Communication",id:"aac-communication",level:3},{value:"Lobby Lifecycle",id:"lobby-lifecycle",level:3},{value:"Game Start",id:"game-start",level:3},{value:"Manager Roles",id:"manager-roles",level:3},{value:"Employee Roles",id:"employee-roles",level:3},{value:"Gameplay Flow",id:"gameplay-flow",level:3},{value:"Game Progression",id:"game-progression",level:3},{value:"Scoring",id:"scoring",level:3},{value:"Game Rules",id:"game-rules",level:3},{value:"Cooking Process",id:"cooking-process",level:4},{value:"Scoring System",id:"scoring-system",level:4},{value:"Non-Functional",id:"non-functional",level:2}];function d(e){const n={h1:"h1",h2:"h2",h3:"h3",h4:"h4",header:"header",li:"li",p:"p",strong:"strong",ul:"ul",...(0,l.R)(),...e.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(n.header,{children:(0,i.jsx)(n.h1,{id:"features-and-requirements",children:"Features and Requirements"})}),"\n",(0,i.jsx)(n.h2,{id:"functional",children:"Functional"}),"\n",(0,i.jsx)(n.h3,{id:"aac-communication",children:"AAC Communication"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsx)(n.li,{children:"The system must provide a way for users to communicate using AAC."}),"\n",(0,i.jsx)(n.li,{children:"The system must play AAC communication out loud through text-to-speech on the speaker\u2019s device."}),"\n",(0,i.jsx)(n.li,{children:"The system must show a speech bubble on other players' devices to indicate that someone else is communicating using AAC."}),"\n"]}),"\n",(0,i.jsx)(n.h3,{id:"lobby-lifecycle",children:"Lobby Lifecycle"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsx)(n.li,{children:"The system must let users create a game room or join others with a code."}),"\n",(0,i.jsx)(n.li,{children:"The system must allow up to 4 users to join a lobby."}),"\n",(0,i.jsx)(n.li,{children:"The system must provide each player with an avatar that they will be referred to by."}),"\n"]}),"\n",(0,i.jsx)(n.h3,{id:"game-start",children:"Game Start"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsx)(n.li,{children:"The system must include four roles in the game: one manager role and three cooking station roles."}),"\n",(0,i.jsxs)(n.li,{children:["The system must include the following cooking roles:","\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsx)(n.li,{children:"Burger"}),"\n",(0,i.jsx)(n.li,{children:"Sides"}),"\n",(0,i.jsx)(n.li,{children:"Drinks"}),"\n"]}),"\n"]}),"\n",(0,i.jsx)(n.li,{children:"The system must support gameplay with 2 to 4 players."}),"\n",(0,i.jsx)(n.li,{children:"The system must designate one of up to four roles for each player, with the manager role being mandatory."}),"\n",(0,i.jsxs)(n.li,{children:["The system must assign remaining players to one of the three cooking roles, scaled to the number of players:","\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsx)(n.li,{children:"If there are 2 players, the cook must be assigned to making the burger."}),"\n",(0,i.jsx)(n.li,{children:"If there are 3 players, two cooks must be randomly assigned to making the burger and sides."}),"\n",(0,i.jsx)(n.li,{children:"If there are 4 players, the three cooks must be randomly assigned to all stations."}),"\n"]}),"\n"]}),"\n",(0,i.jsx)(n.li,{children:"The system must allow players to start the game."}),"\n"]}),"\n",(0,i.jsx)(n.h3,{id:"manager-roles",children:"Manager Roles"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsx)(n.li,{children:"The system must allow the manager to receive orders from NPC customers."}),"\n",(0,i.jsx)(n.li,{children:"The system must allow the manager to communicate orders to employees using AAC."}),"\n",(0,i.jsx)(n.li,{children:"The system must allow the manager to serve the customer once the order has been completed by the employees."}),"\n"]}),"\n",(0,i.jsx)(n.h3,{id:"employee-roles",children:"Employee Roles"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsx)(n.li,{children:"The system must allow employees to communicate requests to repeat orders or update the manager on their status using AAC."}),"\n",(0,i.jsx)(n.li,{children:"The system must allow employees to receive orders from the manager."}),"\n",(0,i.jsx)(n.li,{children:"The system must allow employees to complete orders by processing ingredients, placing ingredients, and following the manager\u2019s orders."}),"\n"]}),"\n",(0,i.jsx)(n.h3,{id:"gameplay-flow",children:"Gameplay Flow"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:["The manager will relay customer orders to the employees.","\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsx)(n.li,{children:"The manager sees the order on their screen and has an AAC board available which has all the tools needed to relay the customer's orders. The AAC board will play out loud on the manager's device, so all the employees can hear the directions, and complete their orders."}),"\n"]}),"\n"]}),"\n",(0,i.jsxs)(n.li,{children:["Employees must prepare orders at their assigned stations.","\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsx)(n.li,{children:"An employee will have access to AAC for requesting the manager to repeat the order."}),"\n"]}),"\n"]}),"\n",(0,i.jsx)(n.li,{children:"Once an order is complete, employees send it to the manager, who serves it to the customer."}),"\n",(0,i.jsx)(n.li,{children:"Customers will pay based on the accuracy and speed of order completion."}),"\n"]}),"\n",(0,i.jsx)(n.h3,{id:"game-progression",children:"Game Progression"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsx)(n.li,{children:"The system must put players through rounds presented as days."}),"\n",(0,i.jsx)(n.li,{children:"The system must end each day when all customers have been served."}),"\n",(0,i.jsx)(n.li,{children:"The system must include five days in each game session."}),"\n",(0,i.jsx)(n.li,{children:"The system must increase the difficulty each day by adding more customer orders each day."}),"\n"]}),"\n",(0,i.jsx)(n.h3,{id:"scoring",children:"Scoring"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsx)(n.li,{children:"The system must calculate money earned from an order based on the items completed and a tip based on how quickly the order is completed."}),"\n"]}),"\n",(0,i.jsx)(n.h3,{id:"game-rules",children:"Game Rules"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsx)(n.li,{children:"The game can be played with 2-4 players."}),"\n",(0,i.jsxs)(n.li,{children:["Customers will approach the counter and order a combination of three menu items:","\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsx)(n.li,{children:(0,i.jsx)(n.strong,{children:"Burger"})}),"\n",(0,i.jsx)(n.li,{children:(0,i.jsx)(n.strong,{children:"Side"})}),"\n",(0,i.jsx)(n.li,{children:(0,i.jsx)(n.strong,{children:"Drink"})}),"\n"]}),"\n"]}),"\n"]}),"\n",(0,i.jsx)(n.h4,{id:"cooking-process",children:"Cooking Process"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:["\n",(0,i.jsx)(n.p,{children:(0,i.jsx)(n.strong,{children:"Burgers"})}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsx)(n.li,{children:"Assemble burger by placing ingredients (buns, lettuce, patty, cheese, etc.) in a specific order."}),"\n"]}),"\n"]}),"\n",(0,i.jsxs)(n.li,{children:["\n",(0,i.jsx)(n.p,{children:(0,i.jsx)(n.strong,{children:"Drinks"})}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsx)(n.li,{children:"Fill a cup with the correct drink from a set of machines."}),"\n",(0,i.jsx)(n.li,{children:"Ensure the correct drink is selected and adjust for ice/no ice preference."}),"\n"]}),"\n"]}),"\n",(0,i.jsxs)(n.li,{children:["\n",(0,i.jsx)(n.p,{children:(0,i.jsx)(n.strong,{children:"Sides"})}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:["Fries","\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsx)(n.li,{children:"Chop potatoes and place them in a deep fryer."}),"\n",(0,i.jsx)(n.li,{children:"Wait for the fries to cook before serving."}),"\n"]}),"\n"]}),"\n"]}),"\n"]}),"\n"]}),"\n",(0,i.jsx)(n.h4,{id:"scoring-system",children:"Scoring System"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.strong,{children:"Base Pricing for Each Item:"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:["Burger: ",(0,i.jsx)(n.strong,{children:"$3"})]}),"\n",(0,i.jsxs)(n.li,{children:["Drink: ",(0,i.jsx)(n.strong,{children:"$2"})]}),"\n",(0,i.jsxs)(n.li,{children:["Side: ",(0,i.jsx)(n.strong,{children:"$1"})]}),"\n"]}),"\n"]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.strong,{children:"Bonus Score for Correctness"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:["Additional ",(0,i.jsx)(n.strong,{children:"$2"})," per correct item"]}),"\n"]}),"\n"]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.strong,{children:"Tip Bonus:"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsx)(n.li,{children:"0% to 25% based on completion speed."}),"\n"]}),"\n"]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.strong,{children:"Customer Patience Indicator:"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsx)(n.li,{children:"Displays remaining patience to help gauge the tip amount."}),"\n",(0,i.jsx)(n.li,{children:"Faster service results in higher tips."}),"\n"]}),"\n"]}),"\n"]}),"\n",(0,i.jsx)(n.h2,{id:"non-functional",children:"Non-Functional"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsx)(n.li,{children:"The system must integrate AAC communication seamlessly and ensure it is easy to use."}),"\n",(0,i.jsx)(n.li,{children:"The system must be compatible with mobile devices and modern web browsers."}),"\n",(0,i.jsx)(n.li,{children:"The system must support real-time communication with minimal latency."}),"\n",(0,i.jsx)(n.li,{children:"The system must provide an intuitive and accessible user interface."}),"\n",(0,i.jsx)(n.li,{children:"The system must ensure secure access to game lobbies and protect user data."}),"\n",(0,i.jsx)(n.li,{children:"The system must support many concurrent game lobbies without performance degradation."}),"\n",(0,i.jsx)(n.li,{children:"The system must maintain consistent performance and handle network disruptions gracefully."}),"\n",(0,i.jsx)(n.li,{children:"The system must be designed for easy updates and future feature expansions."}),"\n"]})]})}function h(e={}){const{wrapper:n}={...(0,l.R)(),...e.components};return n?(0,i.jsx)(n,{...e,children:(0,i.jsx)(d,{...e})}):d(e)}}}]);