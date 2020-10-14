'use strict';
// step 13: join user
function JoinUser(){
	// step 13.1:
	var page;
	var url=global_url+'join/';
	var html;
	
	// step 13.4:
	function readData(){
		modul.innerHTML='Join Folder';	
		metode.innerHTML='Read Data';	
		app.innerHTML=pleaseWait();
		msg.innerHTML='';
		btn.style.display='none';
		const obj= {"login_blok":login_blok};
		if (page===undefined){
			loadXHR(url+"read_paging.php",obj,readShow);
		}
		else{
			loadXHR(page,obj,readShow);
		}
	}
	
	// step 13.5:
	function readShow(paket){
		html='<p>Total: '+paket.count+' rows</p>'

		html+=paging(paket);	

		html+='<table border=1>'
			+'<th>No.</th>'
			+'<th>Invite Created</th>'
			+'<th>User Request</th>'
			+'<th>Company Name</th>'
			+'<th>Your Response</th>'
			+'<th colspan=3>Action</th>';

		if (paket.err===0){
			for (var x in paket.data) {
				html+='<tr>'
					+'<td>'+paket.data[x].nomer+'</td>'
					+'<td>'+paket.data[x].date_created+'</td>'
					+'<td>'+paket.data[x].admin_name+'</td>'
					+'<td>'+paket.data[x].company_name+'</td>'
					+'<td>'+paket.data[x].invite_resp+'</td>';
				if (paket.data[x].invite_resp=='JOIN'){
					html+='<td>'+paket.data[x].invite_resp+'</td>';
				}else{
					html+='<td><button type="button" id="btn_yes" onclick="objModul.joinFolder(\''+paket.data[x].invite_blok+'\');">Join</button></td>';
				}
				html+='<td><button type="button" id="btn_no" onclick="objModul.leaveFolder(\''+paket.data[x].invite_blok+'\');">Leave</button></td>'
					+'<td><button type="button" id="btn_open" onclick="objModul.openFolder(\''+paket.data[x].invite_blok+'\');"></button></td>'
					+'</tr>';
			}
		}
		html+='</table>';
		app.innerHTML=html;	
	}

	// step 13.6:
	function joinFolder(blok_id){
		msg.innerHTML=pleaseWait();
		const obj = {
			"login_blok":login_blok,
			"invite_blok":blok_id
		};
		loadXHR(url+"create.php",obj,joinMessage); 
	}
	
	// step 13.7:
	function joinMessage(paket){
		if (paket.err==0){
			document.getElementById("btn_yes").disabled=true;
		}
		msg.innerHTML=paket.msg;
	}
	
	// step 13.8:
	function leaveFolder(blok_id){
		msg.innerHTML=pleaseWait();
		const obj = {
			"login_blok":login_blok,
			"invite_blok":blok_id
		};
		loadXHR(url+"delete.php",obj,leaveMessage); 
	}

	// step 13.9:
	function leaveMessage(paket){
		if (paket.err==0){
			location.reload(); //kembali ke master	
		}else{
			msg.innerHTML=paket.msg;			
		}
	}
	
	// step 13.10:
	function openFolder(blok_id){
		msg.innerHTML=pleaseWait();
		var obj={
			"login_blok":login_blok,
			"join_blok":blok_id
		};
		//loadXHR(global_url+"login/create_join.php",obj,openMessage); 
		loadXHR(url+"login.php",obj,openMessage); 
	}
	
	// step 13.11:
	function openMessage(paket){
		if (paket.err==0){
			login_blok=paket.data.login_blok;
			sessionStorage.setItem("login_blok", paket.data.login_blok);
			load_modul('company_profile');
		}
		else{
			msg.innerHTML=paket.msg;			
		}
	}

	// step 13.12: initialize
	readData();

	// to public
	this.joinFolder=function(blok_id){
		joinFolder(blok_id);
	};
	
	this.leaveFolder=function(blok_id){
		leaveFolder(blok_id)
	};
	
	this.openFolder=function(blok_id){
		openFolder(blok_id);
	};
}
