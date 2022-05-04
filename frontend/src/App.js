import './App.css';
import Login from "./pages/login"
import Register from './pages/register';
import Home from './pages/home';
import NotePage from './pages/notepage';
import About from './pages/about';
import TopBar from "./components/topbar";

import { Switch, Route } from "react-router-dom";
import { useState } from "react"


function App() {
  //user is userId in database if user was logged in
  let initUser = localStorage.getItem("user")
  if (initUser==="null") {
    initUser = null
  }
  let [user, setUser] = useState(initUser)
  return (    
      <>
      <TopBar user={user} setUser={setUser}/>
      <Switch>
        <Route exact path="/register">
          { user ? <Home user={user} /> : <Register /> }
        </Route>
        <Route path="/login">
          { user ? <Home user={user}/> : <Login /> }
        </Route>
        <Route path="/home">
          {user ? <Home user={user}/> : <Login />}
        </Route>
        <Route path="/page">
          {user ? <NotePage /> : <Login />}
        </Route>
        <Route Path="/about">
          <About />
        </Route>
      </Switch>
      </>
  );
}

export default App;
