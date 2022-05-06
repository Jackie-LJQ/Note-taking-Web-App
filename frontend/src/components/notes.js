import Note from './note'
import './notes.css'

export default function Notes({notes}) {
  return (
    <div className='notes'>
      {notes.map(p => 
        <Note note={p} />
      )}        
    </div>
  )
}
