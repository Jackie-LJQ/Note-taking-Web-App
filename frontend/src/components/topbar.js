import "./topbar.css"
import { NavLink } from "react-router-dom";

export default function TopBar() {
    const user = true //check whether user is logged in 
    return (
        <ul className="topBar">
            <li className="navBarDest">
                <NavLink to="/home/123">Home</NavLink>
            </li>
            <li className="navBarDest">
                <NavLink to="/login">Login</NavLink>
            </li>
            <li className="navBarDest">
                <NavLink to="/about">About</NavLink>
            </li>                    
        </ul>
    )
}