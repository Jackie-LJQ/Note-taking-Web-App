import './App.css';
import Login from "./pages/login"
import Register from './pages/register';
import Home from './pages/home';
import NotePage from './pages/notepage';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";


function App() {
  const user = true //check whether user is logged in
  return (
    <Router>
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
      </Switch>
    </Router>
  );
}

export default App;
