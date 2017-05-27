$( document ).ready(function() {

  var youtubeID = "K6XDyth0qxc"; //test youtube ID

  var rawXML; //raw XML of cc
  var rawText; //raw, minimized text of cc
  var markovJson; //jason with markov chains;

  rawXML = getXML(youtubeID);

  //at this point we will have an XML file of the subtitles under rawXML
  
});
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
