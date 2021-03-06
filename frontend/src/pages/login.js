import "./login.css"
import React, { useState } from "react";
import axios from "axios"
export default function Login() {
    let [password, setPassword] = useState()
    let [email, setEmail] = useState()
    let [errMessage, setErrMessage] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            let res = await axios.post("/user/login", {
                email:email,
                password:password
            })
            if (res.data) {
                localStorage.setItem("user", res.data.id)
                localStorage.setItem("name", res.data.name)
                localStorage.setItem("email", res.data.email)
                window.location.replace("/home")
            }
            else {
                setErrMessage("Something unknown happens. Please try again.")
            }
        } catch(err) {
            if (err.response.status===400 || err.response.status===406) {
                setErrMessage(err.response.data)
            }
            else {
                setErrMessage("Something unknown happens. Please try again.")
            }            
        }
    }
  
    return (
        <>
            <div className="login">       
                <div className="loginTitle">Login</div>     
                <form className="loginForm">            
                    <div className="loginBlock">
                        <label className="loginLabel">Account</label>
                        <input className="loginInput"
                            type="text" 
                            placeholder="Enter your email address"
                            onChange={(e)=>{setEmail(e.target.value)}}
                        />
                    </div>
                    <div className="loginBlock">
                        <label className="loginLabel">Password</label>
                        <input className="loginInput"
                            type="password" 
                            placeholder="Enter your password" 
                            onChange={(e)=>{setPassword(e.target.value)}}
                        />
                    </div>
                    <div className="errorBlock">{errMessage}</div>
                    <button type="submit" className="loginSubmitButton" onClick={handleSubmit}>Login</button>
                </form>
            </div>
        </>
    )
}
