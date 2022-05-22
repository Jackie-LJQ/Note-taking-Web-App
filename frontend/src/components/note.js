import './note.css'
import { Link } from "react-router-dom";

export default function note({note, role}) {
  const timeString = new Date(note.timeStamp).toLocaleString();
  return (
    <div className="note">
        <div className="noteInfo">
            <div className="noteTitleBold">
            <Link to={`/note/${note._id}`}>
            <span className="noteTitleBold">{note.title}</span>
            </Link>
            </div>            
            <div className="noteGroup"> {role}
              {note.group.length ? 
              note.group.map((p, idx) => 
                <span className="noteGroup" key={idx}>{p}</span>
              ) : <span className="noteGroup"></span>}                
            </div>
            <span className="noteDate">{timeString}</span>
        </div>
        <p className="noteAbs">
            {note.content}
        </p>
    </div>
  )
}
