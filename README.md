Run backend:
Expose port 3000 27017
```
cd backend
nodemon server.js
```
Run frontend web page:
```
cd frontend
npm start
```
Environment: 
use docker image `mongodb:5`

View different web page:
Currently only support change compoent tag in `Note-taking-Web-App/frontend/src/App.js`


Reference:
- React Blog
    - UI: https://www.youtube.com/watch?v=tlTdbc5byAs
    - Interface with backend https://www.youtube.com/watch?v=LelifxOrzvw&list=PLj-4DlPRT48lGpll2kC4wOsLj7SEV_lYu&index=3
- CSS style:
    - center block: https://www.youtube.com/watch?v=Ba-Ly1EQg2A
- React Basic
    - https://reactjs.org/docs/introducing-jsx.html
- Router
    - link pages: https://v5.reactrouter.com/web/guides/quick-start

ToDo:
[ ] Home Page
[ ] Take Note Page 
[ ] Share Page 
[ ] About Page
[x] Register Page 
[x] Login Page
[ ] their interface with server