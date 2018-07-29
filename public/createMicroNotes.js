const course = 'psychology';
const fire_route = course+'/'+location.hash.split("#")[1];
var caption = "";
var highlight_list = [];
var target_key;
$(document).ready(function(){
	firebase.database().ref(fire_route+'/caption').once('value').then(function(snapshot){
		if(snapshot.val()!=null){ //user has highlights
			console.log("database has caption")
			caption = snapshot.val();
			firebase.database().ref(fire_route+'/highlight').once("value").then(function(snapshot){
				if(snapshot.val()!=null){
						snapshot.forEach(function(childSnapshot){
							var key = childSnapshot.key;
							var time = parseFloat(childSnapshot.val()["_Time"]);
							highlight_list.push({"key":key, "time":time})
						})
						highlight_list.sort(function(a,b){
							return((a.time<b.time)?-1:((a.time==b.time)?0:1))
						})
						console.log(highlight_list)
						generateHighlightedText();

				}
				else{
					// window.location = "otherHighlights.html"
					console.log("no highlight")
				}
			})
		}
		else{
			//Leave this process
			window.location = "./finalize.html#"+location.hash.split("#")[1];
		}
	})

	$("#nextMicroNote-btn").click(function(){
		var micronote = $('#interpretation').val();
		var highlight_text = $('.highlight-text').text().replace(/[\t\n]+/g,' ');

		if(micronote!=''){
			firebase.database().ref(fire_route+'/micronote/'+target_key).set({
				"_Caption": highlight_text, 
				"_MicroNote": micronote,
				"_Time":target_time
			})
		}
		else{
			firebase.database().ref(fire_route+'/micronote/'+target_key).set({
				"_Caption": highlight_text, 
				"_MicroNote": micronote,
				"_Time":target_time
			})
		}
		console.log("next");
		if(!generateHighlightedText()){
			window.location = "./finalize.html#"+location.hash.split("#")[1];
		}
	})
})
function generateHighlightedText(){
		if(highlight_list.length>0){
			//Get target highlight key from array
			target_key = highlight_list[0]["key"];
			target_time = highlight_list[0]["time"];

			//Delete highlight from firebase and array
			// firebase.database().ref(fire_route+'/highlight/'+target_key).remove()
			highlight_list.shift();

			var obj = document.getElementById("highlighted-text-container")
			obj.innerHTML = caption;
			$(obj).find('.highlight-notes').remove();
			$(obj).find('.highlight-question').remove();
			$(obj).find('.highlight-text').each(function(idex){
				var key = $(this).attr('key')
				if(key!=target_key){
					//remove other highlights except for target highlight
					$(obj).find("div[key='"+key+"']").replaceWith(function(){
						return $(this).html()
					})
					$(obj).find('.navigator').remove()
				}
			})
	
			var container = $("#highlighted-text-container");
			$(container).animate({
				scrollTop: $("div[key='"+target_key+"']").offset().top - $(container).offset().top + $(container).scrollTop() - 200
			})
			//Prepare for user Input
			$('#interpretation').val("");

			return true;
		}
		else{
			return false;
		}
}