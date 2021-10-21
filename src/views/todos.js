import React, { useState } from 'react';

const useForceUpdate = ()=> {
  // making a fake state to force the functional component to update
  // alt for forceUpdate()
  // The hook can only be called to in class or functional
  const [value, setValue] = useState(0);
  return ()=> setValue( value => value + 1);
}

const calcLeftTodos = (todos) => {
  let sum = 0
  todos.forEach(cur => {
    cur.status === 'active' ? sum += 1 : sum += 0;
  });
  return sum;
}

/// initializing the category with 'all

let category = 'all';

let dragStartIndex;

const Todos = ({todos, deleteTodo, checkTodo, clearTodos, swapItems}) => {
  
  const dragStart = (e) => {
    dragStartIndex = e.target.closest('.todo__item').dataset.key;
  };
  const dragEnter = (e) => {
    e.target.closest('.todo__item').classList.add('over');
  };
  const dragOver = (e) => {
    e.preventDefault();
  };
  const dragLeave = (e) => {
    e.target.closest('.todo__item').classList.remove('over');
  };
  const dragDrop = (e) => {
    e.target.classList.remove('over');
  
    let dragEndIndex = e.target.closest('.todo__item').dataset.key;

    swapItems(dragStartIndex, dragEndIndex);
  };
  

  // Here we call the hook... by the order of the holy react shit
  const forceUpdate = useForceUpdate();

  const categorize = (e) => {
    let btn = e.target.closest('.cate-list li');
    if (btn) {
      document.querySelectorAll('.cate-list li').forEach(cur => {cur.classList.remove('selected')})
      btn.classList.toggle('selected');
      category = btn.id;
    }

    // Here we call the alternative function
    forceUpdate();
  }

  const todoList = todos.map((cur) => {
    const markup = 
      <li 
        className="todo__item" 
        key={cur.id} 
        data-key={cur.id} 
        data-status={cur.status} 
        draggable 
        onDragStart={dragStart}
        onDragEnter={dragEnter}
        onDragOver={dragOver}
        onDragLeave={dragLeave}
        onDrop={dragDrop}
      >
        <span className="todo__btn-check" onClick={checkTodo}>
          <img className="todo__check" src="images/icon-check.svg" alt="check icon"/>
        </span>
        <p>{cur.content}</p> 
        <img className="todo__cross" src="images/icon-cross.svg" onClick={()=>{deleteTodo(cur.id)}} alt="close icon" />
      </li>;

    if (category === 'all') {
      return (
        markup
      )
    } else if (cur.status === category) {
      return (
        markup
      )
    } else {
      return null;
    }
  });
  const refineTodos = (array) => {
    if (array.every((cur)=> {return cur === null})) {
      
      return <li className="todo__empty">Nothing's here ! <br />Try adding/completing some tasks you lazy duck 🦆</li>
    } else {
      return array;
    }
  }
  return (
    <div className="todo__box">
      <div className="todo__bar todo__bar-box">
        <div className="todo__status">
          <ul className="cate-list" onClick={categorize}>
            <li className="selected" id="all" >All</li>
            <li id="active" >Active</li>
            <li id="completed">Completed</li>
          </ul>
        </div>
        
      </div>
      <div className="todo">
        <div className="todo__bar-box">
          <div className="todo__counter"><p>{calcLeftTodos(todos)}  Todo(s) Left</p></div>

          <div className="todo__del">
            <button className="todo__del-btn" onClick={clearTodos} >Clear Completed</button>
          </div>
        </div>
        <ul className="todo__list">
          {refineTodos(todoList)}
        </ul>
      </div>
        
    </div>
  )
}

export default Todos;