import "./topbar.css"
import { Link } from "react-router-dom";

export default function TopBar() {
    const user = true //check whether user is logged in 
    return (
        <ul className="topBar">
            <li className="navBarDest">
                <Link to="/home/123">Home</Link>
            </li>
            <li className="navBarDest">
                <Link to="/login">Login</Link>
            </li>
            <li className="navBarDest">
                <Link to="/about">About</Link>
            </li>                    
        </ul>
    )
}