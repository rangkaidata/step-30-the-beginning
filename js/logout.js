'use strict';
// step 3: logout
function Logout(){
	// step 3.1
	var html;
	
	// step 3.3:
	function init(){
		var paket=data_login;
		var btn_logout;
		btn.style.display='none';
		if (login_blok_master===null){
			btn_logout='<button onclick="objModul.logoutCreate();">'+ikon('Exit')+'Log out</button>';
			modul.innerHTML='Home Folder';
			metode.innerHTML='User Login';
			msg.innerHTML='Klik tombol logout untuk keluar';
		}
		else{
			btn_logout='<button onclick="objModul.switchCreate();">'+ikon('Exit')+'Switch to my home</button>';
			modul.innerHTML='Folder '+paket.data[0].company_name ;
			metode.innerHTML='Join/share folder';
			msg.innerHTML='Klik tombol switch to my home,<br>untuk kembali ke folder home pribadi.';
		}
		
		var company_name;
		
		company_name=paket.data[0].company_name;
		if (paket.data[0].company_name===''){
			company_name='[...Pilih menu: Folder/Company/Open...]';
		}
		
		html='<hr><ul>'
			+'<li><label>Login Date</label>: '+tglBlok(login_blok)+'</li>'
			+'<li><label>User Name</label>: '+paket.data[0].user_name+'</li>'
			+'<li><label>Full Name</label>: '+paket.data[0].user_fullname+'</li>'
			+'<li><label>Company Name</label>: '+company_name+'</li>'
			+'<li><label>Owner/Home</label>: '+paket.data[0].admin_name+'</li>'
			+'<li><label>Login Blok (ID)</label>: '+blokID(login_blok)+'</li>'
			+'</ul>';
			
		html+=btn_logout;
		app.innerHTML=html;
		// +'<li><label>User Blok (ID)</label>: '+blokID(paket.data[0].user_blok)+'</li>'
	}
	
	// step 3.4:
	function logoutCreate(){
		msg.innerHTML=pleaseWait();
		var obj={"login_blok":login_blok}
		loadXHR(global_url+'logout/create.php',obj,logoutMessage);
		
		// step 3.5:
		function logoutMessage(paket){
			if (paket.err===0){
				sessionStorage.removeItem('login_blok');
				location.reload();
			}
			else{
				msg.innerHTML=paket.msg;
			}
		}
	}

	// step 3.6:
	function switchCreate(){
		msg.innerHTML=pleaseWait();
		sessionStorage.setItem("login_blok",login_blok_master);
		var obj={"login_blok":login_blok};
		loadXHR(global_url+'logout/create.php',obj,switchMessage);

		// step 3.7:
		function switchMessage(paket){
			if (paket.err == 0){
				load_modul('logout');
				// location.reload(); //kembali ke master	
			}
			else{
				msg.innerHTML = paket.msg;	
			}
		}
	}
	
	// step 3.8:
	init();
	
	this.logoutCreate=function(){
		logoutCreate();
	};
	
	this.switchCreate=function(){
		switchCreate();
	};


}
