//
function Homepage(){
	var url=global_url+'activity/'
	var baris=10;
	
	function readData(){
		modul.innerHTML='Homepage';	
		metode.innerHTML='';
		app.innerHTML=pleaseWait();
		btn.style.display='none';	
		const obj= {"login_blok":login_blok};
		loadXHR(url+"data_count.php",obj,readShow);
	}

	function readShow(paket){
		var x;
		msg.innerHTML='';
		html ='<h2>Company List</h2>'
		html+='<table border=1>'
			+'<th style="display:none">Blok</th>'
			+'<th>No.</th>'
			+'<th>Image</th>'
			+'<th>Company<br>Name</th>'
			+'<th>Start<br>Date</th>'
			+'<th>Records<br>Account</th>'
			+'<th>Records<br>Journal</th>'
			+'<th>Records<br>User</th>'

		if (paket.err===0){
			for (x in paket.data) {
				html+='<tr>'
					+'<td>'+paket.data[x].nomer+'</td>'
					+'<td><img style="height:60px;width:60px;" src='+global_url_image+'uploads/'+paket.data[x].company_logo+'></td>'
					+'<td>'+paket.data[x].company_name+'</td>'
					+'<td>'+tglIna2(paket.data[x].company_sdate)+'</td>'
					+'<td>'+paket.data[x].account_count+'</td>'
					+'<td>'+paket.data[x].journal_count+'</td>'
					+'<td>'+paket.data[x].user_count+'</td>'
					+'</tr>';
			}
		}
		html+='</table>';
		
		if (paket.count===0){
			html+='No Company Record';
		}
		
		app.innerHTML=html+'<br>';
		
		var obj = {"login_blok":login_blok, "baris":baris};
		loadXHR(url+'last_activity.php',obj,readLast); 
	}
	
	function readLast(paket){
		html='<br><h2>Last Activity</h2>'
		
		if (paket.err===0){
			html+='<ul>'
			for (x in paket.data) {
				html+='<li>'
					+'['+tglIna(paket.data[x].date_created) +'] '
					+paket.data[x].modul+': '+paket.data[x].metode+' by '+paket.data[x].user_name+'</li>'
					
			}
			html+='</ul>';
		}
		app.innerHTML+=html;	
	}

	readData();
}
