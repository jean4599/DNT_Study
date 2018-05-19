userID=''
$("#login-btn").click(function(){
	userEmail = $("input[name=email]").val();
	userID = firebase.database().ref(course+'/').push().key;
	console.log("userID: ", userID)
	window.location.href="index.html#"+userID
})