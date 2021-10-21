import React, { Component } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

class QuestionForm extends Component {

    handleChange = (event) => {
        this.props.setState({[event.target.name]: event.target.value})
    };

    extractColumns = (data) => {
        if (data.length === 0) {
            return [];
        }
        const columns = Object.keys(data[0]);

        return columns.map(
            (value) => (
                {
                    name: value,
                    selector: (row) => row[value]
                }
            )
        )

    };

    handleSubmit = async (event) => {
        event.preventDefault();
        if(!this.props.text) {
            return;
        }

        /* waiting for query to complete */
        this.props.setState({loading: true});

        let output = [];
        let error_message = "";
        let showing_columns = [];
        await this.props.db.transaction(
            async (tx) => {
                await tx.executeSql(
                    this.props.text,
                    [],
                    (tx, result) => {

                        for(let i = 0; i < result.rows.length; ++i) {
                            output.push(result.rows.item(i));
                        }

                        showing_columns = this.extractColumns(output);
                        this.props.setState({showing_columns: showing_columns,
                                             showing_data: output,
                                             error_message: "",
                                             loading: false
                                            });
                    },
                    (tx, error) => {
                        console.log(error.message);
                        error_message = error.message;
                        this.props.setState({error_message: error_message, loading: false});
                    }
                )
            }
        );

    };



    render() {
    return (
      <form onSubmit={this.handleSubmit}>
          <TextField
              name={"text"}
              id={'question-field'}
              label="Query Editor"
              placeholder="Your question to the database. In SQL :)"
              value={this.props.text}
              onChange={this.handleChange}
              multiline
              rows={7}
              fullWidth
              variant="filled"
          />
          <Button variant="outlined" type={'submit'}>Execute Query</Button>
      </form>
    );
    };
}

export default QuestionForm;