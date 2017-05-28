//globals (kinda like settings)
var replaceChars = ["-", "_", "+", "$", "–", ";", "&amp#39", "&ampquot"]; //these characters are removed from strings
var len = 100; //how long the markov will be
var letterWeights = {  //letter weights for parsing
  "a": 1,
  "b": 0,
  "c": 0,
  "d": 0,
  "e": 1,
  "f": 0,
  "g": 0,
  "h": 0,
  "i": 1,
  "j": 0,
  "k": 0,
  "l": 0,
  "m": 0,
  "n": 0,
  "o": 1,
  "p": 0,
  "q": 0,
  "r": 0,
  "s": 0,
  "t": 0,
  "u": 1,
  "v": 0,
  "w": 0,
  "x": 0,
  "y": 1,
  "z": 0,
  " ": 1,
  ".": 0
};
$(document).ready(function() {
  //var markovList = wholeMarkov("wYFv_atMmXU");
  // Load the IFrame Player API code asynchronously.
  var tag = document.createElement('script');
  tag.src = "https://www.youtube.com/player_api";
  var firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

  var player;

  function onYouTubeIframeAPIReady(){
    alert("Hello");
  }

});
function wholeMarkov(youtubeID){
  var rawXML; //raw XML of cc
  var rawText = ""; //raw, minimized text of cc
  var textList = []; //list of all the words and simbols, unique
  var markovJson = {}; //jason with markov chains;
  var textStamps = {}; //json with words and their time
  var finalMarkov = []; //finall list of all the words and the times with have to jumped in the form [[start, duration], [start, duration]] etc...

  rawXML = getXML(youtubeID);

  //at this point we will have an XML file of the subtitles under rawXML

  rawText = getRawText(rawXML);

  //at this point we have the raw text

  textList = makeWordList(rawText);

  //now we have a unique list of all the words

  markovJson = makeMarkovJson(rawText, textList);

  //we now have a functional markov Json

  markovText = makeStringWithJson(markovJson, textList, len);

  //we now have a markov text

  textStamps = makeTimeStamps(rawXML, textList);

  //we now have an array with all textstamps

  finalMarkov = makeFinalMarkov(textStamps, markovText);

  return finalMarkov;
}
//this makes the final markov
function makeFinalMarkov(textStamps, markovText){
  var output = [];
  for(var i = 0; i < markovText.length; i++){
    var curWord = markovText[i];
    var chooseArr = textStamps[curWord];
    output.push(chooseArr[Math.floor(Math.random() * chooseArr.length)]);
  }
  return output;
}
//this makes a timestamp Json from XML
function makeTimeStamps(xmlFile, textList){
  var outputJson = {};

  for(var i = 0; i < textList.length; i++){
    outputJson[textList[i]] = [];
  }

  var texts = xmlFile.getElementsByTagName("text");


  for(var i = 0; i < texts.length; i++){
    var curString = xmlFile.getElementsByTagName("text")[i].innerHTML;

    var sum = 0;

    var stringValues = [];

    //do stuff with string
    curString = normalizeString(curString);

    curString = curString.split("");

    for(var j = 0; j < curString.length; j++){
      curLetter = curString[j];
      if(letterWeights[curLetter] !== undefined){
        sum += letterWeights[curLetter];
        stringValues[j] = letterWeights[curLetter];
      }
    }

    //we now have the sum of the thing
    var start = parseFloat(xmlFile.getElementsByTagName("text")[i].getAttribute("start"));
    var duration = parseFloat(xmlFile.getElementsByTagName("text")[i].getAttribute("dur"));

    var wordStartIndex = [0];
    var wordEndIndex = []
    for(var j = 0; j < curString.length - 1; j++){
      if(curString[j] === " "){
        wordStartIndex.push(j + 1);
      }
    }
    for(var j = 0; j < curString.length; j++){
      if(curString[j] === " "){
        wordEndIndex.push(j - 1);
      }
    }
    for(var j = 0; j < wordStartIndex.length; j++){
      var output = [];

      var valBefore = getSum(curString, 0, wordStartIndex[j]);
      var timeBefore = start + (duration * (valBefore/sum));
      output.push(timeBefore);

      valNow = getSum(curString, wordStartIndex[j], wordEndIndex[j]);
      timeNow = (duration * (valNow/sum));

      output.push(timeNow);

      word = "";
      for(var k = wordStartIndex[j]; k < (wordEndIndex[j] + 1); k++){
        word += curString[k];
      }

      outputJson[word].push(output);
    }
  }

    return outputJson;
}
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
  outputString.replace(/&apos;/g, "'")
           .replace(/&quot;/g, '"')
           .replace(/&gt;/g, '>')
           .replace(/&lt;/g, '<')
           .replace(/&amp;/g, '&');

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
function normalizeString(outputStrung){
  outputString = outputStrung.toLowerCase();

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
  outputString = outputString.replace(/\s\s+/g, ' ');

  return outputString;
}

//this function calculates sum of array at give values
function getSum(arr, start, end){
  var sum = 0;
  for(var j = start; j < end + 1; j++){
    var letter = arr[j];
    if(letterWeights[letter] !== undefined){
      sum += letterWeights[letter];
    }
  }
  return sum;
}
