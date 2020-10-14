// app 15: desain web
'use strict';


function loadFile(event){
	var output = document.getElementById('folder_image');
	output.src = URL.createObjectURL(event.target.files[0]);
	document.getElementById('name_image').value=event.target.files[0].name;
}

function noImage(){
	document.getElementById('folder_image').src=global_url_image+"/uploads/no_image.jpg";
	document.getElementById('name_image').value="no_image.jpg";
	document.getElementById('fileToUpload').value="";
}

function uploadImageChange(data){
	if (document.getElementById("fileToUpload").value!=""){
		var blok_image = data.data.blok;
		var photo = document.getElementById("fileToUpload").files[0];
		var req = new XMLHttpRequest();
		var formData = new FormData();

		formData.append("fileToUpload", photo);
		formData.append("blok", data.data.blok);
		
		req.open("POST", global_url_image+"upload.php");
		req.send(formData);

		req.onreadystatechange = function() {
			//var 
			if (this.readyState == 4){
				var bola=JSON.parse(req.responseText);
				if (bola.blok==blok_image){
					// alert('sukses upload image');
				}
				else{
					msg.innerHTML=bola.blok;
				}
			}
			else{
				//msg.innerHTML=bola.blok;
			}
		};
	}
}
