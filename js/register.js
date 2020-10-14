'use strict';
// step 1: register
function Register(){
	// step 1.1:
	var html;
	var url=global_url+'register/';
	
	// step 0: HTML
	function formulir(){
		menu.style.display='none';
		metode.style.display='none';
		
		menu.style.display='none';
		btn.style.display='none';
		metode.style.display='none';
		sub_menu.style.display='none';
		
		/* --- app screen --- */
		main.style.width='550px';
		main.style.display='block';
		main.style.margin='0 auto';
		main.style.border='1px solid lightgrey';
		main.style.borderRadius='10px';
		main.style.padding='20px';
		main.style.marginTop='10px';
		main.style.boxShadow='0 4px 8px 0 rgba(0,0,0,0.2),0 6px 20px 0 rgba(0,0,0,0.19)';
		
		modul.innerHTML='&#128230; Register Akun Baru';
		modul.style.textAlign="center";
		
		html='<ul>'
		+'<li>'
		+'&#128100; <label for="user_name">User Name:</label>'
		+'<input type="text" id="user_name">'
		+'</li>'
		+'<li>'
		+'&#128101; <label for="user_fullname">Full Name:</label>'
		+'<input type="text" id="user_fullname">'
		+'</li>'
		+'<li>'
		+'&#128273; <label for="user_password">Password:</label>'
		+'<input type="password" id="user_password">'
		+'</li>'
		+'<li>'
		+'&#128271; <label for="confirm_password">Confirm Password:</label>'
		+'<input type="password" id="confirm_password">'
		+'</li>'
		+'<li>'
		+'&#128291; <label for="passcode_image">Passcode:</label>'
		+'<img src="'+global_url_passcode+'" id="passcode_image" border=1>'
		+'</li>'
		+'<li>	'
		+'&#128290; <label for="user_passcode">Retype Passcode:</label>'
		+'<input type="text" id="user_passcode">'
		+'</li>'
		+'<li><button type="button" id="button_register" onclick="objModul.createData();">&#128209; Register</button></li>'
		+'<li>Sudah punya Akun? <button type="button_login" onclick="load_modul(\'login\');">Log in</button></li>'
		+'</ul>'
		+'</form>';
		
		app.innerHTML=html;
		
		html='<button id="button_register" onclick="objModul.createData();">Submit</button>'
			+'<button id="button_login" onclick="load_modul(\'login\');">Log in</button>'
		//btn.innerHTML=html;
		
		var user_name=document.getElementById("user_name");
		var user_fullname=document.getElementById("user_fullname");
		var user_password=document.getElementById("user_password");
		var confirm_password=document.getElementById("confirm_password");
		var passcode_image=document.getElementById("passcode_image");
		var user_passcode=document.getElementById("user_passcode");
		
		// step 1.2:
		user_name.focus();
	}
	
	// step 1.3:
	function createData(){
		if (button_register.innerHTML == "Reset"){
			location.replace(location.href);
		}
		msg.innerHTML=pleaseWait();
		const obj = {
			"home_folder":null,
			"user_name":user_name.value,
			"user_fullname":user_fullname.value,
			"user_password":user_password.value,
			"confirm_password":confirm_password.value,
			"user_passcode":user_passcode.value
		};

		loadXHR(url+'create.php',obj,createShow);
	}

	// step 1.4:
	function createShow(paket){
		if (paket.err==0){
			button_register.innerHTML = "Reset";
		}
		msg.innerHTML =paket.msg;
	}
	
	// step 1.5:
	formulir();
	
	this.createData=function (){
		createData();
	};
	
}
