import React, {Component} from 'react';
import QuestionForm from "./components/questionform";
import CsvReader from "./components/csv_component";
import {ReactComponent as Logo} from "./assets/DataQuestion.svg";
import Grid from "@mui/material/Grid";
import FilePicker from "./components/file_picker";
import NaturalQuestionForm from "./components/natural_question_form";

class App extends Component {
    constructor(props) {
        super(props);

        this.setState = this.setState.bind(this);
    }

    state = {
        text: '',
        natural_text: "",
        data: [],
        columns: [],
        columns_original: [],
        types: [],
        showing_data: [],
        showing_columns: [],
        worksheet: "",
        sheet_name: "",
        error_message: "",
        loading: false,
        db: this.connectDB(),
    };

    connectDB() {
        let db = openDatabase('MyDB', '1.0', 'DataQuestion Demo Database', 20000);

        if(!db) {
            alert("Failed to connect to database. Please try to reload the page.");
            return null;
        }

        return db;
    }

    fileSchema = () => {
        let column_names = this.state.columns.map(
            (x) => (
                [0, x.name]
            )
        );

        column_names.push([0, 'row_id']);

        let column_types = this.state.types.map(
            (x) => {
                if(x === 'TEXT') {
                    return 'text';
                } else if (x === 'REAL') {
                    return 'number';
                }

                return x;
            }
        );

        column_types.push('number');

        let column_names_original = this.state.columns_original.map(
            (x) => (
                [0, x]
            )
        );

        column_names_original.push([0, 'row id']);

        return {
            name: this.state.sheet_name,
            table_names_original: [this.state.sheet_name],
            table_names: [this.state.sheet_name],
            column_names_original: [[-1, '*'], ...column_names_original],
            column_names: [[-1, '*'], ...column_names],
            column_types: ['text', ...column_types],
            foreign_keys: [],
            primary_keys: [column_names.length],
        }
    };

    render() {
        return (
            <div>
                <Logo width={200}/>
                <Grid container spacing={2}>
                    <Grid item xs={2}>
                        <h1>
                            Table name: {this.state.sheet_name}
                        </h1>
                        <FilePicker
                            fileSchema={this.fileSchema}
                            db={this.state.db}
                            ws={this.state.worksheet}
                            sheet_name={this.state.sheet_name}
                            setState={this.setState}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <QuestionForm
                            text={this.state.text}
                            db={this.state.db}
                            setState={this.setState}
                        />
                        <h2>
                            {this.state.error_message}
                        </h2>
                    </Grid>
                    <Grid item xs={4}>
                        <NaturalQuestionForm
                            natural_text={this.state.natural_text}
                            setState={this.setState}
                            sheet_name={this.state.sheet_name}
                        />
                    </Grid>
                </Grid>
                <CsvReader
                    showing_data={this.state.showing_data}
                    showing_columns={this.state.showing_columns}
                    loading={this.state.loading}
                />
            </div>
        );
    }
}

export default App;