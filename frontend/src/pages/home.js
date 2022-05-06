import {useState, useEffect} from 'react';
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
    
    const createNewNote = ()=>{
        window.location.replace("/note/create")
    }

    return (
        <>
            <Header user={user} />
            {user ? <button className="createNewNoteButton" onClick={createNewNote}>Create New Note</button> : <></>}
            <div className="home">
                <Notes notes={notes} />
            </div>
        </>
    )
}