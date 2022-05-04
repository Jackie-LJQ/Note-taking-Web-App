import "./login.css"
import TopBar from '../components/topbar';
import React, { useState } from "react";
import { Link } from "react-router-dom"
import axios from "axios"
export default function Login(user, setUser) {
    let [password, setPassword] = useState()
    let [email, setEmail] = useState()
    let [errMessage, setErrMessage] = useState("")

    const handleSubmit = async (e) => {
        try {
            let res = await axios.post("/api/login", {
                email,
                password
            })

        } catch(err) {
            setErrMessage("Something went wrong. Please try agsin.")
        }
    }
  
    return (
        <>
            <div className="login">       
                <div className="loginTitle">Login</div>     
                <form className="loginForm">            
                    <div className="loginBlock">
                        <label className="loginLabel">Account</label>
                        <input 
                            type="text" 
                            placeholder="Enter your email address"
                            onChange={(e)=>{setEmail(e.target.value)}}
                        />
                    </div>
                    <div className="loginBlock">
                        <label className="loginLabel">Password</label>
                        <input 
                            type="password" 
                            placeholder="Enter your password" 
                            onChange={(e)=>{setPassword(e.target.value)}}
                        />
                    </div>
                    <button type="submit" className="loginButton" onClick={handleSubmit}>Login</button>
                </form>
            </div>
            <button className="lRegisterButton">
                <Link to="/register">Register</Link>
            </button>
        </>
    )
}
