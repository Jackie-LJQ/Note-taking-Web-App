import "./topbar.css"
import { Link } from "react-router-dom";

export default function TopBar({user, setUser}) {
    const handleLogout = () => {
        setUser(null)
        localStorage.setItem("user", null)
    }
    return (
        <ul className="topBar">
            <li className="navBarItem">
                <Link to="/home/123">Home</Link>
            </li>
            {
                user ? 
                <li className="navBarItem" onClick={handleLogout}>
                    <Link>{user && "Logout" }</Link>
                </li>  :
                <li className="navBarItem">
                    <Link to="/login">{!user && "Login"}</Link>
                </li>
            }           
            
            <li className="navBarItem">
                <Link to="/about">About</Link>
            </li>                    
        </ul>
    )
}