'use strict';
// step 11: account
function Accounts(){
	// step 11.01:
	var html;
	var page;
	var url=global_url+'account/';
	var url2=global_url+'backup/';

	// import data
	var oAct=[];
	var dataImport;

	
	// step 11.04:
	function readData(){
		modul.innerHTML='Accounts';	
		metode.innerHTML='Read Data';	
		app.innerHTML=pleaseWait();
		msg.innerHTML='';
		html='<button type="button" id="btn_create" onclick="objModul.createData();"></button>'
			+'<button type="button" id="btn_search" onclick="objModul.searchData(\'\');"></button>'
			+'<button type="button" id="btn_import" onclick="objModul.importData();"></button>'
			+'<button type="button" id="btn_export" onclick="objModul.exportData();"></button>';

		btn.innerHTML=html;	

		const obj= {"login_blok":login_blok,"kolom":0};
		if (page===undefined){
			loadXHR(url+"read_paging.php",obj,readShow);
		}
		else{
			loadXHR(page,obj,readShow);
		}
	}
	
	// step 11.05:
	function readShow(paket){		
		html ='<p>Total: '+paket.count+' rows</p>';

		html+=paging(paket);

		html+='<table border=1>'
			+'<tr>'
			+'<th>No.</th>'
			+'<th>Account<br>ID</th>'
			+'<th>Account<br>Name</th>'
			+'<th>Account<br>Class</th>'
			+'<th>Balances</th>'
			+'<th>User<br>Name</th>'
			+'<th>Date<br>Created</th>'
			+'<th colspan=2>Action</th>'
			+'</tr>';			
		var tipe='';
		var balance;
		if (paket.err===0){
			for (var x in paket.data) {
				html+='<tr>'
					+'<td>'+paket.data[x].nomer+'</td>'
					+'<td>'+paket.data[x].account_id+'</td>'
					+'<td>'+paket.data[x].account_name+'</td>'
					+'<td>'+paket.data[x].account_class+'</td>'
					+'<td style="text-align:right;">'+formatSerebuan(paket.data[x].account_balance)+'</td>'
					+'<td>'+paket.data[x].user_name+'</td>'
					+'<td>'+tglIna(paket.data[x].date_created)+'</td>'
					+'<td><button type="button" id="btn_change" onclick="objModul.updateData(\''+paket.data[x].account_blok+'\');"></button></td>'
					+'<td><button type="button" id="btn_delete" onclick="objModul.deleteData(\''+paket.data[x].account_blok+'\');"></button></td>'
					+'</tr>';
			}
		}
		html+='</table>';
		app.innerHTML=html;	
	}
	
	// step 11.06:
	function formulir(){
		html='<form autocomplete="off">'
			+'<ul>'
			+'<li><label for="account_id">Account ID</label>: '
				+'<input type="text" id="account_id" disabled></li>'
			+'<li><label for="account_name">Account Name</label>: '
				+'<input type="text" id="account_name" disabled></li>'
			+'<li><label  for="account_class">Account Class</label>: '
				+'<select id="account_class" disabled>'
				+'<option>Asset</option>'
				+'<option>Liability</option>'
				+'<option>Equity</option>'
				+'<option>Income</option>'
				+'<option>Cost of Sales</option>'
				+'<option>Expense</option>'
				+'<option>Other Income</option>'
				+'<option>Other Expense</option>'
				+'</select></li>'
			+'<li id="li_debit" style="display:none;"><label for="account_debit">Debit</label>: '
			+'<input type="text" id="account_debit" onfocus="this.select();" disabled></li>'
            +'<li id="li_credit" style="display:none;"><label for="account_credit">Credit</label>: '
			+'<input type="text" id="account_credit" onfocus="this.select();" disabled></li>'
			+'<li id="li_open" style="display:none;"><label for="account_opening">Opening</label>: '
			+'<span id="account_opening">0.00</span></li>'
			+'<li id="li_balance" style="display:none;"><label id="account_balance_lbl" for="account_balance">Account Balance</label>: '
			+'<span id="account_balance">0.00</span></li>'
			+'</ul>'
			+'</form>';
		app.innerHTML=html;	
		
		if (metode.innerHTML==='Create Data'){
			document.getElementById('account_id').disabled=false;
			document.getElementById('account_name').disabled=false;
			document.getElementById('account_class').disabled=false;
			document.getElementById('account_credit').disabled=false;
			document.getElementById('account_debit').disabled=false;
			document.getElementById('account_id').focus();
			document.getElementById('li_debit').style.display="block";
			document.getElementById('li_credit').style.display="block";
		}
		if (metode.innerHTML==='Update Data'){
			document.getElementById('account_name').disabled=false;
			document.getElementById('account_name').focus();
			document.getElementById('account_debit').disabled=false;
			document.getElementById('account_credit').disabled=false;
			document.getElementById('li_balance').style.display="block";
		}
		if (metode.innerHTML==='Delete Data'){
			document.getElementById('li_balance').style.display="block";
		}
		
	}

	// step 11.07:
	function createData(){
		metode.innerHTML='Create Data';	
		msg.innerHTML='';
		html='<button type="button" id="btn_back" onclick="objModul.readData(\'0\');"></button>'
			+'<button type="button" id="btn_save" onclick="objModul.createExecute();"></button>'
			+'<button type="button" id="btn_new" onclick="objModul.createData();" style="display:none;"></button>'
		btn.innerHTML=html;	
		
		formulir();
	}
	
	// step 11.08:
	function createExecute(){
		msg.innerHTML=pleaseWait();
		const obj={
			"login_blok":login_blok
			,"account_id":document.getElementById("account_id").value
			,"account_name":document.getElementById("account_name").value
			,"account_class":document.getElementById("account_class").value
			,"account_debit":document.getElementById("account_debit").value
			,"account_credit":document.getElementById("account_credit").value
		}
		loadXHR(url+"create.php",obj,createMessage);

		function createMessage(paket){
			if (paket.err===0){			
				document.getElementById("btn_save").style.display="none";
				document.getElementById("btn_new").style.display="inline";
			}
			msg.innerHTML=paket.msg;
		}				
	}
	
	// step 11.09:
	function readOneData(blok_id){
		app.innerHTML=pleaseWait();
		const obj={
			"login_blok":login_blok,
			"account_blok":blok_id
		};
		loadXHR(url+"read_one.php",obj,readOneShow); 
	}

	// step 11.10:
	function readOneShow(paket){
		formulir();
		if (paket.err==0) {
			document.getElementById('account_id').value=paket.data[0].account_id;
			document.getElementById('account_name').value=paket.data[0].account_name;
			document.getElementById('account_class').value=paket.data[0].account_class;
			document.getElementById('account_debit').value=paket.data[0].account_debit;	
			document.getElementById('account_credit').value=paket.data[0].account_credit;	
			document.getElementById('account_opening').innerHTML=formatSerebuan(paket.data[0].account_opening);				
			document.getElementById('account_balance').innerHTML=formatSerebuan(paket.data[0].account_balance);				
		}else{
			msg.innerHTML=paket.msg;
		}
	}	

	// step 11.11:
	function deleteData(blok_id){
		metode.innerHTML='Delete Data';	
		html='<button type="button" id="btn_back" onclick="objModul.readData(\'0\');"></button>'
			+'<button type="button" id="btn_continue" onclick="objModul.deleteExecute(\''+blok_id+'\');"></button>';
		btn.innerHTML=html;	
		msg.innerHTML='';
		
		readOneData(blok_id);
	}	

	// step 11.12:
	function deleteExecute(blok_id){
		msg.innerHTML=pleaseWait();
		const obj = {
			"login_blok":login_blok,
			"account_blok":blok_id
		};			
		loadXHR(url+"delete.php",obj,deleteMessage); 
	}
	
	// step 11.13:
	function deleteMessage(paket){
		if (paket.err===0){			
			document.getElementById("btn_continue").disabled=true;
		}
		msg.innerHTML=paket.msg;
	}
	
	// step 11.14:
	function updateData(blok_id){
		metode.innerHTML='Update Data';	
		msg.innerHTML='';
		app.innerHTML=pleaseWait();
		html='<button type="button" id="btn_back" onclick="objModul.readData(\'0\');"></button>'
			+'<button type="button" id="btn_save" onclick="objModul.updateExecute(\''+blok_id+'\');"></button>';
		btn.innerHTML=html;	
		
		readOneData(blok_id);
	}
	
	// step 11.15:
	function updateExecute(blok_id){
		msg.innerHTML=pleaseWait();
		const obj = {
			"login_blok":login_blok,
			"account_blok":blok_id,
			"account_name":document.getElementById("account_name").value
		};
		loadXHR(url+"update.php",obj,updateMessage);
	}
	
	// step 11.16:
	function updateMessage(paket){
		if (paket.err===0){			
			document.getElementById("btn_save").disabled=true;
		}
		msg.innerHTML=paket.msg;			
	}
	
	// step 11.17:
	function searchData(txt){
		metode.innerHTML='Search Data';
		msg.innerHTML='';
		
		html='<button type="button" id="btn_back" onclick="objModul.readData(\'0\');"></button>';
		btn.innerHTML=html;
		
		html='<input type="text" value="'+txt+'" id="txt_search" placeholder="Type text to search ..." onfocus="this.select();">'
			+'<button type="button" id="btn_search" onclick="objModul.searchExecute();"></button>';
		app.innerHTML=html;
		document.getElementById('txt_search').focus();
	}
	
	// step 11.18:
	function searchExecute(){
		metode.innerHTML='Search Result';
		const txt=document.getElementById('txt_search').value;
		
		html ='<button type="button" id="btn_back" onclick="objModul.searchData(\''+txt+'\');"></button>';
		btn.innerHTML=html;

		const obj={
			"login_blok":login_blok,
			"search":txt}
		loadXHR(url+"search.php",obj,readShow);
	}

	// step 11.19:
	function gotoPage(ini){
		page=ini;
		readData(0);
	}

	
	// step 11.20:	
	// readData();
	
	// step 11.21:
	function importData(){
		// jangan lupa ini
		// field delimiter - , ; : {tab} {space} -
		// string delimiter- ' " -

		metode.innerHTML='Import Data';
		html='<button type="button" id="btn_back" onclick="objModul.readData();"></button>';
		btn.innerHTML=html;	

		html='<p id="exportTable" style="display:none">'
			+'account id,account name,account class,account debit,account_credit'
			+'</p>'
			+stepImport('accounts',objModul.bacaData);
		app.innerHTML=html;
	}
	
	// step 11.22:
	function bacaData(isi){
		var b = isi;
		var c = b.split(/\n/);
		var baris=c.length;
		var delim=',';
		var d,e;

		var total_kolom;
		var kolom,isidata;
		var r,z;
		var baris_ke=[];
		var data=[];
		var arr={}
		var jumlah=0;
		
		d=c[0];
		e=d.split(delim);
		jumlah=e.length;
		
		for (var x=1;x<baris;x++){ 
			d = c[x];
			e=d.split(delim);			
			total_kolom=e.length;
			
			if (e.length>=jumlah){
				z=0;
				baris_ke=[];
				for (r=0;r<total_kolom;r++){
					
					isidata=e[r];

					if (isidata.substring(0,1)=='"'){
						var s=r+1;
						for (var y=s;y<e.length;y++){
							r++;
							d = e[y];
							isidata+=d;
							if (d.substring(d.length,d.length-1)=='"'){
								break;
							}
							if (d.search('"')>=0){
								break;
							}
						}

						isidata=isidata.replace('"','');
						isidata=isidata.replace('"','');
					}
					if (isidata===undefined){isidata='';}
					baris_ke[z]=isidata;
					z++;
				}
				
				/*--- masukkna ke object ---*/
				arr={}
				arr.account_id=baris_ke[0];
				arr.account_name=baris_ke[1];
				arr.account_class=baris_ke[2];
				arr.account_debit=baris_ke[3];
				arr.account_credit=baris_ke[4];

				data.push(arr);
			}
		}
		
		dataImport=data;
		
		html='<button id="btn_import_all" onclick="objModul.importExecute();">Import Data</button>'
			+'<p id="msgImport"></p><br>';

		html+='<table>'
			+'<th>Account ID</th>'
			+'<th>Account Name</th>'
			+'<th>Account Class</th>'
			+'<th>Account Debit</th>'
			+'<th>Account Credit</th>'
			;

		for (var z=0;z<data.length;z++){
			html+='<tr>'
				+'<td>'+data[z].account_id+'</td>'
				+'<td>'+data[z].account_name+'</td>'
				+'<td>'+data[z].account_class+'</td>'
				+'<td>'+formatSerebuan(data[z].account_debit)+'</td>'
				+'<td>'+formatSerebuan(data[z].account_credit)+'</td>'
				+'<tr>';
		}
		html+='</table>';
		document.getElementById('hasil').innerHTML=html;	
	}
	
	
	// step 11.23:
	function importExecute(){
		var oNomer=0;
		var oMsg='';
		var obj;
		var jumlahData=dataImport.length;
		
		for (var i=0;i<dataImport.length;i++){
			obj = {
				"login_blok":login_blok,
				"account_id":dataImport[i].account_id,
				"account_name":dataImport[i].account_name,
				"account_class":dataImport[i].account_class,
				"account_debit":dataImport[i].account_debit,
				"account_credit":dataImport[i].account_credit
			}
			loadXHR(url+"create.php",obj,importShow); 
		}
		function importShow(paket){
			if (paket.err!=0){
				//alert(pesan.modul+": "+pesan.msg);
			}
			oNomer++;
			oMsg+='['+oNomer+'] '+paket.msg+'<br>';
			html="<h4>Message Proccess:</h4>"+oMsg;
			if (oNomer===jumlahData){
				document.getElementById("msgImport").innerHTML=html+'<h4>End Proccess.</h4>';
			}
			else{
				document.getElementById("msgImport").innerHTML=html+'<h4>Please wait ... ['+oNomer+'/'+jumlahData+']</h4>';
			}
		}
	}

	// step 11.24:
	function exportData(){
		html='<button type="button" id="btn_back" onclick="objModul.readData(\'0\');"></button>';
		btn.innerHTML =html;	
		metode.innerHTML='Export Data';
		app.innerHTML=pleaseWait()+'<br>'+'Mohon tunggu hingga tombol download tampil dilayar.';

		const obj = {"login_blok":login_blok};
		loadXHR(url2+"accounts.php",obj,exportShow5); 	
		
		function exportShow5(paket){
			if (paket.err===0){
				var namafile='account_list.csv';
				var dataDenganKoma=arrayToComma2(paket.data);
				// var dataDenganKoma=arrayToPHP(paket.data);
				// alert(dataDenganKoma);
				html='Silakan klik tombol berikut untuk mengunduh file backup.<br>'
					+'<button type="button" onclick="downloadFile(\''+namafile+'\',\''+encodeURIComponent(dataDenganKoma)+'\')">Download</button>';
				app.innerHTML=html;
			}
			else{
				msg.innerHTML=paket.msg;
			}
		}
	}
	
	// publish private to public
	this.gotoPage=function(ini){
		page=ini;
		readData();
	};
	
	this.createData=function(){
		createData();
	};
	
	this.createExecute=function(){
		createExecute();
	};
	
	this.readData=function(){
		readData();
	};
	
	this.deleteData=function(blok_id){
		deleteData(blok_id);
	};
	
	this.deleteExecute=function(blok_id){
		deleteExecute(blok_id);
	};
	
	this.updateData=function(blok_id){
		updateData(blok_id);
	};
	
	this.updateExecute=function(blok_id){
		updateExecute(blok_id);
	};
	
	this.searchData=function(txt){
		searchData(txt);
	};
	
	this.searchExecute=function(){
		searchExecute();
	}
	
	this.readOneData=function(blok_id){
		readOneData(blok_id);
	};
	
	this.importData=function(){
		importData();
	};
	
	this.bacaData=function(thor){
		bacaData(thor);
	};
	
	this.importExecute=function(){
		importExecute();
	};
	
	this.exportData=function(){
		exportData();
	};
}

