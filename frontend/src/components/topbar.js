import "./topbar.css"
import { Link } from "react-router-dom";

export default function TopBar({user, setUser}) {
    const handleLogout = () => {
        setUser(null)
        localStorage.setItem("user", null)
    }
    return (
        <div>
        <ul className="topBar">
            <li className="navBarItem">
                <Link to="/home">Home</Link>
            </li>           
            
            <li className="navBarItem">
                <Link to="/tutorial">Tutorial</Link>
            </li>  
            {
                user ? 
                <button className="logoutButton" onClick={handleLogout}>
                    <Link to="/tutorial">{user && "Logout" }</Link>
                </button>  :
                <>
                <button className="registerButton">
                    <Link to="/register">Register</Link>
                </button>
                <button className="loginButton">
                <Link to="/login">Login</Link>
                </button>  
                </>
            }
        </ul>        
        </div>
    )
}