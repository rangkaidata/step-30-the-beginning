'use strict';
var global_url='https://datablok.id/v0/';

// function 01
function loadXHR(url,obj,callback){
	var request = new XMLHttpRequest();
	var dbParam = JSON.stringify(obj);

	request.onload=function(){		
		if (request.readyState===4){
		    console.log(request.responseText);
			var paket = JSON.parse(request.responseText);
			callback(paket);
		}
		else {
			console.log('Network request failed with response ' + request.status + ': ' + request.statusText)
		}
	};
	request.open('POST', url);
	request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	request.send(dbParam);
}

// function 02
function blokID (blok){
	var blokend = blok;
	var blokend3 = blokend.split("-");
	return blokend3[2];
}

// function 03
function tglIna(tgl){
	var bulan = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nop", "Des"];
	return tgl.substr(8,2)+'-'+bulan[parseInt(tgl.substr(5,2))-1]+'-'+tgl.substr(2,2) +' ' +tgl.substr(11,5);
}

// function 04
function timeID(blok){
	var blokend = blok;
	var blokend3 = blokend.split("-");
	return blokend3[0];
}	

// function 05
function pleaseWait(){
	return "Please wait ...";
}

// function 06
function paging(paket){
	var html='';
	var x;
	if (paket.err===0){
		if (metode.innerHTML=="Read Data"){
			if (paket.paging.first!=""){
				html+= '<button type="button" id="btn_first" onclick="objModul.gotoPage(\''+paket.paging.first+'\')"></button>';
			}
			for (x in paket.paging.pages) {			
				if (paket.paging.pages[x].current_page=="yes"){
					html+= '<button type="button" onclick="objModul.gotoPage(\''+paket.paging.pages[x].url+'\')" disabled >'+paket.paging.pages[x].page +'</button>';	
				} else {
					html+= '<button type="button" onclick="objModul.gotoPage(\''+paket.paging.pages[x].url+'\')">'+paket.paging.pages[x].page+'</button>';	
				}
			}
			if (paket.paging.last!=""){
				html+='<button type="button" id="btn_last" onclick="objModul.gotoPage(\''+paket.paging.last+'\')"></button>';
			}
		}
	}	
	return html;
}

// function 07
function tglInaFull(tgl){
	var bulan = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "Nopember", "Desember"];
	return tgl.substr(8,2)+' '+bulan[parseInt(tgl.substr(5,2))-1]+' '+tgl.substr(0,4) ;
}

// function 08
function formatSerebuan(num) {
    var balikin='&nbsp;';
	if (num===undefined){return balikin}
	if (num===null){return balikin}
	if (num===0){return balikin}
	if (num==='0'){return balikin}
	if (num==='0.00'){return balikin}
    
    // console.log(num+'<br>');
    
	if (num<0){
	    // bila nilai minus, menggunakan tanda kurung.
	    /* 
	    num = parseFloat(num)*-1;
		return "("+num.toFixed(2).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')+")";
		*/
		num = parseFloat(num);
		return num.toFixed(2).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,'); 
	}else{
	    num = parseFloat(num);
		return num.toFixed(2).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
	}
}

// function 09: format tanggal 
function tglIna2(tgl){
	var bulan = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nop", "Des"];
	return tgl.substr(8,2)+'-'+bulan[parseInt(tgl.substr(5,2))-1]+'-'+tgl.substr(2,2) ;
}

// function 10: tampilkan halaman input dan tombol untuk membuat data baru. 
function tglSekarang(){
	var n=new Date();
	var tglskrng=n.getFullYear()+"-"+("0"+parseInt(n.getMonth()+1)).slice(-2)+"-"+("0"+n.getDate()).slice(-2);
	return tglskrng;
}	
	
// function 11:
function load_modul(modul){
	sessionStorage.setItem("modul",modul);
	location.reload();
}

// function 12
function ikon(menu_name){
	switch (menu_name){
		case "Setting":
			return "&#128295; "+menu_name;
			break;
		case "Network":
			return "&#127759; "+menu_name;
			break;
		case "Folder":
			return "&#128193; "+menu_name;
			break;
		case "Tutup":
			return "&#10005; ";
			break;
		case "Logout":
			return "&#128100; ";
			break;
		case "Exit":
			//return "&#128164 Logout";
			return "&#128164; ";
			break;
		case "Close Folder":
			return "&#128194; "+menu_name;
			break;
		case "User":
			return "&#128100; ";
			break;
		case "Users":
			return "&#128101;";
			break;
		case "Email":
			return "&#128101;";
			break;
		case "Login":
			return "&#128275;";
			break;
		case "Dashboard":
			return "&#128275;";
			break;
		default:
			//return "&#127974; "+menu_name;
			//return "&#128216; "+menu_name;
			return "&#127974; "+menu_name;
	}
	// &#128193; 
	// &#127760; earth
}

function tglBlok(blok){
	if (blok==undefined){
		return '';
	}
	const blokx=blok;
	var bulan = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "Nopember", "Desember"];
	return blokx.substr(6,2)+'-'+bulan[parseInt(blokx.substr(4,2))-1] +'-'+blokx.substr(0,4) +' '+blokx.substr(8,2)+':'+blokx.substr(10,2);
}


function pagingPopup(paket){
	var html='';
	if (paket.err==0){
		if (objPop.metode=="Read Data"){
			if (paket.paging.first!=""){
				html+= "<button type='button' id='btn_first' onclick='objPop.gotoPage(\"" + paket.paging.first + "\")' ></button>" ;
			}
			for (var x9 in paket.paging.pages) {			
				if (paket.paging.pages[x9].current_page=="yes"){
					html+= "<button type='button' onclick='objPop.gotoPage(\"" + paket.paging.pages[x9].url + "\")' disabled >"+ paket.paging.pages[x9].page +"</button>";	
				} else {
					html+= "<button type='button' onclick='objPop.gotoPage(\"" + paket.paging.pages[x9].url + "\")'>"+ paket.paging.pages[x9].page +"</button>";	
				}
			}
			if (paket.paging.last!=""){
				html+= "<button type='button' id='btn_last' onclick='objPop.gotoPage(\"" + paket.paging.last + "\")'></button>" ;
			}
		}
	}
	return html;
}

function tglIna3(tgl){
	var bulan = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nop", "Des"];
	return tgl.substr(8,2)+'-'+bulan[parseInt(tgl.substr(5,2))-1]+'-'+tgl.substr(0,4) ;
}

function tglJurnal(tgl){
	var bulan = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nop", "Des"];
	return bulan[parseInt(tgl.substr(5,2))-1]+'\n'+tgl.substr(8,2);
}

function exportF(elem,judul) {
	var table = document.getElementById("exportTable");
	var html = table.outerHTML;
	var url = 'data:application/vnd.ms-excel,' + escape(html); // Set your html table into url 
	elem.setAttribute("href", url);
	elem.setAttribute("download", judul+".xls"); // Choose the file name
	return false;
}

function exportC(elem,judul) {
	var table = document.getElementById("exportTable");
	var html = table.outerHTML;
	var url = 'data:application/vnd.ms-excel,' + escape(html); // Set your html table into url 
	elem.setAttribute("href", url);
	elem.setAttribute("download", judul); // Choose the file name
	return false;
}

function typePosting(ptype){
    var hasil='';
    switch (ptype){
        case 'opening':
            hasil='Opening only.';
            break;
        case 'general':
            hasil='Opening;General.';
            break;
        case 'adjusting':
            hasil='Opening;General;Adjusting.';
            break;
        default:
            hasil='Opening;General;Adjusting;Closing.';
    }

    return '<small>Posting: '+hasil+'</small>';
}

// konversi bentuk array ke bentuk koma
function arrayToComma2(data){
	//const propertyValues = Object.entries(row);
	var csv='';
	var propertyKeys;
	var propertyValues;
	var txt;
	var y;
	var pertama=0;
	for (var x in data){
		// column name
		if (x==0){
			propertyKeys = Object.keys(data[x]);
			csv+=propertyKeys.join(',')+'\n';
		}	
		propertyValues = Object.values(data[x]);
		// muter di kolom
		for (y in data[x]){
			// fol
			if (pertama===1){
				csv+=",";
			}
			pertama=1;

			txt=data[x][y];
			if (txt===null){
				txt='';
			}
			
			if (txt.search(',')>0){
				csv+='"'+txt+'"';
			}
			else{
				csv+=txt;
			}
		}
		csv += '\n';
		pertama=0;
    };
	return csv;
}

// send text to file download
function downloadFile(fileName,text) {
	var element = document.createElement('a');
	element.setAttribute('href', 'data:text/plain;charset=utf-8,' + text);
	element.setAttribute('download', fileName);
	element.style.display = 'none';
	element.click();
}		

function decodeHtml(html) {
    var area69 = document.createElement("textarea");
    area69.innerHTML = html;

    return area69.value;
}

function arrayToPHP(data){
	//const propertyValues = Object.entries(row);
	var csv='';
	var propertyKeys;
	var propertyValues;
	var txt;
	var y;
	var pertama=0;
	for (var x in data){
		// column name
		/*if (x==0){
			propertyKeys = Object.keys(data[x]);
			csv+=propertyKeys.join(',')+'\n';
		}	
		propertyValues = Object.values(data[x]);*/
		// muter di kolom
		for (y in data[x]){
			// fol
			if (pertama===1){
				csv+=",";
			}
			else{
				csv+='array(';
			}
			pertama=1;

			txt=data[x][y];
			if (txt===null){
				txt='';
			}
			csv+='"'+txt+'"';
		}
		csv += '),\n';
		pertama=0;
    };
	return csv;
}
