import {React, useState, useEffect} from 'react'
import "./popup.css"
import axios from "axios"
import { useLocation } from 'react-router-dom'
import {createPortal} from 'react-dom'
  

export default function PopUp({open, onClose}) {
    const [guestEmail, setGuestEmail] = useState()
    const [errMessage, setErrMessage] = useState()
    const [shared, setShared] = useState()
    const [delGuest, setDelGuest] = useState()
    let location = useLocation()
    const noteId = location.pathname.split("/")[2]
    const handleInvite = async(mode)=>{
        let res = await axios.post(`/api/invite/${noteId}`, {
            guestEmail,
            mode
        })
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
    },[open])

    useEffect(()=>{
        setErrMessage(null)
    },[open])


    if (!open) {
        return null
    }    
    return createPortal(
        <>  
            <div className='overlay'></div>
            <div className='popUp'>
                <div className='popupItems'>
                    <div className='popupItem'>
                    <input className='guestEmail' placeholder='Enter guest email...' onChange={(e)=>{setGuestEmail(e.target.value)}}/>
                    <button className='guestButton invite' onClick={()=>handleInvite("view")}>Invite View</button>
                    </div>
                    <div className='popupItem'>
                    <input className='guestEmail' placeholder='Enter guest email...' onChange={(e)=>{setGuestEmail(e.target.value)}}/>
                    <button className='guestButton invite' onClick={()=>handleInvite("edit")}>Invite Edit</button>
                    </div>
                    <div  className='popupItem'>
                    <input className='guestEmail'placeholder='Enter guest email...' onChange={(e)=>{setDelGuest(e.target.value)}}/>
                    <button className='guestButton delete' onClick={handleDelete}>Delete</button>
                    </div>
                    <div className='errorMessage'>{errMessage}</div>
                </div >
                <div className='curGuests'>
                {
                    shared ? 
                        <>
                        <div>Current Guests: </div>
                        <div>{shared.split(";")[0]}</div> 
                        <div>{shared.split(";")[1]}</div> 
                        </>
                : <></>
                }
                </div>            
            <i className="closeButton fa-solid fa-circle-xmark" onClick={onClose}></i> 
            </div>
        </>,
        document.getElementById("popUp")
    )
}
