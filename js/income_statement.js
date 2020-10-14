'use strict';
// step 23:
function IncomeStatement(){
	// step 23.1:
	var html;
	var sdate,edate;
	var url=global_url+'view/';
	var company_data;
	var ptype='closing';

	// step 23.2:
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

	// step 23.3:
	function formInput(sd,ed){
		modul.innerHTML="Income Statement";
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

	// step 23.4:	
	function previewData(){
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
		loadXHR(url+"income_statement.php",obj,previewShow);
		
		function previewShow(paket){
			var company_name=company_data.company_name;

			if (paket.err===0){

				html='<p>Total: '+paket.count+' rows</p>'
					+'<p>File name: <a href="" id="downloadLink" onclick="exportF(this,\'income_statement\')">income_statement.xls</a></p>'
					+'<div id="kertas" style="padding:20px;border:1px solid lightgray;border-radius:5px;">'
					+'<table border=1 id="exportTable">'
					+'<caption>'
					+'<h1>'+company_name.toUpperCase()+'</h1>'
					+'<h2>INCOME STATEMENT</h2>'
					+'<h4>'+tglIna3(sdate.value)+' to ' +tglIna3(edate.value)+'</h4>'
					+'</caption>';
										
				// sort number array js
				// paket.data.sort(function(a, b){return a.account_id - b.account_id});
				
				// sort character array js
                paket.data.sort(function(a, b){
                    var x = a.account_id.toLowerCase();
                    var y = b.account_id.toLowerCase();
                    if (x < y) {return -1;}
                    if (x > y) {return 1;}
                    return 0;
                });
                
				var saldo=0;
				var saldo_group=0;
				var header_class;
				
				for (var x in paket.data) {
					
					if (x===0){
						header_class=paket.data[x].account_class;	
						html+='<tr><td style="text-align:left" colspan=4><b>'+header_class.toUpperCase()+'</b></td></tr>';
					}
					
					if (header_class!=paket.data[x].account_class){
						if (header_class==='Income' || header_class==='Other Income'){
					    	html+='<tr><td style="text-align:right" colspan=3><b>'+formatSerebuan(saldo_group)+'</b></td>'
					    	    +'<td>&nbsp;</td></tr>';
						}else{
						    html+='<tr><td colspan=3>&nbsp;</td>'
						        +'<td style="text-align:right"><b>'+formatSerebuan(saldo_group)+'</b></td></tr>';
						}
						
						saldo_group=0;
						
						html+='<tr><td style="text-align:left" colspan=4><b>'+paket.data[x].account_class.toUpperCase()+'</b></td></tr>';
					}
					
					header_class=paket.data[x].account_class;
					
					saldo+=parseFloat(paket.data[x].account_saldo2);
					saldo_group+=parseFloat(paket.data[x].account_item);
					
					html+='<tr>'
						+'<td>'+paket.data[x].account_id+'</td>'
						+'<td>'+paket.data[x].account_name+'</td>';
					
					// alert(paket.data[x].account_class);
					if (paket.data[x].account_class==='Income' || paket.data[x].account_class==='Other Income'){
					    html+='<td style="text-align:right">'+formatSerebuan(paket.data[x].account_item)+'</td>';
					    html+='<td>&nbsp;</td>';
					}else{
					    html+='<td>&nbsp;</td>';
					    html+='<td style="text-align:right">'+formatSerebuan(paket.data[x].account_item)+'</td>';
					}
						
					html+'<td>&nbsp;</td>';
						+'</tr>';
						

				}
				if (paket.data[x].account_class==='Income' || paket.data[x].account_class==='Other Income'){
				    html+='<tr><td style="text-align:right" colspan=3><b>'+formatSerebuan(saldo_group)+'</b></td>'
				        +'<td>&nbsp;</td></tr>';
				}else{
				    html+='<tr><td>&nbsp;</td><td style="text-align:right" colspan=3><b>'+formatSerebuan(saldo_group)+'</b></td></tr>'
				}

				html+='<tr><td style="text-align:left" colspan=4><b>PROFIT & LOSS</b></td></tr>'
					+'<tr><td colspan=2>&nbsp;</td>'
					+'<td style="text-align:right;height:50px;" colspan=2><b>'+formatSerebuan(saldo*-1)+'</b></td>'
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

	// step 23.5:	
	init();
}
