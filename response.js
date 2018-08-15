function myFunction(e) {
 
  Logger.log(JSON.stringify(e));
  
  //var a = JSON.parse(JSON.stringify(e));
  //Logger.log(a);

  
  /*
  //Logger.log("%s", JSON.stringify(e));
 
    var jS = e.namedValues;
  //Logger.log(jS);
    var a = JSON.stringify(jS);
  
  Logger.log(a);
  

   //Logger.log(o);
  var arr = a.split(',');
  var arry = [];
  for(var i = 0; i < arr.length; i++) {
    
    Logger.log(arr[i]);
    //arry.push(arr[i].match(/\{\"\:\[\/));
  
  }
  
  var fid = arr[0].match(/\d+/g);
  Logger.log(fid);
  var time = arr[1].match(/[([^}]+)]/g);
  Logger.log(time);
  var date = new Date(time);
  Logger.log(date);
*/
}


function test() {
              
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheets = ss.getSheets();
    var sheetArray = [];
  
    var ss2 = SpreadsheetApp.openById("1X5tqOJiazMZa10dYSFVFPzo_shIziWv7WmH_64djJOI");
    var sh2 = ss2.getActiveSheet(); 
   // var dataRange = sheet.getRange(2, 1, 1, 3);
  
  
    for(var s = 0; s < sheets.length; s++){
 
 //var data = sheets[i].getRange("A2:C2").getValues();
 
   var sheet = sheets[s];
  
     // Fetch the range of cells A2:D2
   var dataRange = sheet.getRange(2, 1, 1, 4)
    // Fetch values for each row in the Range
    var data = dataRange.getValues();
  
    for (var i = 0; i < data.length; i++)
     {
       var row = data[i];
     
       var id = row[0];
       var name = row[1];
       var question = row[2];
       //var option = row[3];
     
       if(id!=""||name!=""||question!="") {
           
           //Logger.log(sheets[s].getName());
           //Logger.log(sheets[s].getDataRange(2, 1, 1, 4));
           sheetArray.push(sheets[s].getName());

          }
    }
    }
  
    for(var j = 0; j < sheetArray.length; j++) {
       var sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetArray[j]);
       var r = sh.getRange(2, 1, 1, 3);
       var r2 = sh2.getRange(2, 1, sheet.getMaxRows() - 1, sheet.getMaxColumns());
       //var values = getRowsData(sh, r);
       //var values2 = getRowsData(sh2, r2);
       var values = r.getValues();
       var values2 = r2.getValues();
      
      for(var k = 0; k < values2.length; k++) {
        for(var n = 0; n < values.length; n++) {
          if(values2[k][2] == values[n][1]) {
             var c = sh2.getRange(k+2, 2);
             //var str = values[n][0].toString();
             //var date = new Date();
             Logger.log(values[n][0]);
             c.setValue(values[n][0]);
            
            var flag = false;
            
            for(var m = 8; m < 13; m++) {
              if(values[n][2] == values2[k][m-1]) {
                var cell = sh2.getRange(k+2, m);
                cell.setBackground('yellow');
                flag = true;
              }
              if((m == 12) && (flag == false)) {
                 var cell = sh2.getRange((k+2), 13);
                 cell.setValue(values[n][2]);
                 cell.setBackground('yellow');
              }
            }
            
          }
        }
      }
       var furl = sh.getFormUrl(); 
       //Logger.log(furl);
      
      try {
        
        if(furl != null) {
          Logger.log(furl);
          var form = FormApp.openByUrl(furl).removeDestination();
       //form.removeDestination();
        }
     
          SpreadsheetApp.getActiveSpreadsheet().deleteSheet(sh);
        
      }
      catch(err) {
        Logger.log(err);
      
      }
       
  }


}

function getRowsData(sheet, range, columnHeadersRowIndex) {
  columnHeadersRowIndex = columnHeadersRowIndex || range.getRowIndex() - 1;
  var numColumns = range.getEndColumn() - range.getColumn() + 1;
  var headersRange = sheet.getRange(columnHeadersRowIndex, range.getColumn(), 1, numColumns);
  var headers = headersRange.getValues()[0];
  return getObjects(range.getValues(), normalizeHeaders(headers));
}

// For every row of data in data, generates an object that contains the data. Names of
// object fields are defined in keys.
// Arguments:
//   - data: JavaScript 2d array
//   - keys: Array of Strings that define the property names for the objects to create
function getObjects(data, keys) {
  var objects = [];
  for (var i = 0; i < data.length; ++i) {
    var object = {};
    var hasData = false;
    for (var j = 0; j < data[i].length; ++j) {
      var cellData = data[i][j];
      if (isCellEmpty(cellData)) {
        continue;
      }
      object[keys[j]] = cellData;
      hasData = true;
    }
    if (hasData) {
      objects.push(object);
    }
  }
  return objects;
}

// Returns an Array of normalized Strings.
// Arguments:
//   - headers: Array of Strings to normalize
function normalizeHeaders(headers) {
  var keys = [];
  for (var i = 0; i < headers.length; ++i) {
    var key = normalizeHeader(headers[i]);
    if (key.length > 0) {
      keys.push(key);
    }
  }
  return keys;
}

// Normalizes a string, by removing all alphanumeric characters and using mixed case
// to separate words. The output will always start with a lower case letter.
// This function is designed to produce JavaScript object property names.
// Arguments:
//   - header: string to normalize
// Examples:
//   "First Name" -> "firstName"
//   "Market Cap (millions) -> "marketCapMillions
//   "1 number at the beginning is ignored" -> "numberAtTheBeginningIsIgnored"
function normalizeHeader(header) {
  var key = "";
  var upperCase = false;
  for (var i = 0; i < header.length; ++i) {
    var letter = header[i];
    if (letter == " " && key.length > 0) {
      upperCase = true;
      continue;
    }
    if (!isAlnum(letter)) {
      continue;
    }
    if (key.length == 0 && isDigit(letter)) {
      continue; // first character must be a letter
    }
    if (upperCase) {
      upperCase = false;
      key += letter.toUpperCase();
    } else {
      key += letter.toLowerCase();
    }
  }
  return key;
}

// Returns true if the cell where cellData was read from is empty.
// Arguments:
//   - cellData: string
function isCellEmpty(cellData) {
  return typeof(cellData) == "string" && cellData == "";
}

// Returns true if the character char is alphabetical, false otherwise.
function isAlnum(char) {
  return char >= 'A' && char <= 'Z' ||
    char >= 'a' && char <= 'z' ||
    isDigit(char);
}

// Returns true if the character char is a digit, false otherwise.
function isDigit(char) {
  return char >= '0' && char <= '9';
}


  
  
 
  

