// Script code for the dialog to send task items to Taskwarrior

// Get preferences for this addon
var prefs = Components.classes["@mozilla.org/preferences-service;1"]
                      .getService(Components.interfaces.nsIPrefService)
                      .getBranch("extensions.taskwarrior.");

/*
* Trims whitespace, reduces inner newlines and spaces
*/
function trim(string, length) {
// get rid of stacked newlines
string = (string || '').replace(/\n{3,}/g, '\n\n');

// get rid of redundant spaces
string = string.replace(/\s{3,}/g, ' ');
string = string.replace(/^\s+/g,'').replace(/\s+$/g,'');

// only trim string length if it's
if (string.length > length) 
    string = string.substring(0, length) + '...';

return string;
}

function encode(string) {
  string = string.replace(/\r\n/g,"\n");
  var utftext = "";

  for (var n = 0; n < string.length; n++) {
      var c = string.charCodeAt(n);
      if (c < 128) {
          utftext += String.fromCharCode(c);
      }
      else if((c > 127) && (c < 2048)) {
          utftext += String.fromCharCode((c >> 6) | 192);
          utftext += String.fromCharCode((c & 63) | 128);
      }
      else {
          utftext += String.fromCharCode((c >> 12) | 224);
          utftext += String.fromCharCode(((c >> 6) & 63) | 128);
          utftext += String.fromCharCode((c & 63) | 128);
      }
  }
  return utftext;  
}

// called (once) when dialog is loaded
function onLoad() {

  var message = parent.opener.gFolderDisplay.selectedMessage;
  var messenger = Components.classes["@mozilla.org/messenger;1"]
                            .createInstance(Components.interfaces.nsIMessenger);
  var listener = Components.classes["@mozilla.org/network/sync-stream-listener;1"]
                           .createInstance(Components.interfaces.nsISyncStreamListener);

  var folder = message.folder;
  var uri = folder.getUriForMsg(message);
  messenger.messageServiceFromURI(uri).streamMessage(uri, listener, null, null, false, "");
  var tag = prefs.getCharPref("default-tag");
  var annotate = prefs.getBoolPref("addAnnotations");

  document.getElementById('taskwarrior-annotation').checked = annotate;

  // Get title, author, recipients and message
  var description = trim(message.mime2DecodedSubject, 150);
  if (tag != "") {
    description = description + " " + tag;
  }
  var author = "From: " + message.mime2DecodedAuthor + "\n";
  var recipients = "To: " + message.mime2DecodedRecipients + "\n\n";
  var annotation = folder.getMsgTextFromStream(listener.inputStream, message.Charset, 65536, 32768, false, true, { });

  annotation = author + recipients + trim(annotation, 2000);

  // Fill the dialog fields
  document.getElementById('taskwarrior-description').value = description;
  document.getElementById('taskwarrior-annotation').value = annotation;
  document.getElementById('taskwarrior-tag').value = tag;
}

// Button "Accept" pressed ...
function doAccept() {
  // retrieve the current values set in the dialog
  var description = document.getElementById('taskwarrior-description').value;
  var annotation = document.getElementById('taskwarrior-annotation').value;
  var annotate = document.getElementById('taskwarrior-annotate').checked;
  var tag = document.getElementById('taskwarrior-tag').value;
  var duedate = document.getElementById('taskwarrior-duedate').value;

  // UTF8 encode the characters, as this is taskwarrior standard
  description = encode(description);
  annotation = encode(annotation);

  // Prepare tag
  if (tag.length > 0) {
    tag = "+" + tag;
  }
  // Prepare due date
  if (duedate.length > 0) {
    duedate = "due:" + duedate;
  }

//  console.log('Description: ' + description + '\n\nAnnotation: \n' + annotation);

  // Run the task command
  // create an nsIFile for the executable
  var file = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsIFile);
  var binary = prefs.getCharPref("binary");
  file.initWithPath(binary);

  // create an nsIProcess
  var process = Components.classes["@mozilla.org/process/util;1"].createInstance(Components.interfaces.nsIProcess);
  process.init(file);
  // Call process and wait for return
  var args = ["add", description, duedate, tag];
//  console.log(args);
  process.run(true, args, args.length);

  // Make a second call to add annotations, if flag is set in dialog
  if (annotate) {
    process = Components.classes["@mozilla.org/process/util;1"].createInstance(Components.interfaces.nsIProcess);
    process.init(file);
    // Notes can only be added if task already exists
    args = [description, "annotate", annotation];
  //  console.log(args);
    // Call process and wait for return
    process.run(true, args, args.length);  
  }
  
  return;
}

// Button "Cancel" pressed ...
function doCancel() {
  //alert('Cancel!');  
  return;
}

