
// step 26: sample company
function SampleCompany(){
	// step 26.1:
	var html;
	var url =global_url+'sample_company/';
	var url2=global_url+'company/';
	var url3=global_url+'account/';
	var url4=global_url+'journal/';
	var url5=global_url+'company_profile/';
	var url6=global_url+'upload/';
	var data;
	var proses_123;
	var account_count=0;
	var account_proses=0;
	var nomer;
	
	// step 26.2: initialize sample
	function init(){
	    app.innerHTML=pleaseWait();
		modul.innerHTML='Explore Sample Company';
		metode.style.display='none';
		btn.innerHTML='<button id="btn_back" onclick="objModul.readData();"></button>';		
		loadXHR(url+'data.php','',tes);
		
		function tes(paket){
			data=paket;
			html='<table>'
				+'<tr>'
				+'<th>No.</th>'
				+'<th>Logo</th>'
				+'<th>Start Date</th>'
				+'<th>Company Name</th>'
				+'<th>Address</th>'
				+'<th>Email</th>'
				+'<th>Action</th>'
				+'</tr>';

			for (x in paket){			
				html+='<tr>';
				html+='<td>'+(parseInt(x)+1)+'</td>'
					+'<td><img style="height:60px;width:60px;" src='+global_url_image+'uploads/'+paket[x].logo+'></td>'
					+'<td>'+ tglIna(paket[x].start_date) +'</td>'
					+'<td>'+ paket[x].company_name +'</td>'
					+'<td>'+ paket[x].address +'</td>'
					+'<td>'+ paket[x].email+'</td>'
					+'<td><button id="btn_detail" onclick="samplecompany.showData(\''+x+'\')"></button></td>';
				html+='</tr>';
			}
			
			html+='</table>';
			html+='<p><i>&#10020 Contoh Data</i></p>';
			html+='<div id="data_show"></div>';

			app.innerHTML=html;
		}
	}

	// step 26.3: show date detail company
	function showData(a){
		html='<button id="btn_back" onclick="samplecompany.init();"></button>'
			+'<button id="btn_open" onclick="samplecompany.importData(\''+a+'\');"></button>';
		btn.innerHTML=html;
		
		// company profile
		html='<h2>Company Profile</h2>'
			+'<img style="height:150px;width:150px;" src='+global_url_image+'uploads/'+data[a].logo+'>'
			+'<ul>'
			+'<li><label>Company Name</label>: '+data[a].company_name+'</li>'
			+'<li><label>Adress</label>: '+data[a].address+'</li>'
			+'<li><label>Phone</label>: '+data[a].phone+'</li>'
			+'<li><label>Fax</label>: '+data[a].fax+'</li>'
			+'<li><label>Email</label>: '+data[a].email+'</li>'
			+'<li><label>Start Date</label>: '+tglIna(data[a].start_date)+'</li>'
			+'</ul>';
			
		// account list table
		html+='<h2>Account List</h2>';
		html+='<table>';
		html+='<tr>';
		html+='<th>Account ID</th>';
		html+='<th>Account Name</th>';
		html+='<th>Account Class</th>';
		html+='<th>Debit</th>';
		html+='<th>Credit</th>';
		html+='</tr>';
		for (x in data[a].account){
			html+='<tr>'
				+'<td>'+data[a].account[x][0]+'</td>'
				+'<td>'+data[a].account[x][1]+'</td>'
				+'<td>'+data[a].account[x][2]+'</td>'
				+'<td>'+formatSerebuan(data[a].account[x][3])+'</td>'
				+'<td>'+formatSerebuan(data[a].account[x][4])+'</td>'
				+'</tr>'
		}
		html+='</table>';

		// Journal table
		html+='<h2>Journal</h2>';
		html+='<table>';
		html+='<tr>';
		html+='<th>Type</th>';
		html+='<th>Date</th>';
		html+='<th>Ref</th>';
		html+='<th>Note</th>';
		html+='<th>Account ID</th>';
		html+='<th>Debit</th>';
		html+='<th>Credit</th>';
		html+='<th>Job ID</th>';
		html+='</tr>';
		for (x in data[a].journal){
			html+='<tr>'
				+'<td>'+data[a].journal[x][0]+'</td>'
				+'<td>'+tglIna(data[a].journal[x][1])+'</td>'
				+'<td>'+data[a].journal[x][2]+'</td>'
				+'<td>'+data[a].journal[x][3]+'</td>'
				+'<td>'+data[a].journal[x][4]+'</td>'
				+'<td>'+formatSerebuan(data[a].journal[x][5])+'</td>'
				+'<td>'+formatSerebuan(data[a].journal[x][6])+'</td>'
				+'<td>'+data[a].journal[x][7]+'</td>'
				+'</tr>'
		}
		html+='</table>';
		app.innerHTML=html;
	}
	
	// step 26.4: start process import data
	function importData(a){
		modul.innerHTML='Create Data Sample';
		btn.innerHTML='';
		app.innerHTML='<div id="proses_import"></div>';
		var proses_import= document.getElementById('proses_import');
		proses_import.innerHTML='';
		nomer=a;
		// send company
		const obj = {
			"login_blok":login_blok,
			"company_name":data[a].company_name,
			"company_address":data[a].address,
			"company_telephone":data[a].phone,
			"company_fax":data[a].fax,
			"company_email":data[a].email,
			"company_sdate":data[a].start_date,
			"company_logo":''
		};
		loadXHR(url2+"create.php",obj,createCompany); 
		
	}
	
	// step 26.5: create company
	function createCompany(paket){
		// cek error
		if (paket.err===0){
			proses_123 ='<h4>Message Proccess:</h4>';
			proses_123+='<h3>Company</h3>';
			proses_123+='[1] company-create: '+paket.msg+'<br>';
			proses_import.innerHTML=proses_123;
			// open blok
			const obj={
				"login_blok":login_blok,
				"company_blok":paket.data.blok
			};
			loadXHR(url5+"open.php",obj,openCompany); 
		}
	}
	
	// step 26.6: open company
	function openCompany(paket){
		// cek error
		if (paket.err==0) {
			// setting ke home
			sessionStorage.setItem("modul",'home');
			menu.style.display='none';
			btn.style.display='none';

			proses_123+='[2] company-open: '+paket.msg+'<br>';
			proses_import.innerHTML=proses_123;
			proses_123+='<h3>Account</h3>';
			// create account
			for (x in data[nomer].account){
				const obj={
					"login_blok":login_blok
					,"account_id":data[nomer].account[x][0]
					,"account_name":data[nomer].account[x][1]
					,"account_class":data[nomer].account[x][2]
					,"account_debit":data[nomer].account[x][3]
					,"account_credit":data[nomer].account[x][4]
				}
				loadXHR(url3+"create.php",obj,createAccount);
			}						
		}
	}

	// step 26.7: create account
	function createAccount(paket){
		// cek error
		if (paket.err==0){
			account_proses++;
			proses_123+='['+account_proses+'] account: '+paket.msg+'<br>';
			proses_import.innerHTML=proses_123+ "<br>["+account_proses+"] <i>Copy data sample. Please wait ...</i>" ;
			account_count=data[nomer].account.length;

			// bila sudah selesai import account (proses==count). 
			// lanjutkan import journal.. 
			if (account_proses===account_count){
				proses_123+='<h3>Journal</h3>';
				var data2=[];
				var arr={};
				
				/*--- masukkna ke object ---*/
				for (x in data[nomer].journal){
					arr={}
					arr.journal_modul=data[nomer].journal[x][0];
					arr.journal_date=data[nomer].journal[x][1];
					arr.journal_no=data[nomer].journal[x][2];
					arr.journal_notes=data[nomer].journal[x][3];
					arr.account_id=data[nomer].journal[x][4];
					arr.debit=data[nomer].journal[x][5];
					arr.credit=data[nomer].journal[x][6];
					arr.job_id=data[nomer].journal[x][7];

					data2.push(arr);
				}
				
				/* --- kirim ke server--- */
				const obj={
					"login_blok":login_blok,
					"data":data2
				};
				loadXHR(url6+'journals.php',obj,importJournal);
			}
		}
		else{
			proses_123+='['+account_proses+' ] account: '+paket.msg+'<br> ... ok';
			proses_import.innerHTML=proses_123;
		}
	}

	// step 26.8: prepare journal header+detail then, create journal
	function importJournal(paket2){
		account_proses=0;
		if (paket2.err===0){
			account_count=paket2.data.length;
			var isi_detail={};
			for (var x in paket2.data) {
				journal_detail=[];
				for (var y in paket2.data[x].journal_detail)	{
					isi_detail={};
					isi_detail.number= y;
					isi_detail.account_blok=paket2.data[x].journal_detail[y].account_blok
					isi_detail.account_id=paket2.data[x].journal_detail[y].account_id
					isi_detail.account_name=paket2.data[x].journal_detail[y].account_name
					isi_detail.journal_debit=paket2.data[x].journal_detail[y].debit
					isi_detail.journal_credit=paket2.data[x].journal_detail[y].credit
					isi_detail.job_blok=''; //paket.data[x].journal_detail[y].job_id
					journal_detail.push(isi_detail);
				}
				// execute create
				
				obj={
					"login_blok":login_blok,
					"journal_modul":paket2.data[x].journal_modul,
					"journal_no":paket2.data[x].journal_no,
					"journal_date":paket2.data[x].journal_date,
					"journal_note":paket2.data[x].journal_notes,
					"journal_detail":journal_detail
				}
				loadXHR(url4+"create.php",obj,createJournal); 			
			}
		}
		else{
			proses_123+='['+account_proses+'] journal: '+paket2.msg+'<br>';
			proses_import.innerHTML=proses_123
		}
	}

	// step 26.9: create journal message
	function createJournal(paket3){
		account_proses++;
		proses_123+='['+account_proses+'] journal: '+paket3.msg+'<br>';
		proses_import.innerHTML=proses_123+ "<br>["+account_proses+"] <i>Copy data sample. Please wait ...</i>" ;

		if (account_proses===account_count){
			proses_import.innerHTML=proses_123
				+'<h4>Create data sample success. Refresh page to continue.</h4>'
				+'<button onclick="location.reload();">Refresh Page</button>';
		}
	}

	init();
	
	this.importData=function(a){
		importData(a);
	};
	
	this.showData=function(a){
		showData(a);
	};

	this.init=function(){
		init();
	}
}
