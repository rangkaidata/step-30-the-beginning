'use strict';
// step-5: user profile
function UserProfile(){
	// step 5.1:
	var html;
	var url=global_url+'login/';
	var url2=global_url+'user_profile/';
	var data_login;
	
	
	// step 5.2:
	function readData(){
		modul.innerHTML='User Profile';
		metode.innerHTML='Read Data';
		msg.innerHTML='';
		btn.innerHTML='<button type="button" id="btn_change" onclick="objModul.updateData()"></button>';
		app.innerHTML='Please wait...';
		let obj= {"login_blok":login_blok};		
		loadXHR(url+"read.php",obj,readShow);
	}

	// step 5.3: loginMessage();
	function readShow(paket){
		data_login=paket;
		var html;
		if (paket.err==0){
			html='<ul>'
				+'<li><label>User Blok (ID)</label>: '+blokID(paket.data[0].user_blok)+'</li>'
				+'<li><label>User Name</label>: '+paket.data[0].user_name+'</li>'
				+'<li><label>Full Name</label>: '+paket.data[0].user_fullname+'</li>'
				+'<li><label>Email Address</label>: '+paket.data[0].email_address+'</li>'
				+'<li><label>Mobile Number</label>: '+paket.data[0].mobile_number+'</li>'
				+'<li><label>Quota</label>: '+paket.data[0].quota_tx+'</li>'
				+'<li><label>Used</label>: '+paket.data[0].used_tx+'</li>'
				+'<li>'
				+'<p><img id="folder_image" width="200" height="200"/ src='+global_url_image+"/uploads/no_image.jpg"+'></p>'
				+'<input type="text" id="name_image" value="no_image.jpg" disabled class="b-text" hidden>' 
				+'</li>'
				+'</ul>';
			app.innerHTML = html;	
			
			document.getElementById("folder_image").src=global_url_image+"uploads/"+paket.data[0].user_photo;
			document.getElementById("name_image").value=paket.data[0].user_photo;
		}
	}
	// step 5.4:
	function updateData(){
		metode.innerHTML='Update Data';
		var html;
		var stark=data_login;
		if (data_login.err==0){
			html='<form autocomplete="off">'
				+'<span style="display:inline-block;">'
				+'<ul>'
				+'<li><label>Full Name</label>: <input type="text" id="user_fullname" value="'+stark.data[0].user_fullname+'"></li>'
				+'<li><label>Email Address</label>: <input type="text" id="email_address" value="'+stark.data[0].email_address+'"></li>'
				+'<li><label>Mobile Number</label>: <input type="text" id="mobile_number" value="'+stark.data[0].mobile_number+'"></li>'
				+'<li><label>Current Password</label>: <input type="password" id="old_password"></li>'
				+'<li><label>New Password</label>: <input type="password" id="new_password"></li>'
				+'<li><label>Retype Password</label>: <input type="password" id="retype_password"></li>'
				+'</ul>'
				+'</span>'
				
				+'<span style="display:inline-block;">'
				+'<input type="file" name="fileToUpload" id="fileToUpload" accept="image/*" onchange="loadFile(event)">'
				+'<br><button type="button" onclick="noImage()">No image</button>' 
				+'<p><img id="folder_image" width="150" height="150"/ src='+global_url_image+"/uploads/no_image.jpg"+'></p>'
				+'<input type="text" id="name_image" value="no_image.jpg" disabled class="b-text" hidden>' 
				+'</span>'
				+'</form>'
				+'<p><i>&#10020 Alamat email diperlukan untuk mengirim kode reset password.</i></p>';

			app.innerHTML = html;	
			document.getElementById("user_fullname").focus();
			document.getElementById("folder_image").src = global_url_image+"uploads/"+stark.data[0].user_photo;
			document.getElementById("name_image").value = stark.data[0].user_photo;

		}
		
		html='<button type="button" id="btn_back" onclick="objModul.readData()"></button>'
			+'<button type="button" id="btn_save" onclick="objModul.updateExecute()"></button>';
		btn.innerHTML=html;
	}
	
	// step 5.5:
	function updateExecute(){
		msg.innerHTML=pleaseWait();
		var obj = {
			"login_blok":login_blok,
			"old_password":document.getElementById("old_password").value,
			"new_password":document.getElementById("new_password").value,
			"retype_password":document.getElementById("retype_password").value,
			"user_fullname":document.getElementById("user_fullname").value,
			"email_address":document.getElementById("email_address").value,
			"mobile_number":document.getElementById("mobile_number").value,
			"user_photo":document.getElementById("fileToUpload").value,
			"name_image":document.getElementById("name_image").value
		}
		loadXHR(url2+"update.php",obj,updateMessage); 
	}

	// step 5.6:
	function updateMessage(paket){
		if (paket.err===0){			
			document.getElementById("btn_save").style.display="none";
			uploadImageChange(paket);
		}
		msg.innerHTML=paket.msg;
	}
	
	// step 5.7:
	readData();
	
	// publish private to public
	this.updateData=function(){
		updateData();
	};
	
	this.readData=function(){
		readData();
	};
	
	this.updateExecute=function(){
		updateExecute();
	};
}
