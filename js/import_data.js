'use strict';

function stepImport(namafile,f_baca){
	var html=''
		+'<ul>'
		+'<li><b>Tahapan import data dari file dengan format CSV (Comma Separated Values) ke web server:</b></li>'
		+'<li>1) Buat file dengan format file CSV.</li>'
		+'<li>2) Atau <a href="" id="downloadLink" onclick="importF(this,\''+namafile+'\')">download disini</a> template CSV.</li>'
		+'<li>3) Isi dan lengkapi file tersebut dengan data sesuai kolom yang disediakan.</li>'
		+'<li>4) Cek kembali file tersebut dan pastikan pembatas antara kolom adalah koma(,) lalu simpan.</li>'
		+'<li>5) Setelah file CSV sudah siap, klik <input type="file" onchange="readFile(this,objModul.bacaData)"></li>'
		+'<li>6) Pilih file, kemudian klik OPEN.</li>'
		+'<li>7) Setelah data tampil dilayar, klik tombol "Import Data" dibawah ini.</li>'
		+'<li>8) Bila tombol "Import Data" tidak tampil, tentunya ada kesalahan di file CSV. Periksa kembali file CSV.</li>'
		+'<li>9) Selamat Mencoba.'
		+'</ul>'
		+'<p id="hasil"></p>';
	return html;
}

function readFile(input, cFunction) {
	let file = input.files[0];
	let reader = new FileReader();
	reader.readAsText(file);
	reader.onload = function() {
		console.log(reader.result);
		cFunction(reader.result);		
	};

	reader.onerror = function() {
		console.log(reader.error);
	};			
}

function importF(elem,judul) {
	var table = document.getElementById("exportTable");
	var html = table.innerHTML;
	var url = 'data:application/vnd.ms-excel,' + escape(html); // Set your html table into url 
	elem.setAttribute("href", url);
	elem.setAttribute("download", judul+".csv"); // Choose the file name
	return false;
}

