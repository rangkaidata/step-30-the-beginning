'use strict';
// step 24:
function CapitalStatement(){
	// step 24.1:
	var html;
	var sdate,edate;
	var url=global_url+'view/';
	var company_data;
	var ptype='closing';

	// step 24.2:
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

	// step 24.3:
	function formInput(sd,ed){
		modul.innerHTML="Capital Statement";
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

		const company_sdate=company_data.company_sdate;
		if (sd===undefined){sdate.value=company_sdate;}else{sdate.value=sd;}
		if (ed===undefined){edate.value=tglSekarang();}else{edate.value=ed;}
		
		document.getElementById('ptype').value=ptype;
		
	}

	// step 24.4:	
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
		loadXHR(url+"capital_statement.php",obj,previewShow);
		
		function previewShow(paket){
			if (paket.err===0){
				
				html='<p>Total: '+paket.count+' rows</p>'
					+'<p>File name: <a href="" id="downloadLink" onclick="exportF(this,\'capital_statement\')">capital_statement.xls</a></p>'
					+'<div id="kertas" style="padding:20px;border:1px solid lightgray;border-radius:5px;">'
					+'<table border=1 id="exportTable">'
					+'<caption>'
					+'<h1>'+company_name.toUpperCase()+'</h1>'
					+'<h2>CAPITAL STATEMENT</h2>'
					+'<h4>'+tglIna3(sdate.value)+' to ' +tglIna3(edate.value)+'</h4>'
					+'</caption>';
										
				// sort array js
				//paket.data.sort(function(a, b){return a.account_sort - b.account_sort});
				

				// sort array js if character
                paket.data.sort(function(a, b){
                    var x = a.account_sort.toLowerCase();
                    var y = b.account_sort.toLowerCase();
                    if (x < y) {return -1;}
                    if (x > y) {return 1;}
                    return 0;
                });
				
				var saldo=0;
				var saldo_group=0;
				var header_class;

				for (var x in paket.data) {
					if (x==0){
						header_class=paket.data[x].account_class;	
						html+='<tr><td style="text-align:left" colspan=3>'
							+'<h3>'+header_class.toUpperCase()+', ' + tglInaFull(sdate.value) +'</h3>'
							+'</td></tr>';
					}

					if (header_class!=paket.data[x].account_class){
						html+='<td style="text-align:right" colspan=3><b>'+formatSerebuan(saldo_group)+'</b></td></tr>';
						saldo_group=0;
						
						html+='<tr><td style="text-align:left" colspan=3>'
							+'<h3>'+paket.data[x].account_class.toUpperCase()+', ' + tglIna3(sdate.value) +' to '+tglIna3(edate.value) +'</h3>'
							+'</td></tr>';
					}

					header_class=paket.data[x].account_class;
					
					saldo_group+=parseFloat(paket.data[x].account_saldo);
					saldo+=parseFloat(paket.data[x].account_saldo);
					
					html+='<tr>'
						+'<td>'+paket.data[x].account_name+'</td>'
						+'<td style="text-align:right">'+formatSerebuan(paket.data[x].account_saldo)+'</td>'
						+'<td>&nbsp;</td>'
						+'</tr>';
						
					
				}
				html+='<td style="text-align:right" colspan=3><b>'+formatSerebuan(saldo_group)+'</b></td></tr>';
				
				html+='<tr><td style="text-align:left" colspan=3>'
					+'<h3>EQUITY, '+tglInaFull(edate.value) +'</h3>'
					+'</td></tr><tr>'
					+'<td style="text-align:right;font-weight:bold;" colspan=3>'+formatSerebuan(saldo)+'</td>'
					+'</tr>'
					+'<tr><td colspan=4 style="height:50px;border:0;text-align:left;">'+typePosting(ptype)+'</td></tr>';
				html+='</table></div>';
				app.innerHTML=html;	
			}
			else{
				msg.innerHTML = paket.msg;	
				app.innerHTML='';	
			}
		} 			
	}
	
	
	/* */
	this.formInput=function(sd,ed){
		formInput(sd,ed);
	}
	
	this.previewData=function(){
		previewData();
	}
	
	init();
}
