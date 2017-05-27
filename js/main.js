//this fucntion gets the cc of a youtube video from id
function getXML(id){
  var httpURL = "http://video.google.com/timedtext?lang=en&v=" + id;

  var getCC = new XMLHttpRequest();

  getCC.onreadystatechange = function(){
    if(this.readyState == 4 && this.status == 200){
        return getCC.responseText;
      }
  }
  getCC.open("GET", httpURL, false);
  getCC.send();
}
