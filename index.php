<html>
  <head>
    <link rel="stylesheet" href="css/style.css">
    <?php
  //set and get boardname
  $id= "";
  if(empty($_GET["id"])){
    $id = "undefined";
  } else {
    $id= $_GET["id"];
  }
?>
  </head>
  <body>
    <div class = "bigTitle"></div>
    <center>
<h1> YouTube Markov Chain Generator! </h1>
    </center>
<table border="0" width="100%">
  <tr><td width="50%">


    <h3> What is this? </h3>
    <p> This is a fun little application whipped up for the pure purpose of comedy! In the form below, input the link to a YouTube video (longer is better!), and our program will learn how to mimic the speaking pattern of whoever is speaking, and will jump around the video, creating a new and unforseen product that resembles the original, but with a <i>twist!</i></p>

<br>
<h3>How does it work?</h3>
<p>We utilized a method of machine learning called the Markov chain in order to emulate the way a person speaks. It uses the relationships between words and what words typically follow others in order to create something similar, but not <i>quite</i> the same, which often leads to humorous results. As for the video skipping around, we used Javascript in conjunction with the YouTube iframe API in order to control the playback in the specified times and durations that we desired. Simple HTML and query strings were also involved in passing user input to the program, including this page.</p>
<br>

<h3>Whom'st'dve are the masterminds behind this project, and where'st'dve they come from?</h3>
<p>The four of us are:</p>
<ul>
<li>Ivan Galakhov! Here's a link to his <a href="https://github.com/igalakhov">Github!</a></li>
<li>Mansour Elsharawy! Here's a link to his <a href="https://github.com/Razorflame3912">Github!</a></li>
<li>Kelly Kang! Here's a link to her <a href="https://github.com/kelly822">Github!</a></li>
<li>Matthew Chan! Here's a link to his <a href="https://github.com/Imaginality">Github!</a></li>
</ul></td>
<td width = "50%">
  <center>
<h2>Place your YouTube video link here!</h2>
<p>Please note a few things:<p>
<ul>
  <li>The linked video <b>must</b> have clear closed captioning that is in line with what is said on screen.</li>
    <li>A longer video provides the program with more to work with, so the longer, the better!</li>
      <li>With one distinct speaker who is quite unique, results are often more worth it to watch.</li>
</ul>

ID: <input type="text" id="YtId" placeholder="Enter YouTube ID">
<button id="submitButton" onclick = "buttonClick()"> Generate! </button>
<hr>
<div id = "player"> </div>
</center>


</td>
</tr>
</table>
    <!-- youtube API? -->
    <!-- don't remove this thank you -->
    <div id = "handler"> </div>
    <!-- scripts -->
    <script src = "lib/jquery.js"> </script>
    <script src = "js/main.js"> </script>

    <script>
    function buttonClick(){
      var value = $("#YtId").val();
      window.location = "?id=" + value;
    }
    var tubeID = <?php echo "'$id'" ?>;
    var len = 200;

    var markovList = wholeMarkov(tubeID, len);
    console.log(markovList);
    var tag = document.createElement("script");

    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName("script")[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    var player;
    function onYouTubeIframeAPIReady(){
      player = new YT.Player('player', {
        height: '390',
        width: '640',
        videoId: tubeID,
        events: {
          'onReady': onPlayerReady,
          'onStateChange': onPlayerStateChange
        }
      });
    }
    function onPlayerReady(event){
      player.setPlaybackQuality("small");

      event.target.playVideo();

      leng = event.target.getDuration();

      numTimes = Math.floor(leng/26.5);

      numTimes -= 2;

      var mainEval = "function bufferVideo(){";
      for(var i = 0; i < numTimes - 1; i++){
        mainEval += "player.seekTo("+i*28+");"
        mainEval += "setTimeout(function(){";
      }
      mainEval += "player.seekTo("+numTimes*28+");";
      for(var i = 0; i < numTimes - 1; i++){
        mainEval += "}, 3000);";
      }
      mainEval += " doStuff();}"
      console.log(mainEval);

      while(player.getPlayerState() === 3){
        console.log("buffering");
      }
      var startTexts = [];
      var textDurs = [];

      for(var i = 0; i < len; i++){
        if(markovList[i] === undefined){
          while(markovList[i] === undefined){
            i++;
          }
        }
        textStart = markovList[i][0];
        textDur = markovList[i][1];

        startTexts.push(textStart);
        textDurs.push(textDur);
      }
      //some other modifications

      evalStatement = "";
      evalStatement += "function doStuff(){";
      for(var i = 0; i < startTexts.length - 1; i ++){
        evalStatement += "event.target.seekTo("+ startTexts[i] + ");";
        //evalStatement += "while(player.getPlayerState() === 3 && i !== 0){event.target.seekTo("+ startTexts[i] + ")}";
        evalStatement += "setTimeout(function(){";
      }
      evalStatement += "event.target.seekTo(" + startTexts[startTexts.length - 1] + ", true);";
      for(var i = textDurs.length - 2; i > -1; i--){
        evalStatement += "}," + textDurs[i]*1500 + ");";
      }
      evalStatement += "}"
      eval(evalStatement);
      eval(mainEval);
      bufferVideo();
    }
    function onPlayerStateChange(event){
      if(event.data === YT.PlayerState.BUFFERING){
        setTimeout(function(){player.playVideo();}, 1);
      }
    }
    function stopVideo(){
      player.stopVideo();
    }
    </script>
  </body>
</html>
