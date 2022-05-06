import {useState, useEffect} from 'react';
import { Link } from "react-router-dom";
import axios from 'axios'
import Notes from '../components/notes'
import Header from '../components/header'
import './home.css'

export default function Home({user}){
    const [notes, setNotes] = useState([]);
    useEffect(() => {
        const fetchNotes = async () => {
            const res = await axios.get('/api/notes');
            setNotes(res.data);
        };
        fetchNotes();
    }, [])
    return (
        <>
            <Header user={user} />
            <button className="createNewNoteButton">
                <Link to="/note/create">{user && "Create new note..."}</Link>
            </button>
            <div className="home">
                <Notes notes={notes} />
            </div>
        </>
    )
}