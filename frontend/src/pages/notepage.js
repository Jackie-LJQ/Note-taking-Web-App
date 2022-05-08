import "./notepage.css"
import PopUp from "../components/popup"
import axios from "axios"
import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"

export default function NotePage(){
    const location = useLocation()
    let [editMode, setEditMode] = useState(false)
    let [title, setTitle] = useState("")
    let [content, setContent]  = useState("")
    let [timeStamp, setTimeStamp] = useState("")
    let [ownership, setOwnership] = useState(false)
    let [editCredential, setEditCredential] = useState(false)
    let [noteId, setNoteId] = useState(location.pathname.split("/")[2])
    const [isOpen, setOpen] = useState(false)
    
    useEffect(()=>{
        const getNote = async ()=>{
            const res = await axios.get("/api/note/"+noteId)
            const noteInfo = res.data
            setContent(noteInfo.content)
            setTitle(noteInfo.title)
            setTimeStamp(noteInfo.timeStamp)
            setOwnership(localStorage.getItem("user") === noteInfo.author)
            for (let guestInfo of noteInfo.group) {
                if (guestInfo._id === localStorage.getItem("user") && guestInfo.mode==="edit") {
                    setEditCredential(true)
                }
            }
            
            setNoteId(noteId)
        }
        const createNote = async ()=>{
            let author = localStorage.getItem("user")
            const res = await axios.post("/api/createNew", {
                author:author
            })
            let newDate = new Date()
            newDate = newDate.toString()
            setTimeStamp(newDate)
            setOwnership(true)
            console.log(res.data)
            setNoteId(res.data)
            setEditMode(true)
        }
        if (noteId !== "create"){
            getNote()
        }
        else if (noteId==="create") {
            createNote()
        }
    },[noteId])

    const handleSave = async() => {
        try {
            axios.post("/api/note/"+noteId, {
                title:title,
                content:content            
            })
            window.location.replace("/note/"+noteId)
        }catch(err) {
            console.log(err)
        }
    }

    const handleDelete = async() => {
        try {
            let res = await axios.delete("/api/note/"+noteId)
            if (res.status===200) {
                window.location.replace("/home")
            }
            else {
                console.log("Fail")
            }
        } catch (err) {
            console.log(err)
        }
    }
    return (
        <div className="notepage">    
            <div className="editDate">Last Edit at: {new Date(timeStamp).toLocaleString()}</div>
            <div className="pageIcon">            
                {(editCredential||ownership) &&!editMode ? <i className="pageIconItem fa-solid fa-square-pen" onClick={(e)=>{setEditMode(true)}}></i> : <></>}
                {editMode ? <i className="pageIconItem fa-solid fa-floppy-disk" onClick={handleSave}></i> : <></>}
                {ownership ? <i className="pageIconItem fa-solid fa-trash-can" onClick={handleDelete}></i> : <></>}
                {ownership ? 
                <>
                    <i className="pageIconItem fa-solid fa-share-nodes" onClick={()=>{setOpen(true)}}></i> 
                    <PopUp className="popUp" open={isOpen} onClose={()=>{setOpen(false)}}>Fancy popUp</PopUp>
                    {/* <p className="popUp">cbadioni</p> */}
                </>
                : <></>}
            </div>
            {
                editMode ? (
                <>
                    <input 
                        className="titleInput" 
                        value={title} 
                        placeholder="Title"
                        onChange={(e)=>{setTitle(e.target.value)}} 
                    />
                    <div></div>
                    <textarea 
                        className="contentInput" 
                        value={content} 
                        placeholder="Enter note here..."
                        onChange={(e)=>{setContent(e.target.value)}} 

                    />
                </>
            ) : 
            (   
                <>
                    <h1 className="noteTitle">{title}</h1>
                    <p className="noteContent">{content}</p> 
                </>
            )}           
        </div> 
    )
}