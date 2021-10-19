import React, {Component} from 'react';

export default class AddTodo extends Component {
  state = {
    content: ''
  }

  handleChange = (e) => {
    this.setState ({
      content: e.target.value,
    })
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.handleChange(e);
    this.props.addTodo(this.state)
    this.setState({
      content: ''
    });
  }

  render() {
    return (
      <div className="search">
        <form className="search__form" onSubmit={this.handleSubmit} autoComplete="off" >
          <input type="text" onChange={this.handleChange} className="search__input" id="search" placeholder="Create a new todo.." value={this.state.content} />
        </form>
      </div>
    )
  }

}