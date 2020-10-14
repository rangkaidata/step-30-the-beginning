'use strict';

// step 29
function Forgot(){
	// step 29.1:
	var html;
	var url=global_url+'reset/';
	var user_name,user_email;
	
	// step 29.2:
	function formulir(){
		menu.style.display='none';
		metode.style.display='none';
		
		menu.style.display='none';
		// btn.style.display='none';
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
		
		modul.innerHTML='&#128230; Password Reset';
		modul.style.textAlign="center";
		
		html='<ul>'
		+'<li>'
		+'&#128100; <label for="user_name">User Name:</label>'
		+'<input type="text" id="user_name">'
		+'</li>'
		+'<li>'
		+'&#128291; <label for="user_email">Email:</label>'
		+'<input type="text" id="user_email">'
		+'</li>'
		+'<li><button type="button" id="button_register" onclick="objModul.createData();">Submit</button></li>'
		+'<li>Tidak jadi reset? <button type="button_login" onclick="load_modul(\'login\');">Log in</button></li>'
		+'</ul>'
		+'</form>';
		
		app.innerHTML=html;
		
		user_name=document.getElementById("user_name");
		user_email=document.getElementById("user_email");
		
		// step 1.2:
		user_name.focus();
	}
	
	function createData(){
		btn.innerHTML='<button type="button_login" onclick="load_modul(\'forgot\');">Back</button>';
		app.innerHTML=pleaseWait();
		const obj = {
			"user_name":user_name.value,
			"user_email":user_email.value
		};

		loadXHR(url+'create.php',obj,createShow);
	}
	
	function createShow(paket){
		if (paket.err===0){
			html='<button type="button_login" onclick="load_modul(\'login\');">Login</button>';
			btn.innerHTML=html;

			html='Permintaan reset password berhasil dikirim ke server.<br>'
				+'Server akan mengirim balik kode reset ke alamat email Anda.<br>'
				+'Mungkin bisa memakan waktu 1x24 jam.'
				+'Cek email Anda setiap saat.<p>Terima Kasih.</p>'
		}
		else{
			html='<button type="button_login" onclick="load_modul(\'forgot\');">Back</button>';
			btn.innerHTML=html;
			html='Alamat email tidak ditemukan.'
		}
		app.innerHTML=html;
	}

	formulir();
	
	this.createData=function(){
		createData();
	}

}
