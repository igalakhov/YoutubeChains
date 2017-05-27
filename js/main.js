//globals (kinda like settings)
var replaceChars = ["-", "_", "+", "$", "–", ";"]; //these characters are removed from strings
var letterWeights = {}; //letter weights for parsing
$(document).ready(function() {

  var youtubeID = "hg3umXU_qWc"; //test youtube ID

  var rawXML; //raw XML of cc
  var rawText = ""; //raw, minimized text of cc
  var textList = []; //list of all the words and simbols, unique
  var markovJson = {}; //jason with markov chains;
  var textStamps = {}; //json with words and their time

  rawXML = getXML(youtubeID);

  //at this point we will have an XML file of the subtitles under rawXML

  rawText = getRawText(rawXML);

  //at this point we have the raw text

  textList = makeWordList(rawText);

  //now we have a unique list of all the words

  markovJson = makeMarkovJson(rawText, textList);

  //we now have a functional markov Json

  console.log((makeStringWithJson(markovJson, textList, 100).join(" ")));

});
//this makes a markov generated
function makeStringWithJson(markovJson, textList, len){
  var output = [];
  var curIndex = 0;
  for(var i = 0; i < len; i++){
    output.push(curIndex);
    var possiblities = markovJson[textList[curIndex]];
    curIndex = possiblities[Math.floor(Math.random()*possiblities.length)];
  }
  for(var i = 0; i < output.length; i++){
    output[i] = textList[output[i]];
  }
  return output;
}
//this makes a list of unique words
function makeWordList(wordString){
  wordString = wordString.split(" ");

  wordString = wordString.filter( function( item, index, inputArray ) {
    return inputArray.indexOf(item) == index;
  });
  return wordString;
}
//this function makes markov Json from String
function makeMarkovJson(markovString, textList){
  var outputJson = {};

  markovString = markovString.split(" ");

  for(var i = 0; i < textList.length; i++){
    outputJson[textList[i]] = [];
  }

  for(var i = 0; i < (markovString.length) - 1; i++){
    var index = textList.indexOf(markovString[i+1]);
    outputJson[markovString[i]].push(index);
  }
  return outputJson;
}
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

  outputString = unescape(outputString);

  for(var i = 0; i < replaceChars.length; i++){
    outputString = outputString.replaceAll(replaceChars[i], "");
  }

  outputString = outputString.replaceAll(".", " . ");
  outputString = outputString.replaceAll(",", " . ");
  outputString = outputString.replaceAll("?", " . ");
  outputString = outputString.replaceAll("!", " . ");
  outputString = outputString.replace(/ *\([^)]*\) */g, "");
  outputString = outputString.replace(/(\r\n|\n|\r)/gm, " ");
  outputString = outputString.replaceAll("&amp#39", " ");

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
//this function returns an array with only unique values
function filterUnique(array){
  var uniqueVals = [];
  $.each(array, function(i, el){
    if($.inArray(el, uniqueVals) === -1) uniqueVals.push(el);
  });
  return uniqueVals;
}
