/**
 * Created by sunlong on 16/8/3.
 */
var XLSX = require('xlsx-style');

function datenum(v, date1904) {
    if(date1904) v+=1462;
    var epoch = Date.parse(v);
    return (epoch - new Date(Date.UTC(1899, 11, 30))) / (24 * 60 * 60 * 1000);
}

function sheet_from_array_of_arrays(data, opts) {
    var ws = {};
    var range = {s: {c:10000000, r:10000000}, e: {c:0, r:0 }};
    for(var R = 0; R != data.length; ++R) {
        for(var C = 0; C != data[R].length; ++C) {
            if(range.s.r > R) range.s.r = R;
            if(range.s.c > C) range.s.c = C;
            if(range.e.r < R) range.e.r = R;
            if(range.e.c < C) range.e.c = C;

            var cell = null;
            if(data[R][C]==null || typeof data[R][C] == 'string'){
                cell = {
                    v: data[R][C],
                    s: {
                        fill:{
                            fgColor: { theme: 8, tint: 0.3999755851924192 },
                            bgColor: { indexed: 35 }
                        }
                    }
                };
            }else{
                cell = {
                    v: data[R][C].v,
                    s: data[R][C].s
                };
            }

            if(cell.v == null) continue;
            var cell_ref = XLSX.utils.encode_cell({c:C,r:R});

            if(typeof cell.v === 'number') cell.t = 'n';
            else if(typeof cell.v === 'boolean') cell.t = 'b';
            else if(cell.v instanceof Date) {
                cell.t = 'n'; cell.z = XLSX.SSF._table[14];
                cell.v = datenum(cell.v);
            }
            else cell.t = 's';

            ws[cell_ref] = cell;
        }
    }
    if(range.s.c < 10000000) ws['!ref'] = XLSX.utils.encode_range(range);
    return ws;
}

function Workbook() {
    if(!(this instanceof Workbook)) return new Workbook();
    this.SheetNames = [];
    this.Sheets = {};
}

function export_table_to_excel(data, ranges) {
    var ws_name = "SheetJS";

    var wb = new Workbook(), ws = sheet_from_array_of_arrays(data);

    /* add ranges to worksheet */
    ws['!merges'] = ranges;

    // ws['!cols'] = [{fill:{bgColor:{rgb: "FFFFAA00"}}}];

    /* add worksheet to workbook */
    wb.SheetNames.push(ws_name);
    wb.Sheets[ws_name] = ws;

    return XLSX.write(wb, {bookType: 'xlsx', bookSST: false, type: 'binary'});
}

module.exports = export_table_to_excel;