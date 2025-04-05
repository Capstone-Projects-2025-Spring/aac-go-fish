"use strict";(self.webpackChunkcreate_project_docs=self.webpackChunkcreate_project_docs||[]).push([[635],{19950:(e,n,s)=>{s.r(n),s.d(n,{assets:()=>l,contentTitle:()=>o,default:()=>d,frontMatter:()=>r,metadata:()=>t,toc:()=>c});const t=JSON.parse('{"id":"requirements/system-block-diagram","title":"System Block Diagram","description":"Web Application","source":"@site/docs/requirements/system-block-diagram.md","sourceDirName":"requirements","slug":"/requirements/system-block-diagram","permalink":"/aac-go-fish/docs/requirements/system-block-diagram","draft":false,"unlisted":false,"editUrl":"https://github.com/Capstone-Projects-2025-Spring/aac-go-fish/edit/main/documentation/docs/requirements/system-block-diagram.md","tags":[],"version":"current","lastUpdatedBy":"Matt-Littlefield","sidebarPosition":2,"frontMatter":{"sidebar_position":2},"sidebar":"docsSidebar","previous":{"title":"System Overview","permalink":"/aac-go-fish/docs/requirements/system-overview"},"next":{"title":"General Requirements","permalink":"/aac-go-fish/docs/requirements/general-requirements"}}');var i=s(74848),a=s(28453);const r={sidebar_position:2},o="System Block Diagram",l={},c=[{value:"Web Application",id:"web-application",level:2},{value:"Single Page Application",id:"single-page-application",level:2}];function p(e){const n={h1:"h1",h2:"h2",header:"header",li:"li",mermaid:"mermaid",p:"p",strong:"strong",ul:"ul",...(0,a.R)(),...e.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(n.header,{children:(0,i.jsx)(n.h1,{id:"system-block-diagram",children:"System Block Diagram"})}),"\n",(0,i.jsx)(n.mermaid,{value:'graph TD\n    Player["\ud83d\udc64 Player [person]<br>Player using the web application game"]\n    WebApp["\ud83d\udc33 \ud83d\udc0d <span style=\'font-size:18px\'><b>Web Application</b></span><br>[Container: <span style=\'font-size:16px\'><b>FastAPI</b></span>]<br>Delivers static content,<br>handles game sessions, and actions"]\n    SPA["\ud83d\udc33 \u269b\ufe0f <span style=\'font-size:18px\'><b>Single Page Application</b></span><br>[Container: <span style=\'font-size:16px\'><b>React</b></span>]<br>Implements AAC and<br>game functionality"]\n\n    Player --\x3e|"Visits domain.com using [HTTPS]"| WebApp\n    Player --\x3e|"Plays game through web browser"| SPA\n    SPA --\x3e|"Displays game state and actions"| Player\n\n    WebApp <--\x3e|"Sends and receives game actions via [WSS]"| SPA\n    WebApp --\x3e|"Delivers to browser"| SPA\n    classDef docker fill:#f9f9f9,stroke:#0db7ed,stroke-width:2px\n    class WebApp,SPA docker'}),"\n",(0,i.jsx)(n.h2,{id:"web-application",children:"Web Application"}),"\n",(0,i.jsx)(n.p,{children:"Responsible for:"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsx)(n.li,{children:"Maintaining game session state, e.g. customer orders, completed orders, and player actions."}),"\n",(0,i.jsx)(n.li,{children:"Broadcasting game actions to all players. Actions done by one player are seen by others."}),"\n"]}),"\n",(0,i.jsx)(n.h2,{id:"single-page-application",children:"Single Page Application"}),"\n",(0,i.jsx)(n.p,{children:"Game runs here. Responsible for:"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsx)(n.li,{children:"Implementing AAC functionality and letting it control the game actions."}),"\n",(0,i.jsx)(n.li,{children:"Implementing game logic and visuals. Game rules should not be validated."}),"\n",(0,i.jsxs)(n.li,{children:["Game updates to ",(0,i.jsx)(n.strong,{children:"Web Application"}),"."]}),"\n"]})]})}function d(e={}){const{wrapper:n}={...(0,a.R)(),...e.components};return n?(0,i.jsx)(n,{...e,children:(0,i.jsx)(p,{...e})}):p(e)}},28453:(e,n,s)=>{s.d(n,{R:()=>r,x:()=>o});var t=s(96540);const i={},a=t.createContext(i);function r(e){const n=t.useContext(a);return t.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function o(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(i):e.components||i:r(e.components),t.createElement(a.Provider,{value:n},e.children)}}}]);