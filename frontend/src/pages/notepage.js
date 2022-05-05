import "./notepage.css"
import TopBar from "../components/topbar"
import axios from "axios"
import { useState } from "react"

export default function NotePage({username, noteId}){
    const pageInfo = axios.get(`/api/note/${noteId}`)
    let [writeMode, setMode] = useState(false)

    return (
        <div className="notepage">    
            <div className="editDate">Last Edit at: {pageInfo.timeStamp}</div>
            <div className="pageIcon">            
                <i className="pageIconItem fa-solid fa-square-pen"></i>
                <i className="pageIconItem fa-solid fa-trash-can"></i>
                <i className="pageIconItem fa-solid fa-share-nodes"></i>
            </div>
            <form></form>
            <h1>{pageInfo.title}</h1>
            <p className="noteContent">{pageInfo.content}</p>
        </div> 
    )
}