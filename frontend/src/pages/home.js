import { useState, useEffect } from "react";
import axios from "axios";
import Notes from "../components/notes";
import Header from "../components/header";
import "./home.css";


export default function Home({ user }) {
  const [notes, setNotes] = useState([]);
  const [sharedNotes, setSharedNotes] = useState([]);

  useEffect(() => {
    const fetchNotes = async () => {
      const res = await axios.get(`/note/${user}`);
      setNotes(res.data);
    };
    fetchNotes();
  });

  useEffect(() => {
    const fetchSharedNotes = async () => {
      const res = await axios.get(`/note/${user}/shared`);
      setSharedNotes(res.data);
    };
    fetchSharedNotes();
  });

  const createNewNote = () => {
    window.location.replace("/note/create");
  };

  return (
    <>
      <Header user={user} />
      <div className="buttonWrapper">
      {user ? (
        <button className="createNewNoteButton" onClick={createNewNote}>
          Create New Note
        </button>
      ) : (
        <></>
      )}
      </div>
      
      <div className="ownedTitle">Your notes</div>
      <div className="ownedNotes">
        <Notes notes={notes} role="Guests: "/>
      </div>
      <div className="sharedTitle">Notes shared with you</div>
      <div className="sharedNotes">
        <Notes notes={sharedNotes} role="Author: "/>
      </div>
    </>
  );
}
