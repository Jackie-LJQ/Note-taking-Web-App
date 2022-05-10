import "./tutorial.css"
export default function Tutorial() {
    return (
        <div className="TutorialPage">
        <p className="TutorialTitle">Create an account with email and start taking notes!</p>
        <p className="TutorialTitle_1">What you can do?</p>
        <p className="functions"> * Create your notes:</p>
        <p className="funcdesc">
            You can created new plain text notes at <span className="BoldPart">User home page</span>. 
            Your existing notes will also be displayed here. 
        </p>
        <p className="funcdesc">
            You can also create a <span className="BoldPart">to-do list</span> on User home page.
        </p>

        
        <p className="functions"> * Edit your note:</p>
        <p className="funcdesc">
            Author can view/write/delete note on the corresponding <span className="BoldPart">Note page</span>.
        </p>
        <p className="funcdesc">
            Guest Users can view/edit note that shared with them according to their 
            authentication. 
        </p>

        <p className="functions"> * Share your notes: </p>
        <p className="funcdesc">
            You can start or stop sharing your notes with other users on the <span className="BoldPart">Popup 
            Share Page</span> of specific note. 
        </p>
        <p className="funcdesc">Shared notes can be either with <span className="BoldPart">read-only, 
            or read-write </span> permission. 
        </p>
        <p className="funcdesc">Shared note will also be displayed on the <span className="BoldPart">Guest's Home Page </span>. 
            You can share one note with up to five users. 
        </p>
        <p className="funcdesc">Online synchronous editing is not supported at this stage.
        </p>
        </div>
    )
}