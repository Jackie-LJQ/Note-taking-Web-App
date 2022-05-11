1.Start backend service:
Expose port 8000 27017
```
cd backend
npm install
nodemon server.js
```
2.Start frontend service:
```
cd frontend
npm install
npm start
```
Environment: 
use docker image `mongodb:5`

Dependency:
Node
mongo


File Layout
Noting-taking-Web-Application
  |- backend
  |  |- server.js
  |  |- package.js
  |  |- node_modules
  |- frontend
  |  |- public
  |    |- index.html
  |     |- images
  |  |- src
  |    |- components
  |    | |- herder (js&css)
  |    | |- note (js&css)
  |    | |- popup (js&css)
  |    | |- TodoItem (js&css)
  |    | |- TodoList (js&css)
  |    | |- topbar (js&css)
  |    |- pages
  |    |  |- register (js&css)
  |    |  |- login (js&css)
  |    |  |- tutorial (js&css)
  |    |  |- home (js&css)
  |    |  |- notepage (js&css)
  |    |- App (js&css)
  |    |- index (js&css)
  |    |- package.json
  |    |- node_modules
  |- README.md