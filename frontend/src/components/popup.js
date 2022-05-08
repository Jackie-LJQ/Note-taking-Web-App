import {React, useState, useEffect} from 'react'
import "./popup.css"
import axios from "axios"
import { useLocation } from 'react-router-dom'
import {createPortal} from 'react-dom'
  

export default function PopUp({open, onClose}) {
    const [guestEditEmail, setGuestEditEmail] = useState()
    const [guestViewEmail, setGuestViewEmail] = useState()
    const [errMessage, setErrMessage] = useState()
    const [shared, setShared] = useState()
    const [delGuest, setDelGuest] = useState()
    let location = useLocation()
    const noteId = location.pathname.split("/")[2]
    const handleInvite = async(mode)=>{
        let res
        if (mode === "view")        
        {
            res = await axios.post(`/api/invite/${noteId}`, {
                "guestEmail":guestViewEmail,
                "mode":"view"
            })
        }
        else {
            res = await axios.post(`/api/invite/${noteId}`, {
                "guestEmail":guestEditEmail,
                "mode":"edit"
            })
        }
        if (!res || res.status===202) {
            setErrMessage(res.data)
        }
        else {            
            setShared(res.data)
            setGuestEditEmail("")
            setGuestViewEmail("")
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
            setDelGuest("")
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
                    <input className='guestEmail' 
                        value={guestViewEmail} 
                        placeholder='Enter guest email...' 
                        onChange={(e)=>{setGuestViewEmail(e.target.value)}}/>
                    <button className='guestButton invite' 
                        onClick={()=>handleInvite("view")}>Invite Viewer</button>
                    </div>
                    <div className='popupItem'>
                    <input className='guestEmail' 
                        value={guestEditEmail} 
                        placeholder='Enter guest email...' 
                        onChange={(e)=>{setGuestEditEmail(e.target.value)}}/>
                    <button className='guestButton invite' onClick={()=>handleInvite("edit")}>Invite Editor</button>
                    </div>
                    <div  className='popupItem'>
                    <input className='guestEmail'
                        placeholder='Enter guest email...' 
                        value={delGuest}
                        onChange={(e)=>{setDelGuest(e.target.value)}}/>
                    <button className='guestButton delete' onClick={handleDelete}>Delete</button>
                    </div>
                    <div className='errorMessage'>{errMessage}</div>
                </div >
                <div className='curGuests'>                
                {
                    shared ? 
                        <>
                        {/* <div>Current Guests: </div> */}
                        {/* <i class="fa-solid fa-people-group"></i> */}
                        {shared.split(";")[0]!=="" ? <i class="fa-solid fa-user-pen"></i> : <></>}
                        <span className='guestName'>{shared.split(";")[0]}</span> 
                        <div></div>
                        {shared.split(";")[1]!=="" ? <i class="fa-solid fa-eye"></i> : <></>}
                        <span className='guestName'>{shared.split(";")[1]}</span> 
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
