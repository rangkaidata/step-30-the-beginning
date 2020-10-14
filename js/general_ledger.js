
'use strict';
var posting_tipe;

// step 20: general ledger
function GeneralLedger(){
	// step 20.1:
	var html;
	var url=global_url+'view/';
	var company_data;
	var account_kelas;
	var account_data;
	var sdate,edate;
	var ptype='closing';
	var account_selected;
	var account_start;
	var account_end;

	// step 20.2:
	function init(){
		const obj={
			"login_blok":login_blok
		}
		
		loadXHR(global_url+'company_profile/read_open.php',obj,companyProf);
		
		function companyProf(paket){
			company_data=paket.data[0];

			formInput();
		}
	}
	
	// step 20.3:
	function formInput(tipe,sd,ed){
		if (tipe==undefined){tipe='Type A';}
		var company_sdate=company_data.company_sdate;
		var func;
		
		/* --- --- */
		modul.innerHTML="General Ledger";
		metode.innerHTML="View Data";
		btn.innerHTML='<button onclick="objModul.previewDataByType(\''+tipe+'\');">Preview</button>';
		msg.innerHTML='';
		html='<ul>'
			+'<li><label>Posting</label> : '
			+'<select id="ptype">'
			+'<option value="opening">Opening Only</option>'
			+'<option value="general">Opening+General</option>'
			+'<option value="adjusting">Opening+General+Adjusting</option>'
			+'<option value="closing" selected>Opening+General+Adjusting+Closing</option>'
			+'</select>'
			+'</li>'
			+'<li><label>View Type</label> : <select id="view_tipe" onchange="objModul.viewType(this.value,\''+sd+'\',\''+ed+'\');">'
			+'<option>Type A</option>'
			+'<option>Type B</option>'
			+'<option>Type C</option>'
			+'</select></li>'
			+'<li><label>Dated From</label> : <input type="date" id="sdate"></li>'
			+'<li><label>to</label> : <input type="date" id="edate"></li>';
			
			
		if (tipe=='Type B'){
			html+='<li><label>Account Class</label> :'
				+'<select id="account_class">'
				+'<option>Asset</option>'
				+'<option>Liability</option>'
				+'<option>Equity</option>'
				+'<option>Income</option>'
				+'<option>Cost of Sales</option>'
				+'<option>Expense</option>'
				+'<option>Other Income</option>'
				+'<option>Other Expense</option>'
				+'</select></li>'
				+'</li>';
		}
		if (tipe=='Type C'){
			html+='<li><label>Account ID</label> : <input type="text" id="account_id"><input type="text" id="account_blok" hidden=hidden>'
				+'<button id="btn_find" onclick="objModul.searchAccount();"></button></li>'
				+'<li><label>Account Name</label> : <span id="account_name">---</span></li>';
		}
		
		html+='</ul>';
			
		app.innerHTML=html;

		sdate=document.getElementById('sdate');
		edate=document.getElementById('edate');
		var view_tipe=document.getElementById('view_tipe');
		view_tipe.value=tipe;
		
		if (sd===undefined){sdate.value=company_sdate;}else{sdate.value=sd;}
		if (ed===undefined){edate.value=tglSekarang();}else{edate.value=ed;}
		
		// set ptype
		document.getElementById('ptype').value=ptype;
		
		if (account_selected!==undefined){
    		document.getElementById('account_blok').value=account_selected.account_blok;
    		document.getElementById('account_id').value=account_selected.account_id;
	    	document.getElementById('account_name').innerHTML=account_selected.account_name;
		}

	}
	
	// step 20.4:
	function searchAccount(){
		objPop=new AccountLook('general_ledger','');
		objPop.readData();
	}
	
	// step 20.5:
	function selectAccount(data){
		document.getElementById('account_blok').value=data.account_blok;
		document.getElementById('account_id').value=data.account_id;
		document.getElementById('account_name').innerHTML=data.account_name;
		account_selected=data;
	}
	
	// step 20.6:
	function viewType(tipe,sd,ed){
		formInput(tipe,sd,ed);
	}
	
	// step 20.7:
	function previewDataByType(tipe){
		posting_tipe=document.getElementById('ptype').value;
		ptype=document.getElementById('ptype').value;
		
		html='<button type="button" id="btn_back" onclick="objModul.formInput(\''+tipe+'\',\''+sdate.value+'\',\''+edate.value+'\');"></button>';
		btn.innerHTML =html;	

		switch (tipe){
			case 'Type A':
				previewData();
				break;
			case 'Type B':
				var account_class=document.getElementById('account_class');
				previewDataB(account_class.value);
				break;
			case 'Type C':
				var account_blok=document.getElementById('account_blok').value;
				previewDataC(account_blok);
				break;
		}
	}
	
	// step 20.8:
	function previewData(){
		metode.innerHTML='Preview Data A';
		
		html='<button type="button" id="btn_back" onclick="objModul.formInput(\'Type A\',\''+sdate.value+'\',\''+edate.value+'\');"></button>';
		btn.innerHTML =html;	
		app.innerHTML=pleaseWait();
		
		const obj = {
			"login_blok":login_blok,
			"ptype":posting_tipe,
			"sdate":sdate.value,
			"edate":edate.value,
		};
		loadXHR(url+"general_ledger.php",obj,previewShow); 			

		function previewShow(paket){
			if (paket.err===0){
				var sum_start=0;
				var sum_debit=0,sum_credit=0;
				var sum_end=0;
				var company_name=company_data.company_name;
				
				html='<p>Total: '+paket.count+' rows</p>'
					+'<p>File name: <a href="" id="downloadLink" onclick="exportF(this,\'general_ledger_type_a\')">general_ledger_type_a.xls</a></p>'
					+'<div id="kertas" style="padding:20px;border:1px solid lightgray;border-radius:5px;">'
					+'<table border=1 id="exportTable">'
					+'<caption>'
					+'<h1>'+company_name.toUpperCase()+'</h1>'
					+'<h2>GENERAL LEDGER</h2>'
					+'<h4>'+tglIna3(sdate.value)+' to ' +tglIna3(edate.value)+'</h4>'
					+'</caption>'
					+'<th>Account Class</th>'
					+'<th>Begin<br><small>'+tglIna(sdate.value)+'</small></th>'
					+'<th>Debit</th>'
					+'<th>Credit</th>'
					+'<th>Saldo<br><small>'+tglIna(edate.value)+'</small></th>'
					+'<th>Type</th>'
					+'<th>Action</th>'
				
				// sort character array js
                paket.data.sort(function(a, b){
                    var x = a.account_sort.toLowerCase();
                    var y = b.account_sort.toLowerCase();
                    if (x < y) {return -1;}
                    if (x > y) {return 1;}
                    return 0;
                });

				var saldo=0;
				for (var x in paket.data) {
                    account_start=parseFloat(paket.data[x].account_start)
                    account_end=parseFloat(paket.data[x].account_end)

                    if (paket.data[x].account_type=='Credit'){
                        account_start=parseFloat(paket.data[x].account_start)*-1
                        account_end=parseFloat(paket.data[x].account_end)*-1
                    }
                    
					saldo+=parseFloat(paket.data[x].account_end);
					html+='<tr>'
						+'<td>'+paket.data[x].account_class+'</td>'
						+'<td style="text-align:right">'+formatSerebuan(account_start)+'</td>'
						+'<td style="text-align:right">'+formatSerebuan(paket.data[x].account_debit)+'</td>'
						+'<td style="text-align:right">'+formatSerebuan(paket.data[x].account_credit)+'</td>'
						+'<td style="text-align:right">'+formatSerebuan(account_end)+'</td>'
						+'<td style="text-align:center">'+paket.data[x].account_type+'</td>'
						+'<td><button id="btn_detail" onclick="objModul.previewTipeB(\''+posting_tipe+'\',\''+paket.data[x].account_class+'\',\''+sdate.value+'\',\''+edate.value+'\')"></button></td>'
						+'</tr>';
						
					sum_start+=parseFloat(paket.data[x].account_start);
					sum_debit+=parseFloat(paket.data[x].account_debit);
					sum_credit+=parseFloat(paket.data[x].account_credit);
					sum_end+=parseFloat(paket.data[x].account_end);
				}
				
				html+='<tr>'
				    +'<td style="text-align:right;font-weight:bold;" colspan=2>'+formatSerebuan(sum_start)+'</td>'
					+'<td style="text-align:right;font-weight:bold;">'+formatSerebuan(sum_debit)+'</td>'
					+'<td style="text-align:right;font-weight:bold;">'+formatSerebuan(sum_credit)+'</td>'
					+'<td style="text-align:right;font-weight:bold;">'+formatSerebuan(sum_end)+'</td>'
					+'<td colspan=2></td>'
					+'</tr>'
					+'<tr><td colspan=4 style="height:50px;border:0;text-align:left;">'+typePosting(ptype)+'</td></tr>'
				    +'</table>'
				    +'</div>';
				app.innerHTML=html;	
			}
			else{
				msg.innerHTML = paket.msg;	
				app.innerHTML='';	
			}
		}
	}
	
	// step 20.9:
	function previewTipeB(ptype,akun_kelas,sd,ed){
		var sdate=sd;
		var edate=ed;
		html='<button type="button" id="btn_back" onclick="objModul.previewData();"></button>';
		btn.innerHTML =html;	
		previewDataB(akun_kelas);
	}
	
	// step 20.10:
	function previewDataB(account_kelas){
		app.innerHTML=pleaseWait();
		metode.innerHTML='Preview Data B';
		account_kelas=account_kelas;
		const obj = {
			"login_blok":login_blok,
			"ptype":posting_tipe,
			"sdate":sdate.value,
			"edate":edate.value,
			"account_class":account_kelas,
		};
		loadXHR(url+"general_ledger_b.php",obj,previewShow); 			

		function previewShow(paket){
			if (paket.err===0){
				var sum_start=0;
				var sum_debit=0,sum_credit=0;
				var sum_end=0;
				var company_name=company_data.company_name;
				var account_type;

				html='<p>Total: '+paket.count+' rows</p>'
					+'<p>File name: <a href="" id="downloadLink" onclick="exportF(this,\'general_ledger_type_b\')">general_ledger_type_b.xls</a></p>'
					+'<div id="kertas" style="padding:20px;border:1px solid lightgray;border-radius:5px;">'
					+'<table border=1 id="exportTable">'
					+'<caption>'
					+'<h1>'+company_name.toUpperCase()+'</h1>'
					+'<h2>GENERAL LEDGER</h2>'
					+'<h3>ACCOUNT CLASS '+account_kelas.toUpperCase()+'</h3>'
					+'<h4>'+tglIna3(sdate.value)+' to ' +tglIna3(edate.value)+'</h4>'
					+'</caption>'
					+'<th>Account ID</th>'
					+'<th>Account Name</th>'
					+'<th>Begin<br><small>'+tglIna(sdate.value)+'</small></th>'
					+'<th>Debit</th>'
					+'<th>Credit</th>'
					+'<th id="account_type">Saldo</th>'
					+'<th>Action</th>'
									
				
				// sort angka
				// paket.data.sort(function(a, b){return a.account_id - b.account_id});	
				
				// sort character
                paket.data.sort(function(a, b){
                    var x = a.account_id.toLowerCase();
                    var y = b.account_id.toLowerCase();
                    if (x < y) {return -1;}
                    if (x > y) {return 1;}
                    return 0;
                });
                
				var saldo=0;
				var saldo_start=0;
				for (var x in paket.data) {
                    account_start=parseFloat(paket.data[x].account_start)
                    account_end=parseFloat(paket.data[x].account_end)
                    account_type=paket.data[x].account_type;
                    if (paket.data[x].account_type=='Credit'){
                        account_start=parseFloat(paket.data[x].account_start)*-1;
                        account_end=parseFloat(paket.data[x].account_end)*-1;
                    }

					saldo+=parseFloat(paket.data[x].account_end);
					saldo_start+=parseFloat(paket.data[x].account_start);
					html+='<tr>'
						+'<td>'+paket.data[x].account_id+'</td>'
						+'<td>'+paket.data[x].account_name+'</td>'
						+'<td style="text-align:right">'+formatSerebuan(account_start)+'</td>'
						+'<td style="text-align:right">'+formatSerebuan(paket.data[x].account_debit)+'</td>'
						+'<td style="text-align:right">'+formatSerebuan(paket.data[x].account_credit)+'</td>'
						+'<td style="text-align:right">'+formatSerebuan(account_end)+'</td>'
						+'<td><button id="btn_detail" onclick="objModul.previewDataC(\''+paket.data[x].account_blok+'\')"></button></td>'
						+'</tr>';
						
					sum_debit+=parseFloat(paket.data[x].account_debit);
					sum_credit+=parseFloat(paket.data[x].account_credit);
					
					if (paket.data[x].account_type=='Credit'){
                        sum_start+=(parseFloat(paket.data[x].account_start)*-1);
                        sum_end+=(parseFloat(paket.data[x].account_end)*-1);
					}else{
					    sum_start+=parseFloat(paket.data[x].account_start);					    
					    sum_end+=parseFloat(paket.data[x].account_end);
					}
				}
				
				html+='<tr>'
					+'<td style="text-align:right;font-weight:bold;" colspan=3>'+formatSerebuan(sum_start)+'</td>'
					+'<td style="text-align:right;font-weight:bold;">'+formatSerebuan(sum_debit)+'</td>'
					+'<td style="text-align:right;font-weight:bold;">'+formatSerebuan(sum_credit)+'</td>'
					+'<td style="text-align:right;font-weight:bold;">'+formatSerebuan(sum_end)+'</td>'
					+'</tr>'
					+'<tr><td colspan=4 style="height:50px;border:0;text-align:left;">'+typePosting(ptype)+'</td></tr>'
				    +'</table>'
				    +'</div>';
				app.innerHTML=html;	
				
				document.getElementById('account_type').innerHTML='Saldo ('+account_type+') <br><small>'+tglIna(edate.value)+'</small>';
			}
			else{
				msg.innerHTML = paket.msg;	
				app.innerHTML='';	
			}
		}
	}
	
	// step 20.11:
	function previewDataC(blok_id){
		const obj={
			"login_blok":login_blok,
			"account_blok":blok_id
		}
		
		loadXHR(global_url+'account/read_one.php',obj,readOne);
		
		function readOne(paket){
			if (paket.err==0){
				account_data=paket.data[0];
				previewDataCb(blok_id)
			}else{
				msg.innerHTML = paket.msg;	
				app.innerHTML='';	
			}
		}
	}
	
	// step 20.12:
	function previewDataCb(blok_id){
		metode.innerHTML='Preview Data C';
		app.innerHTML=pleaseWait();

		const obj = {
			"login_blok":login_blok,
			"ptype":posting_tipe,
			"sdate":sdate.value,
			"edate":edate.value,
			"account_blok":blok_id
		};
		loadXHR(url+"general_ledger_c.php",obj,previewShow); 			

		function previewShow(paket){
			if (paket.err===0){
				var sum_start=0;
				var sum_debit=0,sum_credit=0;
				var sum_end=0;
				var company_name=company_data.company_name;
				var account_type;
				html='<p>Total: '+paket.count+' rows</p>'
					+'<p>File name: <a href="" id="downloadLink" onclick="exportF(this,\'general_ledger_type_c\')">general_ledger_type_c.xls</a></p>'
					+'<div id="kertas" style="padding:20px;border:1px solid lightgray;border-radius:5px;">'
					+'<table border=1 id="exportTable">'
					+'<caption>'
					+'<h1>'+company_name.toUpperCase()+'</h1>'
					+'<h2>GENERAL LEDGER</h2>'
					+'<h3>'+ account_data.account_class+'/'+account_data.account_id+ '/'+ account_data.account_name +'</h3>'
					+'<h4>'+tglIna3(sdate.value)+' to ' +tglIna3(edate.value)+'</h4>'
					+'</caption>'
					+'<th>Date</th>'
					+'<th>Notes</th>'
					+'<th>Ref.</th>'
					+'<th>Begin<br><small>'+tglIna(sdate.value)+'</small></th>'
					+'<th>Debit</th>'
					+'<th>Credit</th>'
					+'<th id="account_type">End<br>'+tglIna(edate.value)+'</th>';

				// sort
				//paket.data.sort(function(a, b){return a.account_date - b.account_date});
				var abc=paket.data;
				//abc.sort(function(a, b){return a.account_date - b.account_date});
				abc.sort(function(a, b){
					var x = a.account_sort.toLowerCase();
					var y = b.account_sort.toLowerCase();
					if (x < y) {return -1;}
					if (x > y) {return 1;}
					return 0;
				});
				
				var saldo=0;
				for (var x in abc) {
				    account_type=paket.data[x].account_type;
                    saldo+=parseFloat(paket.data[x].account_end);
                    
                    account_start=parseFloat(paket.data[x].account_start)
                    //account_end=parseFloat(paket.data[x].account_end)
                    account_end=saldo;
                    if (paket.data[x].account_type=='Credit'){
                        account_start=parseFloat(paket.data[x].account_start)*-1
                        //account_end=parseFloat(paket.data[x].account_end)*-1
                        account_end=saldo*-1;
                    }

					html+='<tr>'
						+'<td>'+tglIna2(paket.data[x].account_date)+'</td>'
						+'<td>'+paket.data[x].account_notes+'</td>'
						+'<td>'+paket.data[x].account_ref+'</td>'
						+'<td style="text-align:right">'+formatSerebuan(account_start)+'</td>'
						+'<td style="text-align:right">'+formatSerebuan(paket.data[x].account_debit)+'</td>'
						+'<td style="text-align:right">'+formatSerebuan(paket.data[x].account_credit)+'</td>'
						+'<td style="text-align:right">'+formatSerebuan(account_end)+'</td>'
						+'</tr>';
						
					sum_start+=parseFloat(paket.data[x].account_start);
					sum_debit+=parseFloat(paket.data[x].account_debit);
					sum_credit+=parseFloat(paket.data[x].account_credit);
					sum_end+=parseFloat(paket.data[x].account_end);
				}
				
				html+='<tr>'
					+'<td style="text-align:right;font-weight:bold;" colspan=7>'+formatSerebuan(account_end)+'</td>'
					+'</tr>'
					+'<tr><td colspan=4 style="height:50px;border:0;text-align:left;">'+typePosting(ptype)+'</td></tr>'
				    +'</table>'
				    +'</div>';
				app.innerHTML=html;	
				
				document.getElementById('account_type').innerHTML='Saldo ('+account_type+') <br><small>'+tglIna(edate.value)+'</small>';
			}
			else{
				msg.innerHTML = paket.msg;	
				app.innerHTML='';	
			}
		}

	}
	
	/* --- --- */
	this.formInput=function(tipe,sd,ed){
		formInput(tipe,sd,ed);
	}
	
	this.previewData=function(){
		previewData();
	}
	
	this.previewDataByType=function(tipe){
		previewDataByType(tipe);
	}
	
	this.previewTipeB=function(kelas,sd,ed){
		previewTipeB(kelas,sd,ed);
	}
	
	this.previewDataC=function(blok_id){
		previewDataC(blok_id);
	}
	
	this.viewType=function(tipe){
		viewType(tipe);
	}
	
	this.searchAccount=function(){
		searchAccount();
	}
	
	this.selectAccount=function(data){
		selectAccount(data);
	}
	
	init();
	
	
}
