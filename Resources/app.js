// this sets the background color of the master UIView (when there are no windows/tab groups on it)
Titanium.UI.setBackgroundColor('#000');

var TweetClient = require('util/tweet_client');
var tweetClient;
// create tab group
var tabGroup = Titanium.UI.createTabGroup();

//
// create base UI tab and root window
//
var win1 = Titanium.UI.createWindow({  
    title:'Tab 1',
    backgroundColor:'#fff'
});
var tab1 = Titanium.UI.createTab({  
    icon:'KS_nav_views.png',
    title:'Tab 1',
    window:win1
});

var label1 = Titanium.UI.createLabel({
	color:'#999',
	text:'I am Window 1',
	font:{fontSize:20,fontFamily:'Helvetica Neue'},
	textAlign:'center',
	width:'auto'
});

win1.add(label1);

//
// create controls tab and root window
//
// var win2 = Titanium.UI.createWindow({  
    // title:'Tab 2',
    // backgroundColor:'#fff'
// });
// var tab2 = Titanium.UI.createTab({  
    // icon:'KS_nav_ui.png',
    // title:'Tab 2',
    // window:win2
// });
// 
// var label2 = Titanium.UI.createLabel({
	// color:'#999',
	// text:'I am Window 2',
	// font:{fontSize:20,fontFamily:'Helvetica Neue'},
	// textAlign:'center',
	// width:'auto'
// });
// 
// win2.add(label2);



//
//  add tabs
//
tabGroup.addTab(tab1);  
// tabGroup.addTab(tab2);  


// open tab group
tabGroup.open();

var mainWin = Ti.UI.createWindow({
    title:'Geek Search',
    backgroundColor:'#fff',
	navBarHidden:true,
	exitOnClose:true
});
mainWin.orientationModes = [Ti.UI.PORTRAIT, Ti.UI.UPSIDE_PORTRAIT];

// アプリタイトル
mainTitle = Ti.UI.createLabel({
		color:'black',
		text:'ギークサーチ！',
		left:30,
		width:140,
		top:10,
        font:{fontSize:20,fontFamily:'Helvetica Neue'}
});
mainWin.add(mainTitle);

// サブタイトル
mainSubTitle = Ti.UI.createLabel({
		color:'black',
		text:'あなたのギーク度計ります！',
		left:30,
		width:240,
		top:50,
        font:{fontSize:15,fontFamily:'Helvetica Neue'},
});
mainWin.add(mainSubTitle);

// twitter名
var twitterName = Ti.UI.createTextField({
	hintText:'twitter名を入力してね!',
	value:'donayama',
	height:38,
	left:30,
	width:250,
	font:{fontSize:15,fontFamily:'Helvetica Neue'},
	verticalAlign:Ti.UI.TEXT_VERTICAL_ALIGNMENT_BOTTOM,
	softKeyboadOnFocus:Ti.UI.Android.SOFT_KEYBOARD_SHOW_ON_FOCUS,
	borderStyle:Ti.UI.INPUT_BORDERSTYLE_ROUNDED
});
mainWin.add(twitterName);

// 診断ボタン
var seekButton = Ti.UI.createButton({
	title:'診断！！',
	color:'black',
	font:{fontFamily:'Helvetica Neue',fontWeight:'bold'},
	left:30,
	height:40,
	width:250,
	bottom:100
});

mainWin.add(seekButton);

tabGroup.activeTab.open(mainWin);

// Seeking
seekButton.addEventListener('click',function(){
	tweetClient = new TweetClient(twitterName.value);
	var seekWin = Ti.UI.createWindow({
	    title:'Seeking...',
	    backgroundColor:'#fff',
		navBarHidden:true,
		exitOnClose:true
	});
	seekWin.orientationModes = [Ti.UI.PORTRAIT, Ti.UI.UPSIDE_PORTRAIT];
	
	var seekLabel = Ti.UI.createLabel({
		color:'black',
		text:'Seeking...',
		left:30,
		width:140
	});
	
	seekWin.add(seekLabel);

	tabGroup.activeTab.open(seekWin);
});

// 結果画面の表示
var resultWin = Ti.UI.createWindow({
	    title:'診断結果！！',
	    backgroundColor:'#fff',
		navBarHidden:true,
		exitOnClose:true,
		layout:'absolute'
	});
resultWin.orientationModes = [Ti.UI.PORTRAIT, Ti.UI.UPSIDE_PORTRAIT];

// 結果画像
var resultImage = Ti.UI.createImageView({
});
resultWin.add(resultImage);

// 結果%
var resultPersent = Ti.UI.createLabel({
		color:'black',
		text:'100%',
		left:90,
		width:240,
		top:260,
		left:120,
        font:{fontSize:50,fontFamily:'Helvetica Neue'},
});
resultWin.add(resultPersent);
// var resultImage = Ti.UI.createLabel({
		// color:'black',
// //		text:'結果画像',
		// ima
		// left:30,
		// width:240,
		// top:150,
        // font:{fontSize:15,fontFamily:'Helvetica Neue'},
// });

// よく使っている言葉

Ti.App.addEventListener("ExitTweetData", function(e){
	resultPersent.text = e.result_geekword_percentage + "%\n";
//	resultImage.text = "種類:" + e.flag;
	if( e.flag == 0) {
		resultImage.image = '/images/geek_face_01.png'
	}else if ( e.flag == 1) {
		resultImage.image = '/images/geek_face_02.png'
	}else{
		resultImage.image = '/images/geek_face_03.png'
	}
	tabGroup.activeTab.open(resultWin);
});
