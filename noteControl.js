const btnHightLight = document.querySelector(".btn-highlight");
const noteMarkerBar = document.querySelector(".note-marker")
const noteMarkerNote = document.querySelector(".template.note-marker-fill.note");
const noteMarkerHighlight = document.querySelector(".template.note-marker-fill.highlight");
const noteMarkerQuestion = document.querySelector(".template.note-marker-fill.question")

$(".btn-note").click(function(){
	pauseVideo();
	$('#note-modal').modal('show')
});
$(".btn-note-save").click(function(){
	const newNoteMarker = noteMarkerNote.cloneNode(false);

	let left = (100 / videoElement.duration) * (videoElement.currentTime-5);
	let width = (100 / videoElement.duration) * 5;

	// Update the marker value
	newNoteMarker.classList.remove("template")
	newNoteMarker.style.width = width + "%";
	newNoteMarker.style.left = left + "%";
	noteMarkerBar.appendChild(newNoteMarker);

	playVideo();
});
$(".btn-question").click(function(){
	pauseVideo();
	$('#question-modal').modal('show')
})
$(".btn-question-save").click(function(){
	const newNoteMarker = noteMarkerQuestion.cloneNode(false);

	let left = (100 / videoElement.duration) * (videoElement.currentTime-5);
	let width = (100 / videoElement.duration) * 5;

	// Update the marker value
	newNoteMarker.classList.remove("template")
	newNoteMarker.style.width = width + "%";
	newNoteMarker.style.left = left + "%";
	noteMarkerBar.appendChild(newNoteMarker);

	playVideo();
})
const addHighLight = () => {
	const newNoteMarker = noteMarkerHighlight.cloneNode(false);

	let left = (100 / videoElement.duration) * (videoElement.currentTime-5);
	let width = (100 / videoElement.duration) * 5;

	// Update the marker value
	newNoteMarker.classList.remove("template")
	newNoteMarker.style.width = width + "%";
	newNoteMarker.style.left = left + "%";
	noteMarkerBar.appendChild(newNoteMarker);
}

btnHightLight.addEventListener("click", addHighLight, false);
