import "./register.css"
import TopBar from "../components/topbar";
import React, { useRef } from "react";
export default function Register() {
    const accountRef = useRef()
    const passwordRef = useRef()
    
    const handleSubmit = (event) => {
      console.log('submitted: ' + accountRef.current.value + " " + passwordRef.current.value)
    //   console.log(event.target)
    //   event.preventDefault();
    }
  
    return (
        <>
            <TopBar/>
            <div className="register">       
                <div className="registerTitle">Register</div>     
                <form className="registerForm">            
                    <div className="registerBlock">
                        <label className="registerLabel">Email Address</label>
                        <input type="text" placeholder="Enter your email address"/>
                    </div>
                    <div className="registerBlock">
                        <label className="registerLabel">User Name</label>
                        <input type="text" placeholder="Enter your User Name"/>
                    </div>
                    <div className="registerBlock">
                        <label className="registerLabel">Password</label>
                        <input type="password" placeholder="Enter your password" />
                    </div>
                    <button type="submit" className="registerButton" onClick={handleSubmit}>Register</button>
                </form>            
            </div>
            <button type="submit" className="rLoginButton">Login</button>
        </>
    )
}
