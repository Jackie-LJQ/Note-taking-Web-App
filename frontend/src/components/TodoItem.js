import React from "react";
import "./TodoItem.css";

export default function TodoItem({ items, completeItem, deleteItem }) {
  return items.map((item) => (
    <div key={item._id}>
      <div className="singleRow">
        <div className="itemWrapper">
          <div
            className={
              item.isCompleted ? "completedcontent" : "incompletedcontent"
            }
            title={item.content}
          >
            {item.content}
          </div>
        </div>
        <div className="iconWrapper">
          <i
            className="icon check fa-solid fa-circle-check"
            onClick={() => completeItem(item._id, item.isCompleted)}
          ></i>
          <i
            className="icon trash fa-solid fa-trash-can"
            onClick={() => deleteItem(item._id)}
          ></i>
        </div>
      </div>
    </div>
  ));
}
