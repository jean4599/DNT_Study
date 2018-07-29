const course = 'psychology';
const fire_route = course+'/'+location.hash.split("#")[1];

var simplemde = new SimpleMDE({ element: document.getElementById("note"), spellChecker:false });
simplemde.toggleSideBySide();
var text_value = "# Introduction to Social Psychology: Nonverbal and verbal channels\n";
// simplemde.value();

note_list = []
firebase.database().ref(fire_route+'/micronote').once("value").then(function(snapshot){
	if(snapshot.val()!=null){
		snapshot.forEach(function(childSnapshot){
			// var key = childSnapshot.key;
			// var time = parseFloat(childSnapshot.val()["_Time"]);
			var val = childSnapshot.val();
			val["_Type"] = "MicroNote";
			note_list.push(val)
		})
	}
	firebase.database().ref(fire_route+'/notes').once("value").then(function(snapshot){
		if(snapshot.val()!=null){
			snapshot.forEach(function(childSnapshot){
				var val = childSnapshot.val();
				val["_Type"] = "Comment";
				note_list.push(val)
			})
		}
		firebase.database().ref(fire_route+'/question').once("value").then(function(snapshot){
			if(snapshot.val()!=null){
				snapshot.forEach(function(childSnapshot){
					var val = childSnapshot.val();
					val["_Type"] = "Question";
					note_list.push(val)
				})
			}
			note_list.sort(function(a,b){
				var t_a = parseFloat(a["_Time"]);
				var t_b = parseFloat(b["_Time"]);
				return((t_a>t_b)?-1:((t_a==t_b)?0:1))
			})
			console.log(note_list)

			for (var i = note_list.length - 1; i >= 0; i--) {
				if(note_list[i]["_Type"]=="MicroNote"){
					if(note_list[i]["_MicroNote"]!=""){
						text_value+=("- "+note_list[i]["_MicroNote"]+'\n')
					}
					else{
						text_value+=("- "+note_list[i]["_Caption"]+'\n')
					}
				}
				else if(note_list[i]["_Type"]=="Comment"){
					text_value+=("- "+note_list[i]["_Caption"]+': **'+note_list[i]["_Content"]+'**\n')
				}
				else if(note_list[i]["_Type"]=="Question"){
					text_value+=("- "+note_list[i]["_Caption"]+': **'+note_list[i]["_Content"]+'**\n')
				}
			}
			simplemde.value(text_value);
		})
	})
})