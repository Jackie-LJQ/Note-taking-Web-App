import {React, useState, useEffect} from 'react'
import "./popup.css"
import axios from "axios"
import { useLocation } from 'react-router-dom'
  

export default function PopUp({open, onClose}) {
    const [guestEmail, setGuestEmail] = useState()
    const [errMessage, setErrMessage] = useState()
    const [shared, setShared] = useState("user a")
    let location = useLocation()
    const noteId = location.pathname.split("/")[2]
    const handleInvite = async()=>{
        let res = await axios.post("/api/invite/" + guestEmail, {
            guest:guestEmail
        })
        if (res.status===202) {
            setErrMessage(res.data)
        }
        else {
            setShared(res.data.group)
        }
    }
    useEffect(()=>{
        const getShared = async ()=>{
            let res = await axios.get("/api/note/"+noteId)
            console.log(res)
            setShared(res.data.group)
        }
        getShared()
    },[noteId])


    if (!open) {
        return null
    }    
    return (
        <>
            <div className='popUp'>
                <label>share with</label>
                <input className='guestEmail' onChange={(e)=>{setGuestEmail(e.target.value)}}/>
                <button onClick={handleInvite}>invite</button>
                <div>{errMessage}</div>
                <div>Shared with {shared}</div>
                <button className='closeButton' onClick={onClose}>x</button>
            </div>
        </>
    )
}
