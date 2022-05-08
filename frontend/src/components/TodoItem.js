import React from 'react'
import "./TodoItem.css"

export default function TodoItem({items, completeItem, deleteItem}) {
    // console.log(items)
  return (
      items.map((item)=>(
        <div key={item._id}>
        <div className={item.isComplete ? "completedcontent" : "incompletedcontent"}>{item.content}</div>      
        <i className="icon check fa-solid fa-circle-check" 
            onClick={()=>completeItem(item._id)}>
        </i>
        <i className="icon trash fa-solid fa-trash-can"
            onClick={()=>deleteItem(item._id)}>
        </i>
        </div>
  ))      
  )
}
