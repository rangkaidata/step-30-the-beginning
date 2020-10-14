'use strict';
// step 6
function Notes(){
	// step 6.1:
	var html;
	var page=null;
	var url=global_url+'notes/';
	
	// step 6.2:loginRead();
	// step 6.3:loginMessage();
	// step 6.4:
	function readData(){
		modul.innerHTML='Notes';	
		metode.innerHTML='Read Data';	
		msg.innerHTML='Please wait ...';
		html='<button type="button" id="btn_create" onclick="objModul.createData();"></button>'
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
	
	// step 6.5:
	function readShow(paket){
		var x;
		msg.innerHTML='';
		html ='<p>Total: '+paket.count+' rows</p>'
		
		html+=paging(paket);	

		html+='<table border=1>'
			+'<tr>'
			+'<th>No.</th>'
			+'<th>Title</th>'
			+'<th>Content</th>'
			+'<th>Date Created</th>'
			+'<th colspan=2>Action</th>'
			+'</tr>';
			
		if (paket.err===0){
			for (x in paket.data) {
				html+='<tr>'
					+'<td>'+paket.data[x].nomer+'</td>'
					+'<td>'+paket.data[x].note_title+'</td>'
					+'<td>'+paket.data[x].note_content+'</td>'				
					+'<td>'+tglIna(paket.data[x].date_created)+'</td>'
					+'<td><button type="button" id="btn_change" onclick="objModul.editData(\''+paket.data[x].note_blok+'\');"></button></td>'
					+'</tr>';
			}
		}
		html+='</table>';
		app.innerHTML=html;	
	}
	
	// step 6.6:	
	function createData(){
		metode.innerHTML='Create Data';	
		msg.innerHTML='';
		html='<button type="button" id="btn_back" onclick="objModul.readData();"></button>'
			+'<button type="button" id="btn_save" onclick="objModul.createExecute();"></button>'
			+'<button type="button" id="btn_new" onclick="objModul.createData();" style="display:none;"></button>'
		btn.innerHTML=html;	
		
		formulir();
	}
	
	// step 6.7:
	function formulir(){
		html='<form autocomplete="off">'
			+'<ul>'
			+'<li><label for="note_title">Title:</label>'
				+'<input type="text" id="note_title"></li>'
			+'<li><label for="note_content">Content:</label>'
				+'<textarea id="note_content" cols=100 rows=10></textarea></li>'
			+'</form>';
		app.innerHTML=html;	
		document.getElementById('note_title').focus()
	}
	
	// step 6.8
	function createExecute(){
		msg.innerHTML=pleaseWait();
		const obj={
			"login_blok":login_blok
			,"note_title":document.getElementById("note_title").value
			,"note_content":document.getElementById("note_content").value
		}
		loadXHR(url+"create.php",obj,createMessage);

	}
	
	// step 6.9
	function createMessage(paket){
		if (paket.err===0){			
			document.getElementById("btn_save").style.display="none";
			document.getElementById("btn_new").style.display="inline";
		}
		msg.innerHTML=paket.msg;
	}			
	
	// step 6.10
	function editData(blok_id){
		metode.innerHTML='Edit Data';	
		html='<button type="button" id="btn_back" onclick="objModul.readData();"></button>'
			+'<button type="button" id="btn_save" onclick="objModul.updateExecute(\''+blok_id+'\');"></button>'
			+'<button type="button" id="btn_delete" onclick="objModul.deleteExecute(\''+blok_id+'\');"></button>';
		btn.innerHTML=html;	
		msg.innerHTML='';
		
		readOneData(blok_id);
	}
	
	// step 6.11
	function readOneData(blok_id){
		app.innerHTML=pleaseWait();
		const obj={
			"login_blok":login_blok,
			"note_blok":blok_id
		};
		loadXHR(url+"read_one.php",obj,readOneShow); 
	}
	
	// step 6.12
	function readOneShow(paket){
		formulir();
		if (paket.err==0) {
			document.getElementById('note_title').value=paket.data[0].note_title;
			document.getElementById('note_content').value=paket.data[0].note_content;
		}else{
			msg.innerHTML=paket.msg;
		}
	}
	
	// step 6.13
	function deleteExecute(blok_id){
		msg.innerHTML=pleaseWait();
		const obj = {
			"login_blok":login_blok
			,"note_blok":blok_id
		};			
		loadXHR(url+"delete.php",obj,deleteMessage); 
	}
	
	// step 6.14
	function deleteMessage(paket){
		if (paket.err===0){
			readData();
		}else{
			msg.innerHTML=paket.msg;
		}
	}
	
	// step 6.15
	function updateExecute(blok_id){
		const obj = {
			"login_blok":login_blok
			,"note_blok":blok_id
			,"note_title":document.getElementById("note_title").value
			,"note_content":document.getElementById("note_content").value
		};
		loadXHR(url+"update.php",obj,updateMessage);
	}

	// step 6.16
	function updateMessage(paket){
		if (paket.err===0){			
			readData();
		}else{
			msg.innerHTML=paket.msg;			
		}
	}
	
	// step 6.17
	function searchData(txt){
		metode.innerHTML='Search Data';
		msg.innerHTML='';
		
		html='<button type="button" id="btn_back" onclick="objModul.readData();"></button>';
		btn.innerHTML=html;
		
		html='<input type="text" value="'+txt+'" id="txt_search" placeholder="Type text to search ..." onfocus="this.select();">'
			+'<button type="button" id="btn_search" onclick="objModul.searchExecute();"></button>';
		app.innerHTML=html;
		document.getElementById('txt_search').focus();
	}
	
	// step 6.18
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

	// step 6.19:
	function gotoPage(ini){
		page = ini;
		readData();
	}
	
	// step 6.20:
	readData();
	
	this.readData=function(){
		readData();
	};
	
	this.gotoPage=function(ini){
		gotoPage(ini);
	};
	
	this.createData=function(){
		createData();
	};
	
	this.createExecute=function(){
		createExecute();
	};
	
	this.editData=function(blok_id){
		editData(blok_id);
	};
	
	this.updateExecute=function(blok_id){
		updateExecute(blok_id);
	}
	
	this.deleteExecute=function(blok_id){
		deleteExecute(blok_id);
	};
	
	this.searchData=function(txt){
		searchData(txt);
	};
	
	this.searchExecute=function(){
		searchExecute();
	}
	
}
