import './App.css';
import Login from "./pages/login"
import Register from './pages/register';
import Home from './pages/home';
import NotePage from './pages/notepage';
import About from './pages/about';
import { Switch, Route } from "react-router-dom";


function App() {
  const user = false //check whether user is logged in
  return (    
      <Switch>
        <Route path="/register">
          { user ? <Home /> : <Register /> }
        </Route>
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/home/:userId">
          <Home />
          {/* {user ? <Home /> : <Login />} */}
        </Route>
        <Route path="/page/:pageId">
          {user ? <NotePage /> : <Login />}
        </Route>
        <Route Path="/about">
          <About />
        </Route>
      </Switch>
  );
}

export default App;
