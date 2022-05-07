import {React, useState, useEffect} from 'react'
import "./popup.css"
import axios from "axios"
import { useLocation } from 'react-router-dom'
  

export default function PopUp({open, onClose}) {
    const [guestEmail, setGuestEmail] = useState()
    const [errMessage, setErrMessage] = useState()
    const [shared, setShared] = useState()
    const [delGuest, setDelGuest] = useState()
    let location = useLocation()
    const noteId = location.pathname.split("/")[2]
    const handleInvite = async()=>{
        let res = await axios.post("/api/invite/" + noteId, {
            guestEmail
        })
        console.log(res)
        if (res.status===202) {
            setErrMessage(res.data)
        }
        else {            
            setShared(res.data)
        }
    }
    const handleDelete = async()=>{
        let res = await axios.post("/api/deleteGuest/"+noteId, {
            delGuest:delGuest
        })
        if (res.status===202) {
            setErrMessage(res.data)
        }
        else {            
            setShared(res.data)
        }
    }
    useEffect(()=>{
        const getShared = async ()=>{
            let res = await axios.get("/api/noteGuest/"+noteId)
            setShared(res.data)
        }
        getShared()
    },[noteId])


    if (!open) {
        return null
    }    
    return (
        <>
            <div className='popUp'>
                <input className='guestEmail' onChange={(e)=>{setGuestEmail(e.target.value)}}/>
                <button onClick={handleInvite}>Invite</button>
                <input className='guestEmail' onChange={(e)=>{setDelGuest(e.target.value)}}/>
                <button onClick={handleDelete}>Delete</button>
                <div>{errMessage}</div>
                <div>Shared with: {shared}</div>
                <button className='closeButton' onClick={onClose}>x</button>
            </div>
        </>
    )
}
