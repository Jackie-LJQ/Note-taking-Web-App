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
                <button className="lRegisterButton" onClick={handleLogout}>
                    <Link>{user && "Logout" }</Link>
                </button>  :
                <>
                <button className="lRegisterButton">
                    <Link to="/register">Register</Link>
                </button>
                <button className="rLoginButton">
                <Link to="/login">Login</Link>                
                </button>  
                </>
            }                       
        </ul>        
        </div>
    )
}