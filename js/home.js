'use strict';
// step 4: home-menu
function Home(){
	// step 4.1: 
	var html;
	var url=global_url+'menu/';
	var url2=global_url+'company_profile/';
	
	// step 4.4:
	function readData(){
		msg.innerHTML=pleaseWait();
		var obj = {"login_blok":login_blok};
		loadXHR(url+'read.php',obj,readShow); 
	}
	
	// step 4.5:
	function readShow(paket){
		list_menu=paket;
		msg.innerHTML='';
		var html='';
		var x;
		if (paket.err==0){
			var sudah;
			// html+='<button type="button" onclick="load_modul(\'home\');">Home</button>';
			for (x in paket.data){
				if (sudah!=paket.data[x].menu_code){
					if (paket.data[x].menu_parent=='home'){
						if (paket.data[x].company_blok!=''){
							if (paket.data[x].menu_code=='folder'){
								html+='<button type="button" id="folder" onclick="objHome.subMenuOpen(\'company\')">'+ikon(paket.data[x].company_name)+'</button>';
							}
							else{
								html+='<button type="button" onclick="objHome.subMenuOpen(\''+paket.data[x].menu_code+'\')">'+ikon(paket.data[x].menu_name)+'</button>';
							}
						}
						else{
							html+='<button type="button" onclick="objHome.subMenuOpen(\''+paket.data[x].menu_code+'\')">'+ikon(paket.data[x].menu_name)+'</button>';
						}
					}
				}				
				sudah=paket.data[x].menu_code;
			}

			if (paket.data[x].company_blok!=''){
				if (login_blok_master===null){
					html+='<button type="button" onclick="objHome.closeFolder()">'+ikon("Close Folder")+'</button>';
				}
			}
			
			// user			
			goto_modul (modul_aktif);
		}
		else{
			msg.innerHTML=paket.msg;
			if (modul_aktif==='logout'){
				goto_modul (modul_aktif);	
			}
		}
		html+='<button type="button" onclick="load_modul(\'logout\')">'+ikon('Logout')+data_login.data[0].user_name+'</button>';
		menu.innerHTML = html;
	}
	
	// step 4.6:
	function subMenuOpen(menu_code){
		var x;
		var sudah;
		var tipe;
		var html;
		html='<button onclick="objHome.subMenuClose();">'+ikon("Tutup")+'</button>'
		for (x in list_menu.data){
			if (list_menu.data[x].menu_parent==menu_code){
				if (sudah!=list_menu.data[x].menu_group){
					html+='<h2 id="sub_menu_modul">'+list_menu.data[x].menu_group+'</h2>';
				}
				if (tipe!=list_menu.data[x].menu_type){
					html+='<h3>'+list_menu.data[x].menu_type+'</h3>&nbsp;&nbsp;';
				}else{
					// nothing
				}
				html+='<button onclick="load_modul(\''+list_menu.data[x].menu_code+'\')">'+list_menu.data[x].menu_name+'</button>';
				sudah=list_menu.data[x].menu_group;
				tipe=list_menu.data[x].menu_type;
			}
		}
		
		sub_menu.innerHTML = html;	
		sub_menu.style.display='block';
	}
	
	// step 4.7:
	function subMenuClose(){
		sub_menu.style.display='none';
	}

	// step 4.8: load_modul
	
	// step 4.9:
	function closeFolder(){
		msg.innerHTML=pleaseWait();
		const obj={"login_blok":login_blok};
		loadXHR(url2+"close.php",obj,closeShow); 		
	}
	
	// step 4.10:
	function closeShow(paket){
		if (paket.err==0) {
			load_modul('company');
		}else{
			msg.innerHTML=paket.msg;	
		}	
	}		
	
	// step 4.11: initilize
	readData();
	
	// global
	this.subMenuOpen=function(kode){
		subMenuOpen(kode);
	};
	
	this.subMenuClose=function(){
		subMenuClose();
	};
	
	this.closeFolder=function(){
		closeFolder();
	};
}

// home: page pertama setelah login
function Homepage(){
	function init(){
		modul.innerHTML='Homepage';
		metode.innerHTML='';
		btn.style.display='none';
		app.style.display='none';
	}
	init();
}
