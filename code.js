 var ss = SpreadsheetApp.getActiveSpreadsheet();
 var sheet = ss.getActiveSheet();
 var col = sheet.getLastColumn();

function doGet() {
  return HtmlService.createTemplateFromFile('INDEX').evaluate();
}
 
function onOpen(e) {
  SpreadsheetApp.getUi().createAddonMenu()
      .addItem('Start', 'showSidebar')
      .addToUi();
}

function onInstall(e) {
  onOpen(e);
}

function showSidebar() {
  var ui = HtmlService.createTemplateFromFile('INDEX').evaluate()
      .setTitle('Send mails');
  SpreadsheetApp.getUi().showSidebar(ui);
}


function getData() {
  
   ss = SpreadsheetApp.getActiveSpreadsheet();
   sheet = ss.getSheets()[0];
   var dataRange = sheet.getRange(2, 1, sheet.getMaxRows() - 1, sheet.getMaxColumns());
   var names = getRowsData(sheet, dataRange);
   
   return names;

}
//return column 'Team Name' for the drop down list
function dropdown() {
  
  var list = getData();
  var tName = [];
  
  for(var i = 0; i < list.length; i++) {
        if(tName.indexOf(list[i].teamName) == -1){
            tName.push(list[i].teamName);
  
  }
  }
  //Logger.log(tName);
  return tName;

}

//get the selected 'id' value and return relavant row data
function selectId(g) {
  
 //Logger.log(g);
  //var g = "Team 1";
  
  var allValues = getData();
  var idValues = [];
  
  for(var i = 0; i < allValues.length; i++) {
     
    if(allValues[i].teamName == g) {
       idValues.push(allValues[i].id);
       //optionValues.push(allValues[i].option2);
       //optionValues.push(allValues[i].option3);
    
    }
  }
  //Logger.log(idValues);
  
    //var output = HtmlService.createTemplate('<? for(var j = 0; j < optionValues.length; j++) { ?> <input type="radio" name="option" value="<?= (j+1) ?>"><?= optionValues[j] ?><br> <? } ?><br><input type="submit" onclick="<? google .script.run ?>">').evaluate().getContent();
  /*var output = HtmlService.createTemplate('<h1>gdhjsdg</h1>').evaluate().getContent();
  Logger.log(output);
    MailApp.sendEmail({
    to: "w.anushka@gmail.com",
    subject: 'Test Email markup - ' + new Date(),
    htmlBody: output,
  });*/

 return idValues;
  
}

function fetchRow(rowId) {
  //Logger.log("gdjhgdjghdkhg");
  //var rowId = 1002;
 

  // ss2 conatin URL of Founder's Response(where all responses are stored after form submission)
  var ss2 = SpreadsheetApp.openByUrl('https://docs.google.com/spreadsheets/d/1zdoEWaDjg_4zB6m584JUCqPgw93ciideKccZJRyI3dk/edit#gid=0');
                                      
 //Logger.log(rowId);
  var allData = getData();
  //Logger.log(allData);
  var row = 0;
  var id = "";
  var team = "";
  var email = "";
  var message = "";
  var question = "";
  var option = [];
  var other = "";
  
  for(var i = 0; i < allData.length; i++) {
    if(rowId == allData[i].id) {
        row = i+2;
        id = allData[i].id;
        team = allData[i].teamName;
        email = allData[i].email;
        message = allData[i].message;
        question = allData[i].question;
        option.push(allData[i].option1);
        option.push(allData[i].option2);
        option.push(allData[i].option3);
        option.push(allData[i].option4);
        option.push(allData[i].option5);
        other = allData[i].other;
    }
  
  }
  
  //Logger.log([team, email, message, question, option]);
  //create a form using row data
  var rowData = [team, email, message, question, option, other, id];
  //Logger.log(rowData);
  var form = FormApp.create('New Form');

  
  form.setTitle('iBoost Support').setDescription(rowData[1]+' Hello '+rowData[0]+'  '+rowData[2])
     .setConfirmationMessage('Thank you for responding!')
     .setAllowResponseEdits(false)
     .setAcceptingResponses(true);
  form.setDestination(FormApp.DestinationType.SPREADSHEET, ss2.getId());
 //form.setDestination(FormApp.DestinationType.SPREADSHEET, ss.getId());
  
  var item = form.addMultipleChoiceItem();
  item.setTitle('Form Id').setChoices([item.createChoice(rowData[6])]).showOtherOption(false);
  Logger.log("ggghhhhhjhj");
  var item2 = form.addMultipleChoiceItem();
  
    item2.setTitle(rowData[3])
    .setChoiceValues(rowData[4])
    .showOtherOption(true);
  var url = form.getPublishedUrl();
  
 
  var response = UrlFetchApp.fetch(url);
  var htmlBody = HtmlService.createHtmlOutput(response).getContent();
  //var htmlBody = HtmlService.createTemplate(response).evaluate().getContent();
  rowData.push(url);
  return [url, row];
  //Logger.log(rowData);
 
  /*
  //create the link 
  Logger.log(form);
  //var template = HtmlService.createTemplate('<h4>Hello <?= data[0] ?></h4><p><?= data[2] ?></p><p><span>Please fill out &nbsp;</span><a href="<?= data[7] ?>">this form</a>&nbsp; to help us to update your information.</p><p>Thank you.</p>');
  var template = HtmlService.createTemplate('<h4>Hello <?= data[0] ?></h4><p><?= data[2] ?></p><p><span>Please fill out this form</span></p><iframe src="<?= data[7] ?>"></iframe><p>Thank you.</p>');

  //('<iframe src="https://docs.google.com/forms/d/e/1FAIpQLSfEPpF8hW_aUpJmgL_jHjELDGBcOqgzZncpl25tQTgaTpqhzw/viewform?embedded=true" 
   //width="760" height="500" frameborder="0" marginheight="0" marginwidth="0">Loading...</iframe>');
  template.data = rowData;
  
  var output = template.evaluate().getContent();
  var mailquota = MailApp.getRemainingDailyQuota();
  Logger.log(mailquota);
  var count = 0;
      
  //Logger.log(output);
  //Logger.log(rowData[1]);
  if(count <= mailquota) {
    MailApp.sendEmail({
      to: rowData[1],
      subject: 'Test Email markup - ' + new Date(),
      htmlBody: htmlbody,
    });
    
    count++;
     var cell1 = sheet.getRange(row, 1);
     cell1.setValue(new Date());
     var cell2 = sheet.getRange(row, col);
     cell2.setValue("sent");
 
  }
  else {
    Browser.msgBox("Your daily email quota ran out. Your email was not sent.");
  }
  
  
  
  */
  
}

function updateSheet(row) {
  
  var cell1 = sheet.getRange(row, 1);
  cell1.setValue(new Date());
  var cell2 = sheet.getRange(row, col);
  cell2.setValue("sent");

}

/*
function test() {
  
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getActiveSheet();
  var name = sheet.getSheetName();
  
  if(name.includes('Form Responses')){
     Logger.log('found');
  }

}
*/


/*
function testSchemas() {
  var htmlBody = HtmlService.createHtmlOutputFromFile('mail_template').getContent();

  MailApp.sendEmail({
    to: Session.getActiveUser().getEmail(),
    subject: 'Test Email markup - ' + new Date(),
    htmlBody: htmlBody,
  });
}
*/

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

