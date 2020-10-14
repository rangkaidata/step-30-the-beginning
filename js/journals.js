
'use strict';

// step 17.:
function Journal(login_){
	// step 17.1:
	var html;
	var url=global_url+'journal/';
	var url2=global_url+'backup/';
	var url3=global_url+'upload/';
	var page;
	var kolom=0;
	var isiTabel=[];
	var dataImport;
	
	// step 17.2:
	function readData(){
		modul.innerHTML='Journal Entry';	
		metode.innerHTML='Read Data';	
		html='<button type="button" id="btn_create" onclick="objModul.createData();"></button>'
			+'<button type="button" id="btn_search" onclick="objModul.searchData(\'\');"></button>'
			+'<button type="button" id="btn_import" onclick="objModul.importData();"></button>'
			+'<button type="button" id="btn_export" onclick="objModul.exportData();"></button>';
			
		btn.innerHTML=html;	
		msg.innerHTML='';	
		app.innerHTML=pleaseWait();
		
		const obj= {"login_blok":login_};
		if (page==null){
			loadXHR(url+"read_paging.php",obj,readShow);
		}
		else{
			loadXHR(page,obj,readShow);
		}
	}
	
	// step 17.3:
	function readShow(paket){
		html='<p>Total: '+paket.count+' rows</p>';			
		html+=paging(paket)
			+'<table border=1>'
			+'<th>No.</th>'
			+'<th>Ref.</th>'
			+'<th>Date</th>'
			+'<th>Amount</th>'
			+'<th>Note</th>'
			+'<th>Type</th>'
			+'<th>User Name</th>'
			+'<th>Date Created</th>'
			+'<th colspan=2>Action</th>';

		if (paket.err===0){
			for (var x in paket.data) {
				html+='<tr>'
					+'<td>'+paket.data[x].nomer+'</td>'
					+'<td>'+paket.data[x].journal_no+'</td>'
					+'<td>'+tglIna2(paket.data[x].journal_date)+'</td>'
					+'<td style="text-align:right">'+formatSerebuan(paket.data[x].journal_amount)+'</td>'
					+'<td>'+paket.data[x].journal_note+'</td>'
					+'<td>'+paket.data[x].journal_modul+'</td>'
				
					+'<td>'+paket.data[x].user_name+'</td>'
					+'<td>'+tglIna(paket.data[x].date_created)+'</td>'
					+'<td><button type="button" id="btn_change" onclick="objModul.updateData(\''+paket.data[x].journal_blok+'\');"></button></td>'
					+'<td><button type="button" id="btn_delete" onclick="objModul.deleteData(\''+paket.data[x].journal_blok+'\');"></button></td>'
					+'</tr>';
			}
		}
		else{
			// document.getElementById('msg').innerHTML =paket.msg;	
		}
		html+='</table>';
		app.innerHTML=html;	
	}
	
	// step 17.4:
	function gotoPage(ini){
		page=ini;
		readData(kolom);
	}
	
	/* --- journal step 1: create data --- */
	// step 17.5:
	function createData(){
		metode.innerHTML='Create Data';	
		msg.innerHTML='';
		html='<button type="button" id="btn_back" onclick="objModul.readData(\''+kolom+'\');"></button>'
			+'<button type="button" id="btn_add" onclick="objModul.addRow();"></button>'
			+'<button type="button" id="btn_save" onclick="objModul.createExecute();" style="display:inline"></button>'
			+'<button type="button" id="btn_new" onclick="objModul.createData();" style="display:none"></button>';
		btn.innerHTML=html;	
		
		isiTabel=[]; 
		formulir(); 
		addRow();  
	}
	
	// step 17.6:
	function formulir(){
		html='<form autocomplete="off">'
			+'<ul>'
			+'<li><label for="journal_modul">Type Journal</label>'
			+': <select id="journal_modul">'
			+'<option value="general" selected>General Journal</option>'
			+'<option value="adjusting">Adjusting Journal</option>'
			+'<option value="closing">Closing Journal</option>'
			+'</select>'
			+'</li>'
			+'<li><label for="journal_date">Date</label>'
			+': <input type="date" id="journal_date"></li>'
			+'<li><label for="journal_no">Journal No.</label>'
			+': <input type="text" id="journal_no"></li>'
			+'<li><label for="journal_note">Note </label>'
			+': <textarea id="journal_note" cols=100 rows=5></textarea></li>'
			+'<li>'
			+'<div id="page_detail" style="overflow-y:auto;"></div></li>'
			+'</ul>'
			+'</form>';
		app.innerHTML=html;
		document.getElementById('journal_date').value=tglSekarang();
		
		html=formulirTabelHead()+formulirTabelFoot();
		document.getElementById('page_detail').innerHTML=html;
		document.getElementById('journal_no').focus();
	}
	
	// step 17.7:
	function formulirTabelHead(){
		var htmlHead;
		htmlHead='<table id="myTable" border=0 style="width:100%;" >'
			+'<thead>'
			+'<tr>'
			+'<th style="display:none">account_blok</th>'
			+'<th style="display:none">job_blok</th>'
			+'<th>No.</th>'
			+'<th colspan=2>Account ID</th>'
			+'<th>Account Name</th>'
			+'<th>Debit</th>'
			+'<th>Credit</th>'
			+'<th colspan=2>Job</th>'
			+'<th>Remove</th>'
			+'</tr>'
			+'</thead>';
		return htmlHead;
	}
	
	// step 17.8:
	function formulirTabelFoot(){
		var htmlFoot;
		htmlFoot='<tfoot>'
			+'<tr>'
			+'<td colspan=4 style="text-align:right;">Totals:</td>'
			+'<td style="text-align:right;font-weight:bolder;" id="sum_debit">0.00</td>'
			+'<td style="text-align:right;font-weight:bolder;" id="sum_credit">0.00</td>'
			+'<td colspan=3>&nbsp;</td>'
			+'</tr>'
			+'<tr>'
			+'<td colspan=4 style="text-align:right;">Out of Balance:</td>'
			+'<td style="text-align:right;font-weight:bolder;" id="is_balance">0.00</td>'
			+'<td colspan=4>&nbsp;</td>'
			+'</tr>'
			+'</tfoot>'
			+'</table>';
		return htmlFoot;
	}
	
	// step 17.9:
	function addRow(){
		var myBasket=[];
		var myItem={};
		myBasket=isiTabel;
		
		myItem.number=myBasket.length+1;
		myItem.account_blok="";
		myItem.account_id=""; //myBasket.length;
		myItem.account_name="";
		myItem.journal_debit=0;
		myItem.journal_credit=0;
		myItem.job_blok="";
		myItem.job_id="";
		myBasket.push(myItem);
		
		refreshTable(myBasket);
	}
	
	// step 17.10:
	function refreshTable(isi){
		isiTabel=isi;
		//alert(isi.length);
		var panjang=isi.length;
		var sum_debit=0;
		var sum_credit=0;
		var is_balance=0;
		
		html=formulirTabelHead();
		for (let i=0;i<panjang;i++){
			html+='<tr>'
				+'<td style="display:none"><input type="text" id="account_blok'+i+'" value="'+isi[i].account_blok+'"></td>'
				+'<td style="display:none"><input type="text" id="job_blok'+i+'" value="'+isi[i].job_blok+'"></td>'
				+'<td>'+(i+1)+'</td>'
				+'<td style="margin:0;padding:0"><input type="text" id="account_id'+i+'" value="'+isi[i].account_id+'" size="10" readonly></td>'
				+'<td><button type="button" id="btn_find" onclick="objModul.searchAccount(\''+i+'\');"></button></td>'
				+'<td><input type="text" id="account_name'+i+'" value="'+isi[i].account_name+'" size=25 onchange="objModul.updateArray(\''+i+'\',\'account_name\',this.value)" onfocus="this.select()" ></td>'
				+'<td><input type="text" id="journal_debit'+i+'" value="'+isi[i].journal_debit+'" size=5 style="text-align:right" onchange="objModul.updateArray(\''+i+'\',\'journal_debit\',this.value)"  onfocus="this.select()" ></td>'
				+'<td><input type="text" id="journal_credit'+i+'" value="'+isi[i].journal_credit+'" size=5 style="text-align:right" onchange="objModul.updateArray(\''+i+'\',\'journal_credit\',this.value)"  onfocus="this.select()" ></td>'
				+'<td><input type="text" id="job_id'+i+'" value="'+isi[i].job_id+'" size="1" readonly></td>'
				+'<td style="width:0;"><button type="button" id="btn_find" onclick="objModul.searchJob(\''+i+'\');"></button></td>'
				+'<td><button type="button" id="btn_remove" onclick="objModul.removeRow('+i+')" ></button></td>'
				+'</tr>';
			sum_debit+=parseFloat(isi[i].journal_debit);
			sum_credit+=parseFloat(isi[i].journal_credit);
		}
		html+=formulirTabelFoot();
		var budi = JSON.stringify(isi);
		document.getElementById('page_detail').innerHTML=html;
		document.getElementById('sum_debit').innerHTML=sum_debit;
		document.getElementById('sum_credit').innerHTML=sum_credit;
		document.getElementById('is_balance').innerHTML=sum_debit-sum_credit;
	}
	
	// step 17.11:
	function updateArray(baris,kolom,txt){
		var isi=isiTabel;
		var baru = [];
		var isiEdit = {};
		var sum_debit=0;
		var sum_credit=0;

		for (var i=0;i<isi.length; i++){
			if (i != baris){
				baru.push(isi[i]);
			}else{
				isiEdit = isi[i];
				if (kolom=="account_blok"){
					isiEdit.account_blok=txt;
				}								
				if (kolom=="account_id"){
					isiEdit.account_id=txt;
				}				
				if (kolom=="account_name"){
					isiEdit.account_name=txt;
				}
				if (kolom=="journal_debit"){
					isiEdit.journal_debit=txt;
				}
				if (kolom=="journal_credit"){
					isiEdit.journal_credit=txt;
				}
				baru.push(isiEdit);
			}
			sum_debit+=parseFloat(baru[i].journal_debit);
			sum_credit+=parseFloat(baru[i].journal_credit);
		}
		isiTabel=isi;
		document.getElementById('sum_debit').innerHTML=sum_debit;
		document.getElementById('sum_credit').innerHTML=sum_credit;
		document.getElementById('is_balance').innerHTML=sum_debit-sum_credit;
	}

	// step 17.12:
	function removeRow(number){
		
		refreshTable(isiTabel);

		var myBasket=[];
		var myItem={};
		var pnjng=isiTabel.length;
		
		for(let i=0;i<pnjng;i++){
			if (i==(number)){
			}
			else{
				if (i==0){
					
				}
				myBasket.push(isiTabel[i])
			}
		}
		isiTabel=myBasket;
		refreshTable(isiTabel);

		if (isiTabel.length==0){
			addRow();
		}
	}
	
	// step 17.13:
	function searchAccount(baris){
		const cari=document.getElementById('account_id'+baris).value;
		//alert(baris);
		objPop=new AccountLook('journal',cari);
		objPop.readData();
		objPop.baris=baris;
	}
	
	// step 17.14:
	function selectAccount(data){
		var baris=objPop.baris;
		document.getElementById('account_blok'+baris).value=data.account_blok;
		document.getElementById('account_id'+baris).value=data.account_id;
		document.getElementById('account_name'+baris).value=data.account_name;
		updateDetail();
	}
	
	// step 17.15:
	function updateDetail(){
		// sekalian validasi isi table-DISINI
		var isi = isiTabel;
		var baru = [];
		var isiEdit = {}
		for (var i=0;i<isi.length; i++){
			isiEdit = isi[i];
			isiEdit.account_blok=document.getElementById('account_blok'+i).value;
			isiEdit.account_id=document.getElementById('account_id'+i).value;
			isiEdit.account_name=document.getElementById('account_id'+i).value;
			isiEdit.account_name=document.getElementById('account_name'+i).value;
			isiEdit.journal_debit=document.getElementById('journal_debit'+i).value;
			isiEdit.journal_credit=document.getElementById('journal_credit'+i).value;
			isiEdit.job_blok=document.getElementById('job_blok'+i).value;
			isiEdit.job_id=document.getElementById('job_id'+i).value;
			baru.push(isiEdit);
		}
		refreshTable(baru);
	}
	
	// step 17.16:
	function searchJob(){
	}
	
	// step 17.17:
	function selectJob(){
	}
	
	// step 17.18:
	function createExecute(){
		msg.innerHTML=pleaseWait();
		updateDetail();
		var journal_detail=filterArray();
		const obj={
			"login_blok":login_
			,"journal_modul":document.getElementById("journal_modul").value
			,"journal_no":document.getElementById("journal_no").value
			,"journal_date":document.getElementById("journal_date").value
			,"journal_note":document.getElementById("journal_note").value
			,"journal_detail":journal_detail
		}
		document.getElementById("journal_no").focus();
		loadXHR(url+"create.php",obj,createDataMessage); 
		
		function createDataMessage(paket){
			if (paket.err==0){
				document.getElementById('btn_save').style.display="none";
				document.getElementById('btn_new').style.display="inline";
			}
			msg.innerHTML=paket.msg;
		}	
	}
	
	// step 17.19:
	function filterArray(){
		var isi=isiTabel;
		var baru = []; 
		var isiEdit = {};
		for (let i=0;i<isi.length; i++){
			isiEdit = {};
			isiEdit.number=isi[i].number;
			isiEdit.account_blok=isi[i].account_blok;
			isiEdit.account_name=isi[i].account_name;
			isiEdit.journal_debit=isi[i].journal_debit;
			isiEdit.journal_credit=isi[i].journal_credit;
			isiEdit.job_blok=isi[i].job_blok;
			baru.push(isiEdit);
		}
		return baru;
	}
	
	
	// step 17.20:
	function readOneData(blok_id){
		formulir();
		const obj={
			"login_blok":login_,
			"journal_blok":blok_id
		};
		loadXHR(url+"read_one.php",obj,readOneShow); 
		
		function readOneShow(paket){
			if (paket.err==0) {
				document.getElementById("journal_modul").value = paket.data[0].journal_modul;
				document.getElementById("journal_date").value = paket.data[0].journal_date;
				document.getElementById("journal_no").value = paket.data[0].journal_no;
				document.getElementById("journal_note").value = paket.data[0].journal_note;
				refreshTable(paket.data[0].journal_detail);
			}else{
				msg.innerHTML=paket.msg;
			}
		}
	}

	// step 17.21:
	function deleteData(blok_id){
		metode.innerHTML='Delete Data';	
		html='<button type="button" id="btn_back" onclick="objModul.readData();"></button>'
			+'<button type="button" id="btn_continue" onclick="objModul.deleteExecute(\''+blok_id+'\');"></button>';
		btn.innerHTML=html;	
		msg.innerHTML='';	

		readOneData(blok_id);
	}
	
	// step 17.22:
	function deleteExecute(blok_id){
		msg.innerHTML=pleaseWait();
		const obj = {
			"login_blok":login_,
			"journal_blok":blok_id
		};			
		loadXHR(url+"delete.php",obj,deleteMessage);

		function deleteMessage(paket){
			if (paket.err==0){
				document.getElementById('btn_continue').disabled=true;
			}
			msg.innerHTML=paket.msg;
		} 
	}
	
	// step 17.23:
	function updateData(blok_id){
		metode.innerHTML='Update Data';	
		msg.innerHTML='';	
		html='<button type="button" id="btn_back" onclick="objModul.readData(\''+kolom+'\');"></button>'
		+'<button type="button" id="btn_add" onclick="objModul.addRow();"></button>'
		+'<button type="button" id="btn_save" onclick="objModul.updateExecute(\''+blok_id+'\');"></button>';
		btn.innerHTML=html;				

		readOneData(blok_id);
	}
	
	// step 17.24:
	function updateExecute(blok_id){
		msg.innerHTML=pleaseWait();
		updateDetail();
		var journal_detail=filterArray();
		const obj = {
			"login_blok":login_,
			"journal_blok":blok_id,
			"journal_no":document.getElementById("journal_no").value,
			"journal_date":document.getElementById("journal_date").value,
			"journal_note":document.getElementById("journal_note").value,
			"journal_detail":journal_detail
		};
		loadXHR(url+"update.php",obj,updateShow);

		function updateShow(paket){
			if (paket.err==0){
				document.getElementById('btn_save').disabled=true;
			}
			msg.innerHTML=paket.msg;
		}
	}
	
	// step 17.25:
	function searchData(txt){
		metode.innerHTML='Search Data';
		msg.innerHTML='';
		
		html='<button type="button" id="btn_back" onclick="objModul.readData(\''+kolom+'\');"></button>';
		btn.innerHTML=html;
		
		html='<input type="text" value="'+txt+'" id="txt_search" placeholder="Type text to search ..." onfocus="this.select();">'
		+'<button type="button" id="btn_search" onclick="objModul.searchExecute();"></button>';
		app.innerHTML=html;
		document.getElementById('txt_search').focus();
	}
	
	/* --- account step 12: search start --- */
	// step 17.26:
	function searchExecute(){
		metode.innerHTML='Search Result ...';
		const txt=document.getElementById('txt_search').value;
		
		html ='<button type="button" id="btn_back" onclick="objModul.searchData(\''+txt+'\');"></button>';
		btn.innerHTML=html;

		app.innerHTML=pleaseWait();
		const obj={
			"login_blok":login_blok,
			"search":txt}
		loadXHR(url+"search.php",obj,readShow);
	}
	
	// step 17.27:
	function exportData(){
		html='<button type="button" id="btn_back" onclick="objModul.readData(\''+kolom+'\');"></button>';
		btn.innerHTML =html;	
		metode.innerHTML='Export Data';
		app.innerHTML=pleaseWait()+'<br>'+'Mohon tunggu hingga tombol download tampil dilayar.';


		const obj = {"login_blok":login_blok};
		loadXHR(url2+"journals.php",obj,exportShow2); 			
		
		function exportShow2(paket){
			if (paket.err===0){
				var namafile='journal.csv';
				var dataDenganKoma=arrayToComma2(paket.data);
				//var dataDenganKoma=arrayToPHP(paket.data);

				html='Silakan klik tombol berikut untuk mengunduh file backup.<br>'
					+'<button type="button" onclick="downloadFile(\''+namafile+'\',\''+encodeURIComponent(dataDenganKoma)+'\')">Download</button>';
				app.innerHTML=html;
			}
			else{
				msg.innerHTML=paket.msg;
			}
		}

		function exportShow(paket){
			if (paket.err===0){
				html='<p>Total: '+paket.count+' rows</p>'
					+'<p>Klik link berikut untuk download: <a href="" id="downloadLink" onclick="exportF(this,\'Journals\')">Export Data to CSV</a></p>'
					+'<table border=1 id="exportTable">'
					+'<th>Journal Date</th>'
					+'<th>Journal Ref</th>'
					+'<th>Journal Note</th>'
					+'<th>Journal Amount</th>'
					+'<th>No.</th>'
					+'<th>Account ID</th>'
					+'<th>Account Name</th>'
					+'<th>Debit</th>'
					+'<th>Credit</th>'
					+'<th>Job ID</th>'
					+'<th>User Name</th>'
					+'<th>Date Created</th>';			
					
				for (var x in paket.data) {
					html+='<tr>'
						+'<td>'+paket.data[x].journal_date+'</td>'
						+'<td>'+paket.data[x].journal_no+'</td>'
						+'<td>'+paket.data[x].journal_note+'</td>'
						+'<td>'+paket.data[x].journal_amount+'</td>'
						+'<td>'+paket.data[x].nomer+'</td>'
						+'<td>'+paket.data[x].account_id+'</td>'
						+'<td>'+paket.data[x].account_name+'</td>'
						+'<td>'+paket.data[x].account_debit+'</td>'
						+'<td>'+paket.data[x].account_credit+'</td>'
						+'<td>'+paket.data[x].job_id+'</td>'
						+'<td>'+paket.data[x].user_name+'</td>'
						+'<td>'+paket.data[x].date_created+'</td>'
						+'</tr>';
				}
				html+='</table>';
				app.innerHTML=html;	
			}
			else{
				msg.innerHTML = paket.msg;	
			}
		}
	}
	
	// step 17.28:
	function importData(){
		metode.innerHTML='Import Data';
		html='<button type="button" id="btn_back" onclick="objModul.readData(\''+kolom+'\');"></button>';
		btn.innerHTML=html;	

		html='<p id="exportTable" style="display:none">'
			+'type,date,ref,note,account id,debit,credit,job id</p>'
			+stepImport('journal_entry',objModul.bacaData);
		app.innerHTML=html;
	}

	// step 17.29:
	function bacaData(isi){
		var delim=',';
		var isiData = isi.split(/\n/);
		var jumlahKolom,jumlahKolomFix;
		var jumlahBaris;
		var barisKe;
		var kolomKe;
		var x,y,n;
		var isiKolom
		var isiKolomTmp='';
		var periksaKolom; //kolom diperiksa sebelum diambil.
		var statusQuote=0;
		var isiFix='';
		var baris_ke=[];
		var arr={}
		var data=[];
		var tambahEnter=0;
		
		//mulai baris ke-0 [header]
		barisKe=isiData[0]; 
		kolomKe=barisKe.split(delim);
		jumlahKolom=kolomKe.length;
		jumlahBaris=isiData.length;
		jumlahKolomFix=kolomKe.length;
		
		// mulai baris ke-1 hingga end of file.
		for (x=1;x<jumlahBaris;x++){
			barisKe=isiData[x];
			kolomKe=barisKe.split(delim);
			jumlahKolom=kolomKe.length;

			// mulai kolom ke-0 sd ke-8, 
			// bila kurang dari 8, ambil baris berikutnya.
			if (statusQuote===0){
				isiKolom='';
				n=0;
				baris_ke=[]; // kosongkan array
			}
			// tambah ENTER
			else{
				isiKolomTmp+='\n';
				tambahEnter=1;
			}

			for (y=0;y<jumlahKolom;y++){
				periksaKolom=kolomKe[y];
				
				// buka quote: karena ada quote di awal text
				if (periksaKolom.substring(0,1)=='"'){
					statusQuote=1;
					periksaKolom=periksaKolom.substr(1,periksaKolom.length); //hapus quote diawal
				}

				// tutup quote
				if (periksaKolom.substring(periksaKolom.length,periksaKolom.length-1)=='"'){
					statusQuote=0;
					periksaKolom=periksaKolom.substr(0,periksaKolom.length-1); //hapus quote diakhir
				}

				// fix tutup quote, dan kolom.
				if (statusQuote===0){
					if (isiKolomTmp.length>0){
						// baris penutup
						isiKolom+=isiKolomTmp+kolomKe[y]+' |\n';
						isiFix=isiKolomTmp+periksaKolom;
					}
					// kolom normal
					else{
						isiKolom+=kolomKe[y] +' |\n';
						isiFix=periksaKolom;
					}
					// masukkan ke array;
					baris_ke[n]=isiFix;
					
					isiKolomTmp='';
					n++;
				}

				// quote masih terbuka.
				else{
					if (isiKolomTmp.length>0){
						if (tambahEnter===0){
							isiKolomTmp+=','
						}
					}
					tambahEnter=0;
					
					isiKolomTmp+=periksaKolom;
				}
			}
			if (n===jumlahKolomFix){
				// baris terakhir EOF
				if (barisKe.length===0){
					alert('baris terakhir');
				}
				else{
					arr={}
					arr.journal_modul=baris_ke[0];
					arr.journal_date=baris_ke[1];
					arr.journal_no=baris_ke[2];
					arr.journal_notes=baris_ke[3];
					arr.account_id=baris_ke[4];
					arr.debit=baris_ke[5];
					arr.credit=baris_ke[6];
					arr.job_id=baris_ke[7];

					data.push(arr);
				}
			}
		}

		/* --- kirim ke server--- */
		const obj={
			"login_blok":login_,
			"data":data
		};
		
		loadXHR(url3+'journals.php',obj,testData);
	}
	
	// step 17.30:
	function importExecute(){
		var obj;
		var journal_detail=[];
		var isi_detail={};
		var oMsg='';
		var oNomer=0;
		var paket=dataImport;		
		var totalData=paket.data.length;
		
		for (var x in paket.data) {
			
			journal_detail=[];
			for (var y in paket.data[x].journal_detail)	{
				isi_detail={};
				isi_detail.number= y;
				isi_detail.account_blok=paket.data[x].journal_detail[y].account_blok
				isi_detail.account_id=paket.data[x].journal_detail[y].account_id
				isi_detail.account_name=paket.data[x].journal_detail[y].account_name
				isi_detail.journal_debit=paket.data[x].journal_detail[y].debit
				isi_detail.journal_credit=paket.data[x].journal_detail[y].credit
				isi_detail.job_blok=''; //paket.data[x].journal_detail[y].job_id
				journal_detail.push(isi_detail);
			}
			// execute create
			
			obj={
				"login_blok":login_,
				"journal_modul":paket.data[x].journal_modul,
				"journal_no":paket.data[x].journal_no,
				"journal_date":paket.data[x].journal_date,
				"journal_note":decodeHtml(paket.data[x].journal_notes),
				"journal_detail":journal_detail
			}
			loadXHR(url+"create.php",obj,importDataMessage); 

			function importDataMessage(paket){
				oNomer++;
				oMsg+='['+oNomer+']'+paket.msg+'<br>';
				html="<h4>Message Proccess:</h4>"+oMsg;
				if (oNomer===totalData){
					document.getElementById("msgImport").innerHTML=html+'<h4>End Proccess.</h4>';
				}
				else{
					document.getElementById("msgImport").innerHTML=html+'<h4>Please wait ... ['+oNomer+'/'+totalData+']</h4>';
				}
			}
		}
	}

	//test data
	function testData(paket){
		dataImport=paket;

		if (paket.err==0){
			html='<button id="btn_import_all" onclick="objModul.importExecute();">Import Data</button>'
				+'<p id="msgImport"></p><br>';
			html+='<table>'
				+'<th>type</th>'
				+'<th>ref</th>'
				+'<th>date</th>'
				+'<th>note</th>'
				+'<th>account id</th>'
				+'<th>account name</th>'
				+'<th>debit</th>'
				+'<th>credit</th>'
				+'<th>job id</th>';
			for (var x in paket.data) {
				html+='<tr>'
				html+='<td>'+paket.data[x].journal_modul+'</td>'
					+'<td>'+paket.data[x].journal_no+'</td>'
					+'<td>'+paket.data[x].journal_date+'</td>'
					+'<td>'+paket.data[x].journal_notes+'</td>'
				html+='</tr>';	
				
				for (var y in paket.data[x].journal_detail)	{
					html+='<tr>'
						+'<td style="display:none">'+paket.data[x].journal_detail[y].account_blok+'</td>'
						+'<td colspan=4>&nbsp;</td>'
						+'<td>'+paket.data[x].journal_detail[y].account_id+'</td>'
						+'<td>'+paket.data[x].journal_detail[y].account_name+'</td>'
						+'<td>'+formatSerebuan(paket.data[x].journal_detail[y].debit)+'</td>'
						+'<td>'+formatSerebuan(paket.data[x].journal_detail[y].credit)+'</td>'
						+'<td>'+paket.data[x].journal_detail[y].job_id+'</td>'
						+'</tr>';
				}
				html+='<tr ><td colspan=8  style="height:1px;background-color:grey;margin:0;padding:0;"></td></tr>';
					
			}
			html+='</table>';
		}else{
			
			html='<h2>Proses import gagal: '+paket.msg+'</h2>';
		}
		
		document.getElementById('hasil').innerHTML=html;
		// app.innerHTML=html;
	}

	
	/* --- publish private function ke public : supaya bisa di pakai di halaman utama --- */
	this.readData=function(){
		readData();
	};
	
	this.createData=function(){
		createData();
	};
	
	this.addRow=function(){
		addRow();
	};
	
	this.removeRow=function(event,baris){
		removeRow(event,baris);
	};
	
	this.updateArray=function(baris,kolom,txt){
		updateArray(baris,kolom,txt);
	};
	
	this.searchAccount=function(baris){
		searchAccount(baris);
	};
	
	this.selectAccount=function(data){
		selectAccount(data);
	};
	
	this.createExecute=function(){
		createExecute();
	};

	this.deleteData=function(blok_id){
		deleteData(blok_id);
	};

	this.deleteExecute=function(blok_id){
		deleteExecute(blok_id)
	};

	this.updateData=function(blok_id){
		updateData(blok_id);
	};

	this.updateExecute=function(blok_id){
		updateExecute(blok_id);
	};
	
	this.searchData=function(t){
		searchData(t);
	};
	
	this.searchExecute=function(){
		searchExecute();
	};
	
	this.exportData=function(){
		exportData();
	};
	
	this.importData=function(){
		importData();
	};
	
	this.bacaData=function(data){
		bacaData(data);
	};
	
	this.importExecute=function(){
		importExecute();
	};
	
	this.gotoPage=function(ini){
		gotoPage(ini);
	};
}
