//globals (kinda like settings)
var replaceChars = ["-", "_", "+", "$", "–"] //these characters are removed from strings

$( document ).ready(function() {

  var youtubeID = "K6XDyth0qxc"; //test youtube ID

  var rawXML; //raw XML of cc
  var rawText; //raw, minimized text of cc
  var markovJson; //jason with markov chains;

  rawXML = getXML(youtubeID);

  //at this point we will have an XML file of the subtitles under rawXML

  rawText = getRawText(rawXML);

});
//this is the fucntion that gets the raw text of the XML
function getRawText(xmlFile){
  outputString = "";

  var texts = xmlFile.getElementsByTagName("text");

  for(var i = 0; i < texts.length; i++){
    curString = xmlFile.getElementsByTagName("text")[i].innerHTML;

    outputString = outputString.concat(curString);

    outputString += " ";
  }

  outputString = outputString.toLowerCase();

  for(var i = 0; i < replaceChars.length; i++){
    outputString = outputString.replaceAll(replaceChars[i], "");
  }

  outputString = outputString.replaceAll(".", " . ");
  outputString = outputString.replaceAll(",", " . ");
  outputString = outputString.replaceAll("?", " . ");
  outputString = outputString.replaceAll("!", " . ");

  return outputString;

}
//this fucntion gets the cc of a youtube video from id DON'T TOUCH THIS
function getXML(id){
  var httpURL = "http://video.google.com/timedtext?lang=en&v=" + id;
  var getCC = new XMLHttpRequest();

  getCC.onreadystatechange = function(){
    if(this.readyState == 4 && this.status == 200){
      $("#handler").text(getCC.responseText);
    }
  }
  getCC.open("GET", httpURL, false);
  getCC.send();

  var rawXmlTxt = $("#handler").text();

  $("#handler").text("");

  parser = new DOMParser();

  xmlDoc = parser.parseFromString(rawXmlTxt, "text/xml");

  return xmlDoc;
}
//this function replaces all characters in a string
String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};
