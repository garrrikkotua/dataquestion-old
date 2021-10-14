import React, {Component} from 'react';
import QuestionForm from "./components/questionform";
import CsvReader from "./components/csv_component";
import DataWrapper from "./components/data_wrapper";
import {ReactComponent as Logo} from "./assets/DataQuestion.svg";


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
                <h1>
                    Table name: {this.state.sheet_name}
                </h1>
                <QuestionForm
                    text={this.state.text}
                    db={this.db}
                    setState={this.setState}
                />
                <h2>
                    {this.state.error_message}
                </h2>
                {
                    this.state.loading ?
                        <p>Loading...</p>
                        :
                        <CsvReader
                        showing_data={this.state.showing_data}
                        showing_columns={this.state.showing_columns}
                        setState={this.setState}
                        />
                }
            </div>
        );
    }
}

export default App;