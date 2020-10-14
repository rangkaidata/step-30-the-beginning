'use strict';
// step 8: default
function Default(){
	// step 8.1:
	var html;
	var url=global_url+'default/';
	var default_row;
	
	// step 8.4:
	function readData(){
		modul.innerHTML='Default';
		metode.innerHTML='Update Data';
		msg.innerHTML=pleaseWait();
		btn.innerHTML='<button type="button" id="btn_save" onclick="objModul.updateData();"></button>';
		
		var obj= {"login_blok":login_blok};		
		loadXHR(url+"read.php",obj,readShow);
	}
	
	// step 8.5:
	function readShow(stark){
		msg.innerHTML='';
		formulir();
		if (stark.err==0){
			default_row.value=stark.data[0].default_row;
		}
		else{
			msg.innerHTML = stark.msg;
		}
	}
	
	// step 8.6:
	function formulir(){
		html='<form autocomplete="off">'
			+'<ul>'
			+'<li><label>Row per page</label>: <input type ="text" id="default_row" value=10 onfocus="this.select();"></li>'
			+'<li><label>Timeout Login</label>: <input type ="text" id="timeout_login" value=1> Hour</li>'
			+'</ul>'
			+'</form>';		
		app.innerHTML=html;		
		default_row=document.getElementById("default_row");
		default_row.focus();
	}
	
	// step 8.7:
	function updateData(){
		msg.innerHTML=pleaseWait();
		const obj = {
			"login_blok":login_blok,
			"default_row":default_row.value
		};
		loadXHR(url+"update.php",obj,updateMessage); 
	}
	
	// step 8.8:
	function updateMessage(paket){
		msg.innerHTML=paket.msg;
		if (paket.err==0){
			document.getElementById("btn_save").disabled=true;
		}
	}
	
	// step 8.9:
	readData();
	
	// publish private function to public function
	// step 8.10
	this.updateData=function(){
		updateData();
	};
	
}
