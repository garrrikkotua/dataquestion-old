import React, { Component } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import {api_url} from "../constants/urls";


class NaturalQuestionForm extends Component {

    handleChange = (event) => {
        this.props.setState({[event.target.name]: event.target.value})
    };


    handleSubmit = async (event) => {
        event.preventDefault();
        if(!this.props.natural_text) {
            return;
        }

        try {
              const response = await fetch(api_url + '/query', {
                method: 'POST', // или 'PUT'
                body: JSON.stringify({name: this.props.sheet_name, text: this.props.natural_text}), // данные могут быть 'строкой' или {объектом}!
                headers: {
                  'Content-Type': 'application/json'
                },
                mode: 'cors',
              });
              const json = await response.json();
              if(json.translatable && json.sql_query) {
                  this.props.setState({text: json.sql_query,
                                       error_message: ''})
              } else if(json.translatable && !json.sql_query) {
                  this.props.setState({text:`SELECT * FROM ${this.props.sheet_name} LIMIT 10`,
                                       error_message: 'Sorry, this query is too hard for us :('
                                      })
              } else {
                  this.props.setState({error_message: JSON.stringify(json)});
              }
        } catch (error) {
          console.error('Error:', error);
        }
    };

    render() {
    return (
      <form onSubmit={this.handleSubmit}>
          <TextField
              name={"natural_text"}
              id={'natural-question-field'}
              label="Natural Query Editor"
              placeholder="Your question to the database. In plain English :) Generate query here and then hit Run."
              value={this.props.natural_text}
              onChange={this.handleChange}
              multiline
              rows={7}
              fullWidth
              variant="filled"
          />
          <Button variant="outlined" type={'submit'}>Generate Query</Button>
      </form>
    );
    };
}

export default NaturalQuestionForm;