'use strict';
// step 12:
function ManageUser(){
	// step 12.1:
	var html;
	var url=global_url+'invite/';
	var page=null;
	var data_user;
	var user_access;
	
	// step 12.2: loginRead
	// step 12.3: loginMessage
	
	// step 12.4:
	function readData(){
		modul.innerHTML='Manage Users';	
		metode.innerHTML='Read Data';	
		app.innerHTML=pleaseWait();
		msg.innerHTML='';
			html='<button type="button" id="btn_plus" onclick="objModul.createData();">Invite User</button>'
				+'<button type="button" id="btn_search" onclick="objModul.searchData(\'\');"></button>';
		btn.innerHTML=html;	
		
		const obj= {"login_blok":login_blok};
		if (page==null){
			loadXHR(url+"read_paging.php",obj,readShow);
		}
		else{
			loadXHR(page,obj,readShow);
		}
	}
	
	// step 12.5:
	function readShow(paket){
		data_user=paket;
		html='<p>Total: '+paket.count+' records</p>';
		
		html+=paging(paket);	

		html+='<table border=1>'
			+'<tr>'
			+'<th>No.</th>'
			+'<th>User Name</th>'
			+'<th>Response</th>'
			+'<th>Company Name</th>'
			+'<th>Date Created</th>'
			+'<th colspan=2>Action</th>'
			+'</tr>';			
			
		if (paket.err===0){
			for (var x in paket.data) {
				html+='<tr>'
					+'<td>'+paket.data[x].nomer+'</td>'
					+'<td>'+paket.data[x].user_name+'</td>';
				if (paket.data[x].invite_resp){
				}
				
				html+='<td><b>'+paket.data[x].invite_resp+'</b></td>'
					+'<td>'+paket.data[x].company_name+'</td>'
					+'<td>'+tglIna(paket.data[x].date_created)+'</td>'
					+'<td><button type="button" id="btn_key" onclick="objModul.accessData(\''+paket.data[x].invite_blok+'\');">Access</button></td>'
					+'<td><button type="button" id="btn_delete" onclick="objModul.deleteData(\''+paket.data[x].invite_blok+'\');"></button></td>'
					+'</tr>';
			}
		}

		html+='</table><br>'
			+'<ul><li><b>Status Response:</b></li>'
			+'<li>1) <b>Waiting ...</b> menunggu konfirmasi/respon dari user.</li>'
			+'<li>2) <b>JOIN</b>. yaitu sudah gabung dalam anggota.</li>'
			+'<li>3) <b>LEAVE</b>. yaitu sudah keluar dari anggota.</li>'
			+'</ul>';
		app.innerHTML=html;	
	}
	
	// step 12.6:
	function createData(){
		metode.innerHTML='Invite User';
		html='<button type="button" id="btn_back" onclick="objModul.readData();"></button>'
			+'<button type="button" id="btn_send" onclick="objModul.createExecute();"></button>'
			+'<button type="button" id="btn_new" onclick="objModul.createData();" style="display:none"></button>';
		btn.innerHTML=html;	
		msg.innerHTML='';

		html='<ul>'
			+'<li><label for="account_id">User Name:</label>'
			+'<input type="text" id="user_name"></li>'
			+'</ul>'
			+'<br>'
			+'<p><i>&#10020 User name yang akan diundang(invite) harus sudah register di menu Login/Buat akun baru.</i></p>';
		app.innerHTML=html;
		document.getElementById('user_name').focus();
	}
	
	// step 12.7:
	function createExecute(){
		msg.innerHTML=pleaseWait();
		const obj = {
			"login_blok":login_blok, 
			"user_name":document.getElementById('user_name').value
		};
		loadXHR(url+"create.php",obj,createMessage); 
	}
	
	// step 12.8:
	function createMessage(paket){
		if (paket.err==0){
			document.getElementById("btn_send").style.display ='none';
			document.getElementById("btn_new").style.display = 'inline';
		}else{
			document.getElementById('user_name').focus();
		}
		msg.innerHTML=paket.msg;
	}
	
	// step 12.9:
	function readOneData(blok_id){
		app.innerHTML=pleaseWait();
		const obj={
			"login_blok":login_blok,
			"invite_blok":blok_id
		};
		loadXHR(url+"read_one.php",obj,readOneShow); 
	}
	
	// step 12.10:
	function readOneShow(paket){
		if (paket.err==0) {
			html='<ul>'
				+'<li><label>User Name</label>: '+paket.data[0].user_name+'</li>'
				+'<li><label>Company Name</label>: '+paket.data[0].company_name+'</li>'
				+'<li><label>Date Create</label>: '+paket.data[0].date_created+'</li>'
				+'</ul>'
				+'<div id="user_access"></div>'
			app.innerHTML=html;	
			
			user_access=document.getElementById('user_access');
			accessReadData(paket.data[0].invite_blok);
			
		}else{
			msg.innerHTML=paket.msg;
		}
	}
	
	// step 12.11:
	function deleteData(blok_id){
		app.innerHTML=pleaseWait();
		metode.innerHTML='Delete Data';
		msg.innerHTML='';
		html='<button type="button" id="btn_back" onclick="objModul.readData();"></button>'
			+'<button type="button" id="btn_continue" onclick="objModul.deleteExecute(\''+blok_id+'\');"></button>';
		btn.innerHTML=html;

		readOneData(blok_id);
	}
	
	// step 12.12:
	function deleteExecute(blok_id){
		msg.innerHTML=pleaseWait();
		const obj = {
			"login_blok":login_blok,
			"invite_blok":blok_id
		};
		loadXHR(url+"delete.php",obj,deleteMessage); 			

	}

	// step 12.13:
	function deleteMessage(paket){
		if (paket.err==0){
			document.getElementById("btn_continue").disabled=true;
		}
		msg.innerHTML=paket.msg;
	}
	
	// step 12.14:
	function searchData(txt){
		metode.innerHTML='Search Data';
		msg.innerHTML='';
		
		html ='<button type="button" id="btn_back" onclick="objModul.readData();"></button>';
		btn.innerHTML=html;
		
		html ='<input type="text" value="'+txt+'" id="txt_search" placeholder="Type text to search ..." onfocus="this.select();">'
			+'<button type="button" id="btn_search" onclick="objModul.searchExecute();"></button>';
		app.innerHTML=html;
		document.getElementById('txt_search').focus();
	}

	// step 12.15:
	function searchExecute(){
		metode.innerHTML='Search Result';
		const txt=document.getElementById('txt_search').value;
		html ='<button type="button" id="btn_back" onclick="objModul.searchData(\''+txt+'\');"></button>';
		btn.innerHTML=html;
		app.innerHTML=pleaseWait();

		const obj={
			"login_blok":login_blok,
			"search":txt}
		loadXHR(url+"search.php",obj,readShow);
	}
	
	// step 12.16:
	function accessData(blok_id){
		modul.innerHTML='User Access';
		metode.innerHTML='Read Data';
		html='<button type="button" id="btn_back" onclick="objModul.readData();"></button>'
			+'<button type="button" id="btn_save" onclick="objModul.accessCreateData(\''+blok_id+'\');"></button>';
		btn.innerHTML=html;	

		readOneData(blok_id);
		//accessReadData(blok_id);
	}

	// step 12.17:
	function accessReadData(blok_id){
		user_access.innerHTML=pleaseWait();
		const obj={
			"login_blok":login_blok,
			"invite_blok":blok_id
		};
		loadXHR(global_url+"access/read.php",obj,readShow);
		
		// step 12.18
		function readShow(paket){
			var txt='';
			if (paket.err==0) {
				html='<table border=1>'
					+'<th>GROUP</th>'
					+'<th>MENU</th>'
					+'<th>ACCESS</th>';
				for (var x in paket.data) {
					html+='<tr>'
						+'<td>'+paket.data[x].menu_group+'</td>'
						+"<td><input type='text' name='menuName' value='"+paket.data[x].menu_code+"' hidden>"+paket.data[x].menu_name+"</td>";
					if (paket.data[x].menu_code=='folder'){
						html+= "<td><input type='hidden' name='menuAccess' value='folder:1'></td>";
					}else if(paket.data[x].menu_code=='company'){
						html+= "<td><input type='hidden' name='menuAccess' value='company:1'></td>";
					}else{
						html+= "<td><select name='menuAccess'>";
						
						if (paket.data[x].menu_access==0){
							html+=terPilih(paket.data[x].menu_code, paket.data[x].menu_access, paket.data[x].menu_selected);
							
						}else if (paket.data[x].menu_access==1){
							html+=terPilih(paket.data[x].menu_code, "0", paket.data[x].menu_selected)
								+terPilih(paket.data[x].menu_code, "1", paket.data[x].menu_selected);
							
						}else if (paket.data[x].menu_access==2){
							html+=terPilih(paket.data[x].menu_code, "0", paket.data[x].menu_selected)
								+terPilih(paket.data[x].menu_code, "1", paket.data[x].menu_selected)
								+terPilih(paket.data[x].menu_code, "2", paket.data[x].menu_selected);
							
						}else if (paket.data[x].menu_access==3){					
							html+= terPilih(paket.data[x].menu_code,"0", paket.data[x].menu_selected)
								+terPilih(paket.data[x].menu_code,"1", paket.data[x].menu_selected)
								+terPilih(paket.data[x].menu_code,"2", paket.data[x].menu_selected)
								+terPilih(paket.data[x].menu_code,"3", paket.data[x].menu_selected);

						}else if (paket.data[x].menu_access==4){					
							html+=terPilih(paket.data[x].menu_code,"0", paket.data[x].menu_selected)
								+terPilih(paket.data[x].menu_code,"1", paket.data[x].menu_selected)
								+terPilih(paket.data[x].menu_code,"2", paket.data[x].menu_selected)
								+terPilih(paket.data[x].menu_code,"3", paket.data[x].menu_selected)
								+terPilih(paket.data[x].menu_code,"4", paket.data[x].menu_selected);
						
						}else if (paket.data[x].menu_access==5){					
							html+=terPilih(paket.data[x].menu_code,"0", paket.data[x].menu_selected)
								+terPilih(paket.data[x].menu_code,"1", paket.data[x].menu_selected)
								+terPilih(paket.data[x].menu_code,"2", paket.data[x].menu_selected)
								+terPilih(paket.data[x].menu_code,"3", paket.data[x].menu_selected)
								+terPilih(paket.data[x].menu_code,"4", paket.data[x].menu_selected)
								+terPilih(paket.data[x].menu_code,"5", paket.data[x].menu_selected);
						}
						html+= '</select></td>';
					}
					html+='</tr>';
				}
				html+='</table>';
			}
			else{
				html=paket.msg;
			}
			document.getElementById("user_access").innerHTML=html;
		}	
	}
	
	// step 12.19:
	function terPilih(menuNama,menuAccess,menuSelected){
		var str = "<option value='ok' selected>budi</option>";
		var strMenu;
		switch(menuAccess){
			case 0: // tidak punya access apa-apa.
				strMenu = "No Access"; 
				break;			
			case "1": // can read = hanya bisa membaca, tidak bisa tulis, hapus atau update
				strMenu = "Can Read";
				break;
			case "2": // can create= bisa tulis
				strMenu = "Can Create";
				break;
			case "3": // can edit= bisa baca, bisa tulis, bisa update, bisa delete
				strMenu = "Can Edit";
				break;
			case "4": // can export= bisa baca, bisa tulis, bisa update, bisa delete, bisa export
				strMenu = "Can Export";
				break;
			default:
				strMenu = "No Access";
			
		}
		if (menuAccess==menuSelected){
			str = "<option value='" + menuNama +":"+ menuAccess +"' selected>"+ strMenu +"</option>";	
		}else {
			str = "<option value='" + menuNama +":"+ menuAccess +"'>"+ strMenu +"</option>";	
		}
		return str;
	}
	
	// step 12.20
	function accessCreateData(blok_id){
		var elem = document.getElementsByName("menuAccess");
		var names = [];
		var str='';
		var abc='';
		
		for (let i = 0; i < elem.length; ++i) {
			str=elem[i].value;
			abc=str.split(":");
			// bila 0, tidak perlu disimpan
			if (parseInt(abc[1])!=0){
				names.push(elem[i].value);
			}
		}

		var menuJSON = {};
		menuJSON["login_blok"]=login_blok;
		menuJSON["invite_blok"]=blok_id;
		menuJSON["menu"]=names;

		var data=JSON.stringify(menuJSON);
		loadXHR(global_url+"access/create.php",menuJSON,createDataMessage); 
		
		// step 12.21:
		function createDataMessage(paket){
			document.getElementById("btn_save").disabled=true;
			msg.innerHTML=paket.msg;
		}
	}
	
	// step 12.22
	readData();
	
	this.readData=function(){
		readData();
	};
	
	this.createData=function(){
		createData();
	};
	
	this.createExecute=function(){
		createExecute();
	};
	
	this.accessData=function(blok_id){
		accessData(blok_id);
	};
	
	this.deleteData=function(blok_id){
		deleteData(blok_id);
	};
	
	this.deleteExecute=function(blok_id){
		deleteExecute(blok_id);
	};
	
	this.accessCreateData=function(blok_id){
		accessCreateData(blok_id);
	};
	
	this.searchData=function(txt){
		searchData(txt);
	};
	
	this.searchExecute=function(){
		searchExecute();
	};
}
