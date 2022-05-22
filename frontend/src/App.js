import './App.css';
import Login from "./pages/login"
import Register from './pages/register';
import Home from './pages/home';
import NotePage from './pages/notepage';
import Tutorial from './pages/tutorial';
import TopBar from "./components/topbar";
import TodoList from './components/TodoList';
import { Switch, Route, Redirect} from "react-router-dom";
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
        <Route exact path="/register"> { user ? <Redirect to="/home" user={user} /> : < Register /> } </Route>
        <Route exact path="/login"> { user ? <Redirect to="/home" user={user}/> : <Login /> } </Route>
        <Route path="/home"> {
          user ? 
          <>
            <Home user={user}/> 
            <TodoList /> 
          </> : 
          <Redirect to="/login" />
          } 
        </Route>
        <Route path="/note/:pageid"> {user ? <NotePage /> : <Redirect to="/login" />} </Route>
        <Route exact path="/tutorial"> <Tutorial /> </Route> 
        <Route path="/"> {user ? <Redirect to="/home"/> : <Redirect to="/login"/>} </Route> 
      </Switch>
      </>
  );
}

export default App;
