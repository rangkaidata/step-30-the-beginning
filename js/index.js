'use strict';
// step i.1:

var login_blok=sessionStorage.getItem('login_blok');
var login_blok_master=null;
var modul_aktif=sessionStorage.getItem('modul');
var data_login;

// rangkaidata.com link
var blok_link=document.getElementById('blog_link');
var blok_footer=document.getElementById('blog_footer');

// main element html
var demo=document.getElementById('demo');
var main=document.getElementById('main');
var modul=document.getElementById('modul');
var metode=document.getElementById('metode');
var msg=document.getElementById('msg');
var btn=document.getElementById('btn');
var menu=document.getElementById('menu');
var sub_menu=document.getElementById('sub_menu');

// popup element
var blank=document.getElementById('blank');
var popup_modul=document.getElementById('popup_modul');
var popup_metode=document.getElementById('popup_metode');
var popup_button=document.getElementById('popup_button');
var popup_content=document.getElementById('popup_content');

var list_menu;


var global_url='https://datablok.id/v0/';
var global_url_image='https://rangkaidata.com/image/';
var global_url_passcode='https://datablok.id/v0/passcode/xyzimg.php';

/*
var global_url='http://localhost/v0/';
var global_url_image='http://localhost/image/';
var global_url_passcode='http://localhost/v0/passcode/xyzimg.php';
*/

var objHome;
var objModul;
var objPop;
var objLogin;

// step XX.2: 
function loginRead(){
	var url=global_url+'login/';
	var obj={"login_blok":login_blok}
	loadXHR(url+'read.php',obj,readMessage);

	// step XX.3: 
	function readMessage(paket){
		if (paket.err===0){
			// step XX.3.1: 
			sudahLogin(paket);
		}
		else{
			// step XX.3.2: 
			belumLogin(paket);
		}
	}
}

// step XX.3.1: 
function sudahLogin(paket){
	data_login=paket;
	if (paket.data[0].login_blok_master!=''){
		login_blok_master=paket.data[0].login_blok_master;
	}
	else{
		// nothing else
	}	
	objHome=new Home();
}

// step XX.3.2: 
function belumLogin(paket){
	msg.innerHTML='';		
	if (paket.err===24){
		login_expired_form(paket);
		//objModul=new Logout();
	}
	else{
		sessionStorage.removeItem('login_blok');
		if (modul_aktif==='register'){
			// step 1
			objModul=new Register();
		}
		else if(modul_aktif==='forgot'){
			// step 29
			objModul=new Forgot();
		}	
		else{
		    blok_link.style.display='block';
		    blok_footer.style.display='block';
			objLogin=new Login();
		}
	}
}

// step XX.4: 
function goto_modul(modula){
	modul.innerHTML=modula;
	metode.innerHTML='[modul "'+modula+'" not found].';
	msg.innerHTML='<br>press f5 to refresh ...';
	switch(modula){
		case 'logout':
			// step-3
			objModul=new Logout();
			break;
		case 'home':
			// step-4
			objModul=new Homepage();
			break;
		case 'user_profile': 
			// step-5
			objModul=new UserProfile();
			break;
		case 'blok': 
			// step-6
			objModul=new Blok();
			break;
		case 'notes': 
			// step-7
			objModul=new Notes();
			break;
		case 'default': 
			// step-8
			objModul=new Default();
			break;
		case 'company':
			// step-9
			objModul=new Company();
			break;
		case 'company_profile': 
			// step-10
			objModul=new CompanyProfile();
			break;
		case 'accounts': 
			// step-11
			objModul=new Accounts();
			objModul.readData();
			break;
		case 'manage_users': 
			// step-12
			objModul=new ManageUser();
			break;
		case 'join_user': 
			// step-13
			objModul=new JoinUser();
			break;
		case 'account_balance':
			// step-16
			objModul=new AccountOpening();
			break;
		case 'journals':
			// step-17
			objModul=new Journal(login_blok);
			objModul.readData();
			break;
		case 'general_journal':
			// step 19
			objModul=new GeneralJournal();
			break;
		case 'general_ledger':
			// step 20
			objModul=new GeneralLedger();
			break;
		case 'balance_sheet':
			// step 21
			objModul=new BalanceSheet();
			break;
		case 'trial_balance':
			// step 22
			objModul=new TrialBalance();
			break;
		case 'income_statement':
			// step 23
			objModul=new IncomeStatement();
			break;
		case 'capital_statement':
			// step 24
			objModul=new CapitalStatement();
			break;
		case 'closing_date':
			// step 25
			objModul=new ClosingDate();
			break;
		default:
	}
}

// step XX.5: 
function login_expired_form(paket){
	msg.innerHTML=paket.msg;
	modul.innerHTML='Login Expired';
	metode.style.display='none';
	menu.style.display='none';
	
	btn.innerHTML='<button onclick="keluarAjah();">Logout</button>';
	app.style.display='none';
}

function keluarAjah(){
	msg.innerHTML=pleaseWait();
	var obj={"login_blok":login_blok}
	loadXHR(global_url+'logout/create.php',obj,logoutMessage);
	
	function logoutMessage(paket){
		if (paket.err===0){
			sessionStorage.removeItem('login_blok');
			location.reload();
		}
		else{
			msg.innerHTML=paket.msg;
		}
	}
}

// end.
