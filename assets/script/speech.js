const {root,config,doc} = require('./root.Config');
export default function(){
  var audio = doc.createElement('audio');
  audio.src = root.url([config.api,'speech',{q:root.Element.parent().text(),l:root.Class[1]}]);
  root.Element.addClass('playing');
  audio.load();
  audio.play();
  audio.addEventListener("ended", function(){
    // myAudio.currentTime = 0;
    // console.log("ended");
    root.Element.removeClass('playing');
  });
}