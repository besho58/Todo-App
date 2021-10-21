import React, {Component} from 'react';
import {v4 as uuidv4} from 'uuid';
import AddTodo from './containers/AddTodo';
import Todos from './views/todos';

// make random ids ,,,
// finish the order shit
const readStorage = () => {
  const data = JSON.parse(localStorage.getItem('todos'));
  if (data) {
    return {todos: data}
  } else {
    return {
      todos: [
        {content: 'Type what you want to do and hit Enter', status: 'active', id: uuidv4()},
        {content: 'Click the circle to check the task', status: 'completed', id: uuidv4()}
      ]
    }  
  }
}

class App extends Component {

  state = readStorage();

  addTodo = (todo) => {
    todo.id = uuidv4();
    todo.status = 'active';
    const todos = [...this.state.todos, todo];
    this.setState({
      todos: todos
    }, this.saveStorage);

    // Pass the saveStorage method as a callback fn for setState
    // bcz setState run asynchronously 
  }

  deleteTodo = (id) => {
    
    let todos = this.state.todos.filter( cur =>{
      return cur.id !== id;
    });

    this.setState({
      todos: todos
    }, this.saveStorage);
  }

  checkTodo = (e) => {
    const btn = e.target.closest('.todo__btn-check');
    let key = btn.parentNode.dataset.key;
    let todos = this.state.todos;
    // remember NEVER CHANGE THE STATE DIRECTLY .. BETTER STORE IT IN A VARIABLE THEN ASSIGN IT TO THE STATE

    todos.forEach( cur =>{ // here we alter the todo status before adding it to the state.. without this the value of todos will be undefined
      if (cur.id === key) {
        cur.status === 'completed' ? cur.status = 'active' : cur.status = 'completed';
      }
    });

    // UI SHIT
    let data = btn.parentNode.dataset.status;
    data === 'completed' ? data = 'active' : data = 'completed';
    btn.parentNode.dataset.status = data;

    // STATE SHIT
    this.setState({
      todos: todos
    }, this.saveStorage);
  }

  clearTodos = () => {
    let todos = this.state.todos.filter( cur =>{
      return cur.status !== 'completed';
    });

    this.setState({
      todos: todos
    }, this.saveStorage);
  }

  toggleMode = (e) => {

    const mode = document.getElementsByTagName('html')[0].dataset.theme;
    if (mode === 'light') {
      document.getElementsByTagName('html')[0].dataset.theme = 'dark';
      e.target.closest('.header__mode-icon').src = 'images/icon-moon.svg'
    } else {
      document.getElementsByTagName('html')[0].dataset.theme = 'light';
      e.target.closest('.header__mode-icon').src = 'images/icon-sun.svg'
    }

    document.querySelector('.bg__img img').setAttribute('src', chooseBg());
  }

  saveStorage = () => {
    // Pass the saveStorage method as a callback fn for setState
    // bcz setState run asynchronously 
    localStorage.setItem('todos', JSON.stringify(this.state.todos)); 
  }

  swapItems = (fromIndex, toIndex) => {
    const immutableMove = (arr, from, to) => {
      return arr.reduce((prev, current, idx, self) => {
        if (from === to) {
          prev.push(current);
          console.log('from===to');
        }
        if (idx === from) {
          console.log('idx===from');
          return prev;
        }
        if (from < to) {
          prev.push(current);
          console.log('from<to');
        }
        if (idx === to) {
          prev.push(self[from]);
          console.log('idx===to');
        }
        if (from > to) {
          prev.push(current);
          console.log('from>to');
        }
        
        console.log('not this');
        return prev;
      }, []);
    }
    const findItem  = (key) => todos.findIndex(cur => cur.id === key);
    const todos = this.state.todos; // at least i tried
    // const itemOne = todos[findItem(fromIndex)];
    // // const itemTwo = todos[findItem(toIndex)];
    // // todos[findItem(fromIndex)] = todos[findItem(toIndex)];
    // // todos[findItem(toIndex)] = itemOne;
    // // itemOne = todos.splice(findItem(toIndex), 1, itemOne)[0];
    // console.log(immutableMove(todos, findItem(fromIndex), findItem(toIndex)), itemOne);
    this.setState({
      todos: immutableMove(todos, findItem(fromIndex), findItem(toIndex))
    });
  }

  render() {
    return (
      <div className="App">

        <div className="bg">
          <div className="bg__img">
            <img src={chooseBg()} alt="Background" />
          </div>
        </div>

        <main className="container width-ctrl">
          <div className="header">
            <h1 className="header__title">Todos</h1>
            <div className="header__icon-box" onClick={this.toggleMode}>
              <img className="header__mode-icon" src="images/icon-sun.svg" alt="mode icon" />
            </div>
          </div>
          <AddTodo addTodo={this.addTodo} saveStorage={this.saveStorage}/>
          <Todos todos={this.state.todos} deleteTodo={this.deleteTodo} checkTodo={this.checkTodo} clearTodos={this.clearTodos} swapItems={this.swapItems} />
        </main>
      </div>
    )
  }
}

/////////////////////////
// determine the window width ...

const chooseBg = () => {
  let bg = `images/bg-${window.innerWidth < 375 ? 'mobile' : 'desktop'}-${document.getElementsByTagName('html')[0].dataset.theme}.jpg`;
  return bg;
}

export default App;
