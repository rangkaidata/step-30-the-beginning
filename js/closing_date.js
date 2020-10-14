'use strict';
// step 15:
function ClosingDate(){
	// step 15.1:
	var html;
	var page;
	var url=global_url+'closing_date/';
	
	// step 15.2:
	function readData(){
		modul.innerHTML='Closing Date';	
		metode.innerHTML='Read Data';	
		msg.innerHTML='';	
		html='<button type="button" id="btn_create" onclick="objModul.createData();"></button>';
		btn.innerHTML=html;	

		const obj= {"login_blok":login_blok};
		if (page==null){
			loadXHR(url+"read_paging.php",obj,readShow);
		}
		else{
			loadXHR(page,obj,readShow);
		}
	}
	
	// step 15.3:
	function readShow(paket){
		html ='<p>Total: '+paket.count+' rows</p>';			
		html+=paging(paket);
		html+='<table border=1>'
			+'<th>No.</th>'
			+'<th>Date</th>'
			+'<th>User Name</th>'
			+'<th>Date Created</th>'
			+'<th>Action</th>';
			
		var tipe='';
		if (paket.err===0){
			for (var x in paket.data) {
				
				html+='<tr>'
					+'<td>'+paket.data[x].nomer+'</td>'
					+'<td>'+paket.data[x].close_date+'</td>'
				
					+'<td>'+paket.data[x].user_name+'</td>'
					+'<td>'+tglIna(paket.data[x].date_created)+'</td>'
					+'<td><button type="button" id="btn_delete" onclick="objModul.deleteData(\''+paket.data[x].close_blok+'\');"></button></td>'
					+'</tr>';
			}
		}
		html+='</table>'
			+'<p><i>&#10020 Closing date berfungsi untuk mengunci semua akses transaksi berdasarkan tanggal.</i></p>';
		app.innerHTML=html;	
	}
	
	// step 15.4:
	function createData(){
		metode.innerHTML='Create Data';	
		msg.innerHTML='';
		html='<button type="button" id="btn_back" onclick="objModul.readData();"></button>'
			+'<button type="button" id="btn_save" onclick="objModul.createExecute();"></button>';
		btn.innerHTML=html;	
		
		formulir();
	}
	
	// step 15.5:
	function formulir(){
		html='<form autocomplete="off">'
			+'<ul>'
			+'<li><label for="account_id">Close Date</label>: '
				+'<input type="date" id="close_date"></li>'
			+'</form>'
			+'<p><i>&#10020 Closing date berfungsi untuk mengunci semua akses transaksi berdasarkan tanggal.</i></p>';
		app.innerHTML=html;	
		document.getElementById('close_date').focus()
		document.getElementById('close_date').value=tglSekarang();
	}
	
	// step 15.6:
	function createExecute(){
		const obj={
			"login_blok":login_blok
			,"close_date":document.getElementById("close_date").value
		}
		loadXHR(url+"create.php",obj,createMessage);

		function createMessage(paket){
			if (paket.err===0){			
				document.getElementById("btn_save").style.display="none";
			}
			msg.innerHTML=paket.msg;
		}				
	}
	
	// step 15.7:
	function deleteData(blok_id){
		metode.innerHTML='Delete Data';	
		html='<button type="button" id="btn_back" onclick="objModul.readData();"></button>'
			+'<button type="button" id="btn_continue" onclick="objModul.deleteExecute(\''+blok_id+'\');"></button>';
		btn.innerHTML=html;	
		msg.innerHTML='';
		
		readOneData(blok_id);
	}
	
	// step 15.8:
	function readOneData(blok_id){
		formulir();
		
		const obj={
			"login_blok":login_blok,
			"close_blok":blok_id
		};
		loadXHR(url+"read_one.php",obj,readOneShow); 

		function readOneShow(paket){
			if (paket.err==0) {
				document.getElementById('close_date').value=paket.data[0].close_date;
			}else{
				msg.innerHTML=paket.msg;
			}
		}
	}
	
	// step 15.9:
	function deleteExecute(blok_id){
		const obj = {
			"login_blok":login_blok,
			"close_blok":blok_id
		};			
		loadXHR(url+"delete.php",obj,deleteMessage); 

		function deleteMessage(paket){
			if (paket.err===0){			
				document.getElementById("btn_continue").disabled=true;
			}
			msg.innerHTML=paket.msg;
		}
	}

	// step 15.10:
	readData();
	
	this.readData=function(){
		readData();
	}
	
	this.createData=function(){
		createData();
	}
	
	this.createExecute=function(){
		createExecute();
	}
	
	this.deleteData=function(blok_id){
		deleteData(blok_id);
	}
	
	this.deleteExecute=function(blok_id){
		deleteExecute(blok_id);
	}

}
