import React, {Component} from 'react';
import DataTable from 'react-data-table-component';
import LinearProgress from "@mui/material/LinearProgress";


class CsvReader extends Component {
    constructor(props) {
        super(props);
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return this.props.loading !== nextProps.loading;
    }

    render() {
        if (!this.props.loading) {
             return (
                <DataTable
                    pagination
                    highlightOnHover
                    columns={this.props.showing_columns}
                    data={this.props.showing_data}
                />
            )
        }

        return (
            <LinearProgress />
        )
    }
}

export default CsvReader;