!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):(e=e||self).RevealNotes=t()}(this,(function(){"use strict";return function(){var e,t=null;function n(n){var o;!t||t.closed?(n||(n="plugin/notes/notes.html"),(t=window.open(n,"reveal.js - Notes","width=1100,height=700"))?(o=setInterval((function(){t.postMessage(JSON.stringify({namespace:"reveal-notes",type:"connect",url:window.location.protocol+"//"+window.location.host+window.location.pathname+window.location.search,state:e.getState()}),"*")}),500),window.addEventListener("message",(function(n){var s,r,i,d,l=JSON.parse(n.data);l&&"reveal-notes"===l.namespace&&"connected"===l.type&&(clearInterval(o),e.on("slidechanged",a),e.on("fragmentshown",a),e.on("fragmenthidden",a),e.on("overviewhidden",a),e.on("overviewshown",a),e.on("paused",a),e.on("resumed",a),a()),l&&"reveal-notes"===l.namespace&&"call"===l.type&&(s=l.methodName,r=l.arguments,i=l.callId,d=e[s].apply(e,r),t.postMessage(JSON.stringify({namespace:"reveal-notes",type:"return",result:d,callId:i}),"*"))}))):alert("Speaker view popup failed to open. Please make sure popups are allowed and reopen the speaker view.")):t.focus();function a(n){var o=e.getCurrentSlide(),a=o.querySelector("aside.notes"),s=o.querySelector(".current-fragment"),r={namespace:"reveal-notes",type:"state",notes:"",markdown:!1,whitespace:"normal",state:e.getState()};if(o.hasAttribute("data-notes")&&(r.notes=o.getAttribute("data-notes"),r.whitespace="pre-wrap"),s){var i=s.querySelector("aside.notes");i?a=i:s.hasAttribute("data-notes")&&(r.notes=s.getAttribute("data-notes"),r.whitespace="pre-wrap",a=null)}a&&(r.notes=a.innerHTML,r.markdown="string"==typeof a.getAttribute("data-markdown")),t.postMessage(JSON.stringify(r),"*")}}return{id:"notes",init:function(t){e=t,/receiver/i.test(window.location.search)||(null!==window.location.search.match(/(\?|\&)notes/gi)&&n(),e.addKeyBinding({keyCode:83,key:"S",description:"Speaker notes view"},(function(){n()})))},open:n}}()}));