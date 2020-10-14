'use strict';
// step 21: 
function BalanceSheet(){
	// step 21.1: 
	var html;
	var url=global_url+'view/';
	var account_kelas;
	var account_name;
	var company_data;
	var sdate,edate;
	var ptype='closing';

	// step 21.2: 
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

	// step 21.3: 	
	function formInput(sd,ed){
		modul.innerHTML="Balance Sheet";
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

	// step 21.4:
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
		loadXHR(url+"balance_sheet.php",obj,previewShow); 			

		function previewShow(paket){
			if (paket.err===0){
				var sum_debit=0,sum_credit=0;
				
				html='<p>Total: '+paket.count+' rows</p>'
					+'<p>File name: <a href="" id="downloadLink" onclick="exportF(this,\'balance_sheet\')">balance_sheet.xls</a></p>'
					+'<div id="kertas" style="padding:20px;border:1px solid lightgray;border-radius:5px;">'
					+'<table border=1 id="exportTable">'
					+'<caption>'
					+'<h1>'+company_name.toUpperCase()+'</h1>'
					+'<h2>BALANCE SHEET</h2>'
					+'<h4>'+tglIna3(sdate.value)+' to ' +tglIna3(edate.value)+'</h4>'
					+'</caption>';										
				// sort array js if numerik
				// paket.data.sort(function(a, b){return a.account_id - b.account_id});
				
				// sort array js if character
                paket.data.sort(function(a, b){
                    var x = a.account_sort.toLowerCase();
                    var y = b.account_sort.toLowerCase();
                    if (x < y) {return -1;}
                    if (x > y) {return 1;}
                    return 0;
                });

				
				var class_group;
				var saldo_group=0;
				var saldo=0;
				var kana=0,kiri=0;
				var saldo_kiri=0,saldo_kana=0;
				var total_kiri=0,total_kana=0;
				
				for (var x in paket.data) {
					if (x==0){
						class_group=paket.data[x].account_class;						
						html+='<tr>'
							+'<td colspan=4 style="text-align:left;"><b>'+class_group+'</b></td>'
							+'</tr>';
					}
					
					if (class_group!=paket.data[x].account_class){
						if (class_group=='Asset'){
							total_kiri=saldo_group;
							total_kana=0;
						}else{
							total_kiri=0
							total_kana=saldo_group;
						}

						html+='<tr>'
							+'<td colspan=2 style="text-align:right;">&nbsp;</td>'
							+'<td style="text-align:right"><b>'+formatSerebuan(total_kiri)+'</b></td>'
							+'<td style="text-align:right"><b>'+formatSerebuan(total_kana*-1)+'</b></td>'
							+'</tr>'
							+'<tr>'
							+'<td colspan=4 style="text-align:left;"><b>'+paket.data[x].account_class+'</b></td>'
							+'</tr>';
						saldo_group=0;
					}
					class_group=paket.data[x].account_class;

					if (class_group=='Asset'){
						saldo_kiri+=parseFloat(paket.data[x].account_saldo);
						kiri=parseFloat(paket.data[x].account_saldo);
						kana=0
					}else{
						saldo_kana+=parseFloat(paket.data[x].account_saldo);
						kana=parseFloat(paket.data[x].account_saldo);
						kiri=0
					}
					
					// tidak menampilkan saldo 0
					if (parseFloat(paket.data[x].account_saldo)!==0){
    					html+='<tr>'
    						+'<td>'+paket.data[x].account_id+'</td>'
    						+'<td>'+paket.data[x].account_name+'</td>'
    						+'<td style="text-align:right">'+formatSerebuan(kiri)+'</td>'
    						+'<td style="text-align:right">'+formatSerebuan(kana*-1)+'</td>'
    						+'</tr>';
					}
					
					saldo_group+=parseFloat(paket.data[x].account_saldo);
					saldo+=parseFloat(paket.data[x].account_saldo);
				}
				html+='<tr>'
					+'<td colspan=2>&nbsp;</td>'
					+'<td>&nbsp;</td>'
					+'<td style="text-align:right"><b>'+formatSerebuan(saldo_group*-1)+'</b></td>'
					+'</tr>';
				html+='<tr><td colspan=4>&nbsp;</td></tr>';
				
				html+='<tr><td style="text-align:center;font-weight:bold;" colspan="2">Balance</td>'
					+'<td style="text-align:right;font-weight:bolder;">'+formatSerebuan(saldo_kiri)+'</td>'
					+'<td style="text-align:right;font-weight:bolder;">'+formatSerebuan(saldo_kana*-1)+'</td>'
					+'</tr>'
					+'<tr><td colspan=4 style="height:50px;border:0;text-align:left;">'+typePosting(ptype)+'</td></tr>'
					;
				html+='</table></div>';
				app.innerHTML=html;	
			}
			else{
				msg.innerHTML = paket.msg;	
				app.innerHTML='';	
			}
		}

	}

	// step 21.5:
	init();

	/* --- --- */
	this.formInput=function(sd,ed){
		formInput(sd,ed);
	}
	
	this.previewData=function(){
		previewData();
	}
	

	
}
