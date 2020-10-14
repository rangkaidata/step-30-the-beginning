
'use strict';

function AccountLook(dariModul,cari){
	var html;
	var url=global_url+'account/';
	var metode;
	var page;
	var data;
	var kolom=1;
	
	function readData(){
		popup_modul.innerHTML="Chart of Account";
		popup_metode.innerHTML='Read Data';
		html='<button id="btn_close" onclick="objPop.readDataClose();"></button>'
			+'<button id="btn_search" onclick="objPop.searchData(\'\');"></button>';
		popup_button.innerHTML=html;
		popup_content.innerHTML=pleaseWait();
		
		blank.style.display='block';
		objPop.metode='Read Data';

		const obj = {"login_blok":login_blok,"kolom":kolom};
		if (page==null){
			loadXHR(url+"read_paging.php",obj,readShow); 
		}else{
			loadXHR(page,obj,readShow);
		}
	}

	function readShow(paket){
		/*html='<div id="popup">'
			+'<h3 id="popup_modul">Chart of Accounts</h3>'
			+'<div id="popup_metode"></div>'
			+'<div id="popup_button"></div>'
			+'<div id="popup_content">'*/
		var kol=['Account ID','Account Name','Account Class'];
		var ikon_sort;

		if (kolom<0){
			ikon_sort='&nbsp;&#8593;';
		}else{
			ikon_sort='&nbsp;&#8595;';
		}
		
			
		html ='<p>Total: '+paket.count+' rows</p>';			
		html+=pagingPopup(paket);
		html+='<table border=1 style="padding:10px;">'
		+'<th>No.</th>';
			
		for (var x=0;x<kol.length;x++){
			if (Math.abs(kolom)==(x+1)){
				html+='<th onclick="objPop.urut(this)">'+kol[x]+ikon_sort+'</th>';
			}
			else{
				html+='<th onclick="objPop.urut(this)">'+kol[x]+'</th>';
			}
		}

		html+='<th>Action</th>';

		if (paket.err===0){
			data=paket.data;
			for (var x in paket.data) {
				html+='<tr>'
					+'<td>'+paket.data[x].nomer+'</td>'
					+'<td>'+paket.data[x].account_id+'</td>'
					+'<td>'+paket.data[x].account_name+'</td>'
					+'<td>'+paket.data[x].account_class+'</td>'
					+'<td><button type="button" id="btn_select" onclick="objPop.select(\''+x+'\');"></button></td>'
					+'</tr>';
			}
		}
		else{
			// document.getElementById('msg').innerHTML =paket.msg;	
		}
		html+='</table>'
			+'</div>'
			+'</div>';
		
		/* show it */
		popup_content.innerHTML=html;
		blank.style.display='block';
		
		//attPopup();	
		
		/* --- button --- */
		/*popup_metode=document.getElementById('popup_metode');
		popup_content=document.getElementById('popup_content');
		popup_metode.innerHTML='Read Data';
		popup_button.innerHTML=html;*/

	}
	
	function readDataClose(){
		blank.style.display="none";
	}
	
	function select(a){
		var b=data;	
		if (dariModul=='journal'){
			objModul.selectAccount(b[a]);
		}
		if (dariModul=='general_ledger'){
			objModul.selectAccount(b[a]);
		}
		blank.style.display="none";
	}
	
	function searchData(txt){
		popup_metode.innerHTML='Search Data';
		
		html='<button type="button" id="btn_back" onclick="objPop.readData();"></button>';
		popup_button.innerHTML=html;
		
		html='<input type="text" value="'+txt+'" id="txt_search" placeholder="Type text to search ..." onfocus="this.select();">'
			+'<button type="button" id="btn_search" onclick="objPop.searchExecute();"></button>';
		popup_content.innerHTML=html;
		document.getElementById('txt_search').focus();
	}

	function searchExecute(){
		objPop.metode='Search Data';
		popup_metode.innerHTML='Search Result';
		const txt=document.getElementById('txt_search').value;

		html ='<button type="button" id="btn_back" onclick="objPop.searchData(\''+txt+'\');"></button>';
		popup_button.innerHTML=html;
		popup_content.innerHTML=pleaseWait();
		const obj={
			"login_blok":login_blok,
			"search":txt}
		loadXHR(url+"search.php",obj,readShow);
	}
	
	function urut(apa){
		var kolom_klik=apa.cellIndex
		if (kolom==kolom_klik){
			kolom=kolom_klik*-1
		}
		else{
			kolom=kolom_klik;
		}
		readData(kolom);
	}


	/* --- public function --- */
	this.readData=function(modul,cari){
		readData(modul,cari);
	}

	this.readDataClose=function(){
		readDataClose();
	}

	this.gotoPage=function(ini){
		page=ini;
		readData();
	}

	this.select=function(a){
		select(a);
	}
	
	this.searchData=function(txt){
		searchData(txt);
	}
	
	this.searchExecute=function(){
		searchExecute();
	}
	this.urut=function(apa){
		urut(apa);
	}
}
