import React, { Component } from "react";

class SQLForm extends Component {

    state = {
        text: ""
    };

    handleChange = (event) => {
        this.setState({[event.target.name]: event.target.value})
    };

    handleSubmit = (event) => {
        event.preventDefault();
    };



    render() {
    return (
      <form onSubmit={this.handleSubmit}>
          <textarea
              name="text"
              placeholder="Your question to the database. In hard SQL."
              value={this.state.text}
              onChange={this.handleChange}
          />
          <button type={'submit'}>Run</button>
      </form>
    );
    };
}

export default SQLForm;