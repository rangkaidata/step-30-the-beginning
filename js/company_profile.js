'use strict';
// step 10: company
function CompanyProfile(){
	// step 10.1:
	var html;
	var url=global_url+'company_profile/';
	
	// step 10.4:
	function readData(){
		modul.innerHTML='Company Information';
		metode.innerHTML='Read Data';
		msg.innerHTML='';
		btn.style.display='none';
		let obj={"login_blok":login_blok};
		loadXHR(url+"read_open.php",obj,readShow);		
	}
	
	// step 10.5:
	function readShow(ironman){
		if (ironman.err==0) {
			html='<ul>'
				+'<li><label>Company Name</label>: '+ironman.data[0].company_name+'</li>'
				+'<li><label>Address</label>: '+ironman.data[0].company_address+'</li>'
				+'<li><label>Telephone</label>: '+ironman.data[0].company_telephone+'</li>'
				+'<li><label>Fax</label>: '+ironman.data[0].company_fax+'</li>'
				+'<li><label>Email</label>: '+ironman.data[0].company_email+'</li>'
				+'<li><label>Start Date</label>: '+tglInaFull(ironman.data[0].company_sdate)+'</li>'
				+'<li><p><img id="folder_image" width="200" height="200"/ src='+global_url_image+"/uploads/no_image.jpg"+'></p>'
				+'<input type="text" id="name_image" value="no_image.jpg" disabled class="b-text" hidden>' 
				+'</li>'
				+'</ul>';				
			app.innerHTML = html;
			document.getElementById("folder_image").src = global_url_image+"uploads/"+ironman.data[0].company_logo;
			document.getElementById("name_image").value = ironman.data[0].company_logo;

		}else{
			msg.innerHTML=ironman.msg;
		}
	}
	
	// step 10.6: memanggil fungsi pada saat pertama dibuka (initialize);
	readData();
}
