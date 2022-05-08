import React, { useEffect, useState } from 'react'
import TodoItem from './TodoItem'
import "./TodoList.css"
import axios from "axios"

export default function TodoList() {
  const [todoItems, setItems] = useState([])
  const [todoContent, setTodoContent] = useState("")
  const userId = localStorage.getItem("user")

  const onSubmit = (newItem) => {
    const newtodoItems = [...todoItems, newItem]
    setItems(newtodoItems);   
    setTodoContent("") 
  }

  const handleAdd = async ()=>{
    if (todoContent.trim() === ""){
      return 
    }
    const newItem = {
        content: todoContent,
        isCompleted: false
    }
    let res = await axios.post(`/api/todoList/${userId}/create`, newItem)
    let itemId = res.data
    newItem._id = itemId;
    onSubmit(newItem)
  }

  const completeItem = (_id, isCompleted)=>{
    console.log(isCompleted)
    let updateTodoItem = async ()=>{
      let res = await axios.post(`/api/todoList/${_id}/update`, 
        {
          isCompleted: !isCompleted,
          userId: userId
        })
      let updatedTodos = res.data
      setItems(updatedTodos)
    }
    updateTodoItem()
  }

  const deleteItem = (_id) =>{
    let updatedTodos = todoItems.filter(item=>item._id!==_id)
    setItems(updatedTodos)
  }


  useEffect(()=>{
    let getTodoList = async()=>{
      let res = await axios.get(`/api/todoList/${userId}`)
      let todoList = res.data
      setItems(todoList)
      return todoList
    } 
    getTodoList()
  })
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
