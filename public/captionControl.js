videoElement.onloadedmetadata = function(){
	videoElement.textTracks[0].mode="hidden";
	const captionContainer = document.querySelector('.caption-container')
	const captionLineTemplate = document.querySelector('.caption-line')

	const fire_route = course+'/'+location.hash.split("#")[1];
	firebase.database().ref(fire_route+'/'+userID).child('caption').once('value').then(function(snapshot){
	
		console.log(userID)	//console.log(snapshot.val())
		if(snapshot.val()!=null){
			captionContainer.innerHTML = snapshot.val();
		}else{
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
		}
		$('.caption-line').click(function(){
			videoElement.currentTime = $(this).attr('startTime')
		})
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