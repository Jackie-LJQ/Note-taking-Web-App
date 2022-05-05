import "./notepage.css"
import TopBar from "../components/topbar"
import axios from "axios"
import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"

export default function NotePage(){
    const location = useLocation();
    const path = location.pathname.split("/")[2];
    // noteId = "62739b3b44a5a324f4f68f6f"
    let [editMode, setEditMode] = useState(false)
    let [title, setTitle] = useState("")
    let [content, setContent]  = useState("")
    let [timeStamp, setTimeStamp] = useState("")
    let [ownership, setOwnership] = useState(false)
    // distinguish authentation and ownership
    
    useEffect(()=>{
        const getPost = async ()=>{
            const res = await axios.get("/api/note/"+path)
            const noteInfo = res.data
            console.log(noteInfo)
            setContent(noteInfo.content)
            setTitle(noteInfo.title)
            setTimeStamp(noteInfo.timeStamp)
            setOwnership(localStorage.getItem("user") === noteInfo._id)
        }
        getPost()
    }, [path])

    const handleSave = async() => {
        try {
            axios.post("/api/note/"+path, {
                title:title,
                content:content            
            })
            window.location.replace("/note/"+path)
        }catch(err) {
            console.log(err)
        }
    }
    
    return (
        <div className="notepage">    
            <div className="editDate">Last Edit at: {timeStamp}</div>
            <div className="pageIcon">            
                {ownership&&!editMode ? <i className="pageIconItem fa-solid fa-square-pen" onClick={(e)=>{setEditMode(true)}}></i> : <></>}
                {editMode ? <i class="pageIconItem fa-solid fa-floppy-disk" onClick={handleSave}></i> : <></>}
                {ownership ? <i className="pageIconItem fa-solid fa-trash-can"></i> : <></>}
                {ownership ? <i className="pageIconItem fa-solid fa-share-nodes"></i> : <></>}
            </div>
            {
                editMode ? (
                <>
                    <input 
                        className="titleInput" 
                        value={title} 
                        onChange={(e)=>{setTitle(e.target.value)}} 
                        autoFocus
                    />
                    <div></div>
                    <textarea className="contentInput" value={content} onChange={(e)=>{setContent(e.target.value)}} />
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