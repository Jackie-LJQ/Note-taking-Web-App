import React, { useEffect, useState } from 'react'
import TodoItem from './TodoItem'
import "./TodoList.css"

export default function TodoList() {
  const [todoItems, setItems] = useState([])
  const [todoContent, setTodoContent] = useState("")
  const onSubmit = (newItem) => {
    const newtodoItems = [...todoItems, newItem]
    setItems(newtodoItems);   
    setTodoContent("") 
  }

  const handleAdd = ()=>{
    if (todoContent===""){
      return 
    }
    const newItem = {
        _id: Math.floor(Math.random()*1000),
        content: todoContent,
        isComplete: false
    }
    onSubmit(newItem)
  }

  const completeItem = (_id)=>{
    let updatedTodos = todoItems.map(item => {
      if (item._id === _id) {
        item.isComplete = !item.isComplete;
      }
      return item;
    });
    setItems(updatedTodos)
  }

  const deleteItem = (_id) =>{
    let updatedTodos = todoItems.filter(item=>item._id!==_id)
    setItems(updatedTodos)
  }

  return (
    <div className='todoList'>
      <TodoItem items={todoItems} completeItem={completeItem} deleteItem={deleteItem}/>
      <div className='inputBar'>
      <input 
        className='todoInput'
        placeholder='Add a todo...' 
        onChange={(e)=>{setTodoContent(e.target.value)}}
        value={todoContent}
      >
      </input>
      <i className="addicon fa-solid fa-plus"
          onClick={handleAdd}>
      </i>
      </div>
    </div>    
  )
}
