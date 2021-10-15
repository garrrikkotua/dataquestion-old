import React from "react";
import * as XLSX from "xlsx";
import Button from "@mui/material/Button";


class FilePicker extends React.Component {

    processData = (data) => {
        const columns = data[0];
        const width = columns.length;
        let result = [];
        for(let i = 0; i < data.length - 1; ++i) {
            let tmp = {};
            for(let j = 0; j < width; ++j)  {
                tmp[columns[j]] = data[i + 1][j];
            }
            result[i] = tmp;
        }
        return result;
    };

    processColumns = (data) => {
        const columns = data[0];
        return columns.map(
            (value) => (
                {
                    name: value,
                    selector: (row) => row[value],
                }
            )
        );
    };


    handleFile = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = (evt) => {
          /* Parse data */
          const bstr = evt.target.result;
          const wb = XLSX.read(bstr, { type: 'array' });
          /* Get first worksheet */
          const wsname = wb.SheetNames[0];
          const ws = wb.Sheets[wsname];

          const db_table_name = wsname.split(' ').join('_');
          /* Convert array of arrays */
          const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
          const processed_data = this.processData(data);
          const processed_columns = this.processColumns(data);
          this.props.setState({data: processed_data,
                              columns: processed_columns,
                              showing_data: processed_data,
                              showing_columns: processed_columns,
                              worksheet: ws,
                              sheet_name: db_table_name,
                              });
        };
        reader.readAsArrayBuffer(file);
    };

    render() {
        return (
            <Button
              variant="contained"
              component="label"
            >
              Upload File
              <input
                type="file"
                accept={'.csv,.xlsx,.xls'}
                id='csvFile'
                onChange={this.handleFile}
                hidden
              />
            </Button>
        )
    }
}



export default FilePicker;