'use strict';
// step 16:
function AccountOpening(){
	// step 16.1:
	var html;
	var url=global_url+'account_begin/';
	var url2=global_url+'account/';
	var page;
	var kolom=1;
	
	// step 16.2:
	function readData(){
		modul.innerHTML='Account Opening Balance';	
		metode.innerHTML='Read Data';	
		html='<button type="button" id="btn_search" onclick="objModul.searchData(\'\');"></button>';
		btn.innerHTML=html;	
		msg.innerHTML='';	
		app.innerHTML=pleaseWait();
		
		const obj= {"login_blok":login_blok,"kolom":kolom};
		if (page==null){loadXHR(url2+"read_paging.php",obj,readShow);}
		else{loadXHR(page,obj,readShow);}
	}
	
	// step 16.3:
	function readShow(paket){
		var kol=['Account ID','Account Name','Account Class'];
		var ikon_sort;

		if (kolom<0){
			ikon_sort='&nbsp;&#8593;';
		}else{
			ikon_sort='&nbsp;&#8595;';
		}
		
		html='<p>Total: '+paket.count+' rows</p>';			
		html+=paging(paket)
			+'<table border=1>'
			+'<th>No.</th>';
			
		for (var x=0;x<kol.length;x++){
			if (Math.abs(kolom)==(x+1)){
				html+='<th onclick="objModul.urut(this)">'+kol[x]+ikon_sort+'</th>';
			}
			else{
				html+='<th onclick="objModul.urut(this)">'+kol[x]+'</th>';
			}
		}

		html+='<th>Debit</th>'
		    +'<th>Credit</th>'
			+'<th colspan=2>Action</th>';
			/*+'<th>User Name</th>'
			+'<th>Date Created</th>'
			*/

		if (paket.err===0){
			for (x in paket.data) {
				html+='<tr>'
					+'<td>'+paket.data[x].nomer+'</td>'
					+'<td>'+paket.data[x].account_id+'</td>'
					+'<td>'+paket.data[x].account_name+'</td>'
					+'<td>'+paket.data[x].account_class+'</td>'
					+'<td style="text-align:right">'+formatSerebuan(paket.data[x].account_debit)+'</td>'
					+'<td style="text-align:right">'+formatSerebuan(paket.data[x].account_credit)+'</td>'
					+'<td><button type="button" id="btn_change" onclick="objModul.updateData(\''+paket.data[x].account_blok+'\');"></button></td>'
					+'</tr>';
					/*+'<td>'+paket.data[x].user_name+'</td>'
					+'<td>'+tglIna(paket.data[x].date_created)+'</td>'*/
					
					
			}
		}
		html+='</table>';
		app.innerHTML=html;	
	}
	
	// step 16.4:
	function gotoPage(ini){
		page=ini;
		readData();
	}
	
	// step 16.5:
	function updateData(blok_id){
		metode.innerHTML='Update Data';	
		html='<button type="button" id="btn_back" onclick="objModul.readData();">'
			+'<button type="button" id="btn_save" onclick="objModul.updateExecute(\''+blok_id+'\');">';
		btn.innerHTML=html;		
		msg.innerHTML='';	

		//var abc=new Accounts(); // mengambil object Accounts
		//abc.readOneData(blok_id); // mengambil metode readOne
		readOneData(blok_id);
	}	
	

	
	// step 16.6:
	function updateExecute(blok_id){
		const obj = {
			"login_blok":login_blok,
			"account_blok":blok_id,
			"account_debit":document.getElementById("account_debit").value,
			"account_credit":document.getElementById("account_credit").value,
		};
		loadXHR(url+"update.php",obj,updateExecuteMessange);

		function updateExecuteMessange(paket){
			if (paket.err===0){			
				document.getElementById("btn_save").disabled=true;
			}
			msg.innerHTML=paket.msg;			
		}
	}
	
	// step 16.7:
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
	
	// step 16.8:
	function searchExecute(){
		metode.innerHTML='Search Result';
		const txt=document.getElementById('txt_search').value;
		
		html ='<button type="button" id="btn_back" onclick="objModul.searchData(\''+txt+'\');"></button>';
		btn.innerHTML=html;
		app.innerHTML=pleaseWait();

		const obj={
			"login_blok":login_blok,
			"search":txt}
		loadXHR(url2+"search.php",obj,readShow);
	}
	
	// step 16.9:
	function urut(apa){
		var kolom_klik=apa.cellIndex
		if (kolom==kolom_klik){
			kolom=kolom_klik*-1
		}
		else{
			kolom=kolom_klik;
		}
		readData(kolom);
	}

	// step 16.10:
	readData();

	// step 11.09:
	function readOneData(blok_id){
		app.innerHTML=pleaseWait();
		const obj={
			"login_blok":login_blok,
			"account_blok":blok_id
		};
		loadXHR(url2+"read_one.php",obj,readOneShow); 
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
		}else{
			msg.innerHTML=paket.msg;
		}
	}	
	
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
			+'<li><label for="account_debit">Debit</label>: '
			+'<input type="text" id="account_debit" onfocus="this.select();" disabled></li>'
            +'<li><label for="account_credit">Credit</label>: '
			+'<input type="text" id="account_credit" onfocus="this.select();" disabled></li>'
			+'</ul>'
			+'</form>';
		app.innerHTML=html;	
		
		if (metode.innerHTML==='Update Data'){
			// document.getElementById('account_name').disabled=false;
			document.getElementById('account_debit').focus();
			document.getElementById('account_debit').disabled=false;
			document.getElementById('account_credit').disabled=false;
		}
	}


	
	// 
	this.readData=function(){
		readData(kolom);
	};
	
	this.gotoPage=function(ini){
		gotoPage(ini);
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
	};
	
	this.urut=function(apa){
		urut(apa);
	};	
}
