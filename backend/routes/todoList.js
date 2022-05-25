const express = require("express");
const { ObjectId } = require("mongodb");
const todoListModule = require("../modules/todoListModule");
const router = express.Router()
const TodoItem = require("../modules/todoListModule")

//add a new todo item
router.post("/addTodo/:userId", async (req, res, next)=>{
try {
    const {content, isCompleted} = req.body
    const userId = req.params.userId;
    const newTodoItem = new TodoItem({
        userId,
        content,
        isCompleted
    })
    await newTodoItem.save()
    const Tid = newTodoItem._id;
    res.writeHead(200);
    res.write(Tid.toString())
    res.end();
    next();
} catch(err) {
    throw err
}
})

async function getTodoList(userId){
    const todoList = await TodoItem.find({"userId":userId})
    return todoList;
}

// get all todo task of user
router.get("/:userId", async(req, res, next)=>{
    try {
        let userId = req.params.userId;
        let todoLists = await getTodoList(userId);
        res.writeHead(200);
        res.write(JSON.stringify(todoLists));
        res.end()
        next();
    } catch(err) {
        throw err;
    }
})


router.post("/update/:todoItemId", async (req, res, next)=>{
    try {
        let _Tid = req.params.todoItemId;
        let isCompleted = req.body.isCompleted;
        const updateTodo = await TodoItem.updateOne({_id : new ObjectId(_Tid)}, {
            isCompleted : isCompleted
        });
        if (updateTodo.modifiedCount !== 1) {
              throw new Error("Updata Todo List Failed")
        }
        let todoLists = await getTodoList(req.body.userId);
        res.writeHead(200);
        res.write(JSON.stringify(todoLists));
        res.end();
        next();
      } catch(err) {
        throw err
      }
})

router.delete("/:todoItemId", async (req, res, next)=>{
    try {
        let _Tid = req.params.todoItemId;
        let updateTodo = await TodoItem.deleteOne({"_id":new ObjectId(_Tid)})
        if (updateTodo.deletedCount===0) {
              throw new Error("Failed to delete todoList Item.");
        }
        res.writeHead(200);
        res.end();
        next();
      } catch(err) {
        throw err;
    }
})


module.exports = router