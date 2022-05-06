import './note.css'
import { Link } from "react-router-dom";

export default function note({note}) {
  return (
    <div className="note">
        <div className="noteInfo">
            <div className="noteTags">
                <span className="noteTag">General</span>
            </div>
            <div className="noteTitleBold">
            <Link to={`/note/${note._id}`}>
            <span className="noteTitleBold">{note.title}</span>
            </Link>
            </div>
            
            <div className="noteGroup">
                {note.group.map(p => 
                  <span className="noteGroup">{p}</span>
                )}                
            </div>
            <span className="noteDate">1 hour ago</span>
        </div>
        <p className="noteAbs">
            {note.content}
        </p>
    </div>
  )
}
