import React, {useState} from 'react';
import * as XLSX from "xlsx";


const _TYPES = {
  "PGSQL":  { t:"text", n:"float8", d:"timestamp", b:"boolean" },
  "MYSQL":  { t:"TEXT", n:"REAL",   d:"DATETIME",  b:"TINYINT" },
  "SQLITE": { t:"TEXT", n:"REAL",   d:"TEXT",      b:"REAL"    }
};


function sheet_to_sql(ws, sname, mode) {
  const TYPES = _TYPES[mode || "SQLITE"];
  if(!ws || !ws['!ref']) return;
  var range = XLSX.utils.decode_range(ws['!ref']);
  if(!range || !range.s || !range.e || range.s > range.e) return;
  var R = range.s.r, C = range.s.c;

  var names = new Array(range.e.c-range.s.c+1);
  for(C = range.s.c; C<= range.e.c; ++C){
    var addr = XLSX.utils.encode_cell({c:C,r:R});
    names[C-range.s.c] = ws[addr] ? ws[addr].v : XLSX.utils.encode_col(C);
  }

  for(var i = 0; i < names.length; ++i) if(names.indexOf(names[i]) < i)
    for(var j = 0; j < names.length; ++j) {
      var _name = names[i] + "_" + (j+1);
      if(names.indexOf(_name) > -1) continue;
      names[i] = _name;
    }

  var types = new Array(range.e.c-range.s.c+1);
  for(C = range.s.c; C<= range.e.c; ++C) {
    var seen = {}, _type = "";
    for(R = range.s.r+1; R<= range.e.r; ++R)
      seen[(ws[XLSX.utils.encode_cell({c:C,r:R})]||{t:"z"}).t] = true;
    if(seen.s || seen.str) _type = TYPES.t;
    else if(seen.n + seen.b + seen.d + seen.e > 1) _type = TYPES.t;
    else switch(true) {
      case seen.b: _type = TYPES.b; break;
      case seen.n: _type = TYPES.n; break;
      case seen.e: _type = TYPES.t; break;
      case seen.d: _type = TYPES.d; break;
    }
    types[C-range.s.c] = _type || TYPES.t;
  }

  var out = [];

  var BT = mode === "PGSQL" ? "" : "`";
  var Q  = mode === "PGSQL" ? "'" : '"';
  var J  = mode === "PGSQL" ? /'/g : /"/g;
  out.push("DROP TABLE IF EXISTS " + BT + sname + BT );
  out.push("CREATE TABLE " + BT + sname + BT + " (" + names.map(function(n, i) { return BT + n + BT + " " + (types[i]||"TEXT"); }).join(", ") + ");" );

  for(R = range.s.r+1; R<= range.e.r; ++R) {
    var fields = [], values = [];
    for(C = range.s.c; C<= range.e.c; ++C) {
      var cell = ws[XLSX.utils.encode_cell({c:C,r:R})];
      if(!cell) continue;
      fields.push(BT + names[C-range.s.c] + BT);
      var val = cell.v;
      switch(types[C-range.s.c]) {
        case TYPES.n: if(cell.t === 'b' || typeof val == 'boolean' ) val = +val; break;
        default: val = Q + val.toString().replace(J, Q + Q) + Q;
      }
      values.push(val);
    }
    out.push("INSERT INTO " + BT +sname+ BT + " (" + fields.join(", ") + ") VALUES (" + values.join(",") + ");");
  }

  return out;
}

const DataWrapper = (props) => {
    const initial_table_queries = sheet_to_sql(props.ws, props.sheet_name, "SQLITE");

    if (!initial_table_queries) {
      return null;
    }


    props.db.transaction(
        (tx) => {
            for(let i = 0; i < initial_table_queries.length; ++i) {
                tx.executeSql(
                    initial_table_queries[i],
                    [],
                    (tx, result) => {},
                    (tx, error) => {console.log(error)},
                )
            }
        }
    );

    return null;

};

export default DataWrapper;