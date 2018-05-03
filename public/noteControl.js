const noteControlContainer = document.getElementById('note-controls')
const noteControls = $('.note-controls').find('*');
const noteMarkerBar = document.querySelector(".note-marker");
const noteMarkerNote = document.querySelector(".template.note-marker-fill.note");
const noteMarkerHighlight = document.querySelector(".template.note-marker-fill.highlight");
const noteMarkerQuestion = document.querySelector(".template.note-marker-fill.question")

document.onselectstart = function() {
  console.log("Selection started!");
}
document.onmouseup = function(e) {
  console.log("Selection end!");
  var selection='';
  if(window.getSelection){selection=window.getSelection();}
  else if(document.getSelection){selection=document.getSelection();}
  else if(window.document.selection){selection=window.document.selection.createRange().text;}
  if(selection!=''){
  	// console.log(t)
  	console.log("mouse poition: x ", e.clientX, " y ", e.clientY)
  	$('.note-controls').css({top: e.clientY+10, left: e.clientX-90, display: 'block'});
  	getRange();
  }
}
function getRange(){
	if (window.getSelection) {
        sel = window.getSelection();
        if (sel.rangeCount) {
            range = sel.getRangeAt(0);
        }
    } else if (document.selection && document.selection.createRange) {
        range = document.selection.createRange();
    }
}
function highlightSelectText(type) {
    var sel;
    var allRanges = []
    

    startContainer = range.startContainer;
    endContainer = range.endContainer;

    if(startContainer==endContainer){
    	highLightRange(range, type)
    	return startContainer.parentElement.getAttribute('starttime')
    }
    else{
    	rangeAncestor = range.commonAncestorContainer;
    	nodeIterator = document.createNodeIterator(rangeAncestor, NodeFilter.SHOW_TEXT, 
    		function(node) {
		        return range.intersectsNode(node) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
		    }
		);
    	var pars = [];
    	
    	var firstNode = nodeIterator.nextNode(); //I need to get the video starttime of first node 
    	pars.push(firstNode);
    	while (currentNode = nodeIterator.nextNode()) {
			pars.push(currentNode);
		}

		var r = document.createRange();
		r.setStart(pars[0], range.startOffset);
		r.setEnd(pars[0], pars[0].length);
		highLightRange(r, type);

		if(pars.length>2){
			for(var i=1; i<pars.length-1; i++){
				r.setStart(pars[i], 0);
				r.setEnd(pars[i], pars[i].length);
				highLightRange(r, type);
			}
		}
		r.setStart(pars[pars.length-1], 0);
		r.setEnd(pars[pars.length-1], range.endOffset);
		highLightRange(r, type);

		return(firstNode.parentElement.getAttribute('starttime'))
    }
        
}
function highLightRange(range, type){
	selectedText = range.toString();
    var newnode = document.createElement("p");
    newnode.textContent = selectedText;
    switch(type){
    	case 'highlight':
    		newnode.classList.add('highlight-text')
    		break;
    	case 'notes':
    		newnode.classList.add('highlight-notes');
    		break;
    	case 'question':
    		newnode.classList.add('highlight-question');
    		break;
    }
    
    range.deleteContents();
    range.insertNode(newnode);
    window.getSelection().removeAllRanges();
}
function clearFormInput(){
	$('#form-input-concept').val("");
	$('#form-input-notes').val("");
}
function addTimelineMarker(startTime, type){
	//Highlight video progress bar
	var newNoteMarker;
	switch(type){
		case 'highlight':
			newNoteMarker = noteMarkerHighlight.cloneNode(false);
			break;
		case 'notes':
		 	newNoteMarker = noteMarkerNote.cloneNode(false);
		 	break;
		case 'question':
			newNoteMarker = noteMarkerQuestion.cloneNode(false);
			break;
	}

	let left = (100 / videoElement.duration) * (startTime);
	let width = (100 / videoElement.duration) * 8;

	// Update the marker value
	newNoteMarker.classList.remove("template")
	newNoteMarker.style.width = width + "%";
	newNoteMarker.style.left = left + "%";
	noteMarkerBar.appendChild(newNoteMarker);
}
$(".btn-note").click(function(){
	pauseVideo();
	$('#note-modal').modal('show')
});
$(".btn-note-save").click(function(){
	//Highlight transcript
	var starttime = highlightSelectText('notes');

	//Highlight video progress bar
	addTimelineMarker(starttime,'notes')
	
	//save new highlighted caption to database
	const captionContainer = document.querySelector('.caption-container')
	firebase.database().ref(course).set({'caption': captionContainer.innerHTML});
	
	$(".note-controls").css({display: 'none'})
	playVideo();
	clearFormInput();
});
$(".btn-question").click(function(){
	pauseVideo();
	$('#question-modal').modal('show')
})
$(".btn-question-save").click(function(){
	//Highlight transcript
	var starttime = highlightSelectText('question');
	
	//Highlight video progress bar
	addTimelineMarker(starttime,'question');
	

	$(".note-controls").css({display: 'none'})
	playVideo();
	clearFormInput();
})
$(".btn-highlight").click(function(){
	//Highlight transcript
	var starttime = highlightSelectText('highlight');

	//save new highlighted caption to database
	const captionContainer = document.querySelector('.caption-container')
	firebase.database().ref(course).set({'caption': captionContainer.innerHTML});
	
	//Highlight video progress bar
	addTimelineMarker(starttime,'highlight')
	
	$(".note-controls").css({display: 'none'})
})
$(document).mousedown(function(e){
	console.log(noteControls)
	console.log(e.target)
	var flag = false;
	for (var i = noteControls.length - 1; i >= 0; i--) {
		if(e.target === noteControls[i]){
			flag = true;
			break;
		}
	}
	console.log(flag)
	if(!flag && noteControlContainer.style.display !== 'none'){
		console.log(e.target)
		$('.note-controls').css({display: 'none'})
	}
})
