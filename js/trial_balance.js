'use strict';
// step 22: trial balance
function TrialBalance(){
	// step 22.1:
	var html;
	var url=global_url+'view/';
	var account_kelas;
	var account_name;
	var company_data;
	var sdate,edate;
	var ptype='closing';

	// step 22.2:
	function init(){
	    app.innerHTML=pleaseWait();
		const obj={
			"login_blok":login_blok
		}
		loadXHR(global_url+'company_profile/read_open.php',obj,companyProf);
		
		function companyProf(paket){
			company_data=paket.data[0];
			formInput();
		}
	}

	// step 22.3:
	function formInput(sd,ed){
		modul.innerHTML="Trial Balance";
		metode.innerHTML="View Data";
		btn.innerHTML='<button onclick="objModul.previewData()">Preview</button>';
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

			+'<li><label>Dated From</label> : <input type="date" id="sdate"></li>'
			+'<li><label>to</label> : <input type="date" id="edate"></li>'
			+'</ul>';
			
		app.innerHTML=html;

		sdate=document.getElementById('sdate');
		edate=document.getElementById('edate');
		var company_sdate=company_data.company_sdate;

		if (sd===undefined){sdate.value=company_sdate;}else{sdate.value=sd;}
		if (ed===undefined){edate.value=tglSekarang();}else{edate.value=ed;}
		
		document.getElementById('ptype').value=ptype;
	}
	
	// step 22.4:
	function previewData(){
		var company_name=company_data.company_name;
		ptype=document.getElementById('ptype').value;
		
		html='<button type="button" id="btn_back" onclick="objModul.formInput(\''+sdate.value+'\',\''+edate.value+'\');"></button>';
		btn.innerHTML =html;	
		metode.innerHTML='Preview Data';
		app.innerHTML=pleaseWait();

		const obj = {
			"login_blok":login_blok,
			"ptype":ptype,
			"sdate":sdate.value,
			"edate":edate.value,
		};
		loadXHR(url+"trial_balance.php",obj,previewShow); 			

		function previewShow(paket){
			if (paket.err===0){
				var sum_debit=0,sum_credit=0,sum_saldo=0;
				
				html='<p>Total: '+paket.count+' rows</p>'
					+'<p>File name: <a href="" id="downloadLink" onclick="exportF(this,\'trial_balance\')">trial_balance.xls</a></p>'
					+'<div id="kertas" style="padding:20px;border:1px solid lightgray;border-radius:5px;">'
					+'<table border=1 id="exportTable">'
					+'<caption>'
					+'<h1>'+company_name.toUpperCase()+'</h1>'
					+'<h2>TRIAL BALANCE</h2>'
					+'<h4>'+tglIna3(sdate.value)+' to ' +tglIna3(edate.value)+'</h4>'
					+'</caption>'
					+'<th>Account ID</th>'
					+'<th>Account Name</th>'
					+'<th>Debit</th>'
					+'<th>Credit</th>';
										
				// sort array js
				// paket.data.sort(function(a, b){return a.account_id - b.account_id});
				
				// sort string
                paket.data.sort(function(a, b){
                    var x = a.account_id.toLowerCase();
                    var y = b.account_id.toLowerCase();
                    if (x < y) {return -1;}
                    if (x > y) {return 1;}
                    return 0;
                });
                var kiri=0,kanan=0;

				for (var x in paket.data) {
				    kiri=0;
				    kanan=0;

                    if (parseFloat(paket.data[x].account_saldo)<0){
                        kanan=paket.data[x].account_saldo;
                    }
                    else{
                        kiri=paket.data[x].account_saldo;
                    }

					if (paket.data[x].account_saldo==0){
						
					}else{
						html+='<tr>'
							+'<td>'+paket.data[x].account_id+'</td>'
							+'<td>'+paket.data[x].account_name+'</td>'
							+'<td style="text-align:right">'+formatSerebuan(kiri)+'</td>'
							+'<td style="text-align:right">'+formatSerebuan(kanan*-1)+'</td>'
							+'</tr>';
					}
					sum_debit+=parseFloat(kiri);
					sum_credit+=parseFloat(kanan);
					sum_saldo+=parseFloat(paket.data[x].account_saldo);
				}
				
				html+='<tr><td>&nbsp;</td><td style="text-align:center;font-weight:bold;">Total</td>'
					+'<td style="text-align:right;font-weight:bold;">'+formatSerebuan(sum_debit)+'</td>'
					+'<td style="text-align:right;font-weight:bold;">'+formatSerebuan(sum_credit*-1)+'</td>'
					+'<td style="text-align:right;font-weight:bold;">'+formatSerebuan(sum_saldo)+'</td>'
					+'</tr>'
					+'<tr><td colspan=4 style="height:50px;border:0;text-align:left;">'+typePosting(ptype)+'</td></tr>'
				    +'</table></div>';
				app.innerHTML=html;	
			}
			else{
				msg.innerHTML = paket.msg;	
				app.innerHTML='';	
			}
		}

	}
	
	/* --- --- */
	this.formInput=function(sd,ed){
		formInput(sd,ed);
	}
	
	this.previewData=function(){
		previewData();
	}

	// step 22.5:	
	init();
	
}
