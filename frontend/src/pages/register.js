import "./register.css"
import React, { useState } from "react";
import { Link } from "react-router-dom"
import axios from "axios";

export default function Register() {
    let [username, setUsername] = useState()
    let [password, setPassword] = useState()
    let [email, setEmail] = useState()
    let [errMessage, setErrMessage] = useState("")

    const regex = /[a-zA-Z]/
    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!email.includes("@")) {
            setErrMessage("Invalid email address")
            return
        }
        if (password.length < 4) {
            setErrMessage("Password length must exceed 4")
            return
        }
        if (!regex.test(password)) {
            setErrMessage("must contain alphabet letter")
            return
        }
        setErrMessage("")
        try {
            const res = await axios.post(`/api/register`, {
                username:username,
                email:email,
                password:password,
              })
            if (res.status===202) {
                setErrMessage(res.data)
            }
            else if (res.data){
                localStorage.setItem("user", res.data.id)
                localStorage.setItem("name", res.data.name)
                localStorage.setItem("email", res.data.email)
                window.location.replace("/home")
            }
            else {                
                setErrMessage("Something went wrong. Please try agsin.")
            }
        } catch (err) {
            // console.log(err)
            setErrMessage("Something went wrong. Please try agsin.")
        }
    }
    return (
        <>
            <div className="register">       
                <div className="registerTitle">Register</div>     
                <form className="registerForm">    
                    <div className="registerBlock">
                        <label className="registerLabel">User Name</label>
                        <input 
                            type="text" 
                            placeholder="Enter your User Name"
                            onChange={(e)=>{setUsername(e.target.value)}}
                        />
                    </div>        
                    <div className="registerBlock">
                        <label className="registerLabel">Email Address</label>
                        <input 
                            type="text" 
                            placeholder="Enter your email address"
                            onChange={(e)=>{setEmail(e.target.value)}}
                        />
                    </div>                    
                    <div className="registerBlock">
                        <label className="registerLabel">Password</label>
                        <input 
                            type="password" 
                            placeholder="Enter your password" 
                            onChange={(e)=>setPassword(e.target.value)}
                        />
                    </div>
                    <div className="errorBlock">{errMessage}</div>
                    <button 
                        type="submit" 
                        className="registerButton" 
                        onClick={handleSubmit}>Register</button>
                </form>            
            </div>
        </>
    )
}
