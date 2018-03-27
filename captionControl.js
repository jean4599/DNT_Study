videoElement.onloadedmetadata = function(){
	videoElement.textTracks[0].mode="hidden";
	const captionContainer = document.querySelector('.caption-container')
	const captionLineTemplate = document.querySelector('.caption-line')

	captions = videoElement.textTracks[0].cues;
	// console.log(captions)
	for (var i =0; i<captions.length; i++){
		let line = captions[i]
		newCaptionLine = captionLineTemplate.cloneNode(false);
		newCaptionLine.classList.remove('template');
		newCaptionLine.innerHTML = line.text;
		newCaptionLine.id = line.id;
		newCaptionLine.setAttribute("startTime", line.startTime) ;
		newCaptionLine.setAttribute("endTime", line.endTime)

		captionContainer.appendChild(newCaptionLine);
	}

	$('.caption-line').click(function(){
		videoElement.currentTime = $(this).attr('startTime')
	})
}
var preActiveCaptionId = -1;
const container = $('.caption-container')

videoElement.ontimeupdate = function(){
	let activeCue = videoElement.textTracks[0].activeCues;
	if(activeCue.length){
		let activeCaptionId = activeCue[0].id;
		if(preActiveCaptionId != activeCaptionId){
			$('.caption-line').css('font-weight', 'normal')
			$('.caption-line#'+activeCaptionId).css('font-weight', 'bold');
			container.animate({
				scrollTop: $('.caption-line#'+activeCaptionId).offset().top - container.offset().top + container.scrollTop() - 200
			})
			preActiveCaptionId = activeCaptionId;
		}
	}
}
document.onselectstart = function() {
  console.log("Selection started!");
}
document.onmouseup = function() {
  console.log("Selection end!");
  var selection='';
  if(window.getSelection){selection=window.getSelection();}
  else if(document.getSelection){selection=document.getSelection();}
  else if(window.document.selection){selection=window.document.selection.createRange().text;}
  if(selection!=''){
  	// console.log(t)
  	if(selection.focusNode.nodeType==3){//is text node
  		replaceSelectedText('!!!')
  	}
  }
}

function replaceSelectedText(replacementText) {
    var sel;
    var allRanges = []
    if (window.getSelection) {
        sel = window.getSelection();
        if (sel.rangeCount) {
            range = sel.getRangeAt(0);

            console.log(range)
            startContainer = range.startContainer;
            endContainer = range.endContainer;

            console.log("startContainer.parentNode")
            console.log(startContainer.parentNode)
            console.log("endContainer.parentNode")
            console.log(endContainer.parentNode)

            if(startContainer==endContainer){
            	// allRanges.push(range)
            	highLightRange(range)
            }
            else{
            	rangeAncestor = range.commonAncestorContainer;
            	nodeIterator = document.createNodeIterator(rangeAncestor, NodeFilter.SHOW_TEXT, 
            		function(node) {
				        return range.intersectsNode(node) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
				    }
				);
            	var pars = [];
            	while (currentNode = nodeIterator.nextNode()) {
					pars.push(currentNode);
				}
				console.log(pars)
				var r = document.createRange();
				r.setStart(pars[0], range.startOffset);
				r.setEnd(pars[0], pars[0].length);
				highLightRange(r);

				if(pars.length>2){
					for(var i=1; i<pars.length-1; i++){
						r.setStart(pars[i], 0);
						r.setEnd(pars[i], pars[i].length);
						highLightRange(r);
					}
				}
				r.setStart(pars[pars.length-1], 0);
				r.setEnd(pars[pars.length-1], range.endOffset);
				highLightRange(r);
	        }
        }
    } else if (document.selection && document.selection.createRange) {
        range = document.selection.createRange();
        range.text = replacementText;
    }
}
function highLightRange(range){
	console.log("high light range")
	console.log(range)
	selectedText = range.toString();
    var newnode = document.createElement("p");
    newnode.textContent = selectedText;
    newnode.classList.add('highlight-text')
    console.log(newnode)
    range.deleteContents();
    range.insertNode(newnode);
}