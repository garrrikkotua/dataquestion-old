import React, {Component} from 'react';
import QuestionForm from "./components/questionform";
import CsvReader from "./components/csv_component";
import DataWrapper from "./components/data_wrapper";
import {ReactComponent as Logo} from "./assets/DataQuestion.svg";
import Grid from "@mui/material/Grid";
import FilePicker from "./components/file_picker";
import Typography from "@mui/material/Typography";

class App extends Component {
    constructor(props) {
        super(props);

        this.setState = this.setState.bind(this);
    }

    state = {
        text: '',
        data: [],
        columns: [],
        showing_data: [],
        showing_columns: [],
        worksheet: "",
        sheet_name: "",
        error_message: "",
        loading: false,
    };

    componentDidMount() {
        let db = openDatabase('MyDB', '1.0', 'DataQuestion Demo Database', 20000);

        if(!db) {
            alert("Failed to connect to database. Please try to reload the page.");
            return;
        }

        this.db = db;
    }

    render() {
        return (
            <div>
                <Logo width={200}/>
                <DataWrapper
                    db={this.db}
                    ws={this.state.worksheet}
                    sheet_name={this.state.sheet_name}
                />
                <Grid container spacing={2}>
                    <Grid item xs={2}>
                        <h1>
                            Table name: {this.state.sheet_name}
                        </h1>
                        <FilePicker
                            setState={this.setState}
                        />
                    </Grid>
                    <Grid item xs={7}>
                        <QuestionForm
                            text={this.state.text}
                            db={this.db}
                            setState={this.setState}
                        />
                        <h2>
                            {this.state.error_message}
                        </h2>
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