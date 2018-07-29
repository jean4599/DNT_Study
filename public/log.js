
function getCurrentTime(){
	var d = new Date();
    var n = d.getTime();
    return n
}
function Log(log){
	userID=location.hash.split("#")[1]
	console.log(log)
	var vid = document.getElementById("video")
	var globalTime = getCurrentTime();
	var videoTime = vid.currentTime;
	firebase.database().ref(userID+'/log/'+globalTime).set('vt:'+videoTime+'&'+log)
}
function GlobalLog(log){
	userID=location.hash.split("#")[1]
	var globalTime = getCurrentTime();
	firebase.database().ref(userID+'/log/'+globalTime).set('global:'+log)
}