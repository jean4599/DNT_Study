userID=''
$("#login-btn").click(function(){
	userID = $("input[name=id]").val();
	window.location.href="psychology.html#"+userID
})