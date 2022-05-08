import Note from './note'
import './notes.css'

export default function Notes({notes, role}) {
  return (
    <div className='notes'>
      {notes.map(p => 
        <Note note={p} role={role} />
      )}        
    </div>
  )
}
