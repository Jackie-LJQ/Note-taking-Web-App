import "./login.css"
import TopBar from '../components/topbar';
import React, { useRef } from "react";
export default function Login() {
    const accountRef = useRef()
    const passwordRef = useRef()
    
    const handleSubmit = (event) => {
      console.log('submitted: ' + accountRef.current.value + " " + passwordRef.current.value)
    //   console.log(event.target)
    //   event.preventDefault();
    }
  
    return (
        <>  
            <TopBar />
            <div className="login">       
                <div className="loginTitle">Login</div>     
                <form className="loginForm">            
                    <div className="loginBlock">
                        <label className="loginLabel">Account</label>
                        <input type="text" placeholder="Enter your email address"/>
                    </div>
                    <div className="loginBlock">
                        <label className="loginLabel">Password</label>
                        <input type="password" placeholder="Enter your password" />
                    </div>
                    <button type="submit" className="loginButton" onClick={handleSubmit}>Login</button>
                </form>
            </div>
            <button type="submit" className="lRegisterButton">Register</button>
        </>
    )
}
