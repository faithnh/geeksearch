var resultData = [];
var cgeekwords = [];
var cgeekword_count;
var tgeekwords = [];
var tgeekword_count;
var result_geekwords = [];
var result_geekword_count;
var result_geekword_percentage;
var cgeekword = ["アイマス","リスアニ","アイマスタジオ","キュウベイ","なのは","マギカ","スイーツ","東方","アニオタ","sharpnel"];
var tgeekword = ["ansi/c","java","c++","ssh","ftp","titanium","ada","stl","p2p","dns","dart","prolog","lisp","関数型言語","リファクタリング",
	"android","ios","createwindow","ゲシュタルト"];

function searchTGeek(worddata){
	worddata.word = worddata.word.toLowerCase()
	for(var i = 0; i < tgeekword.length; i++){
		
		if(worddata.word.indexOf(tgeekword[i]) != -1){
			return true;
		}
	}
	return false;
}

function searchCGeek(worddata){
	worddata.word = worddata.word.toLowerCase()
	for(var i = 0; i < cgeekword.length; i++){
		
		if(worddata.word.indexOf(cgeekword[i]) != -1){
			return true;
		}
	}
	return false;
}

/**
 * ツイッターから指定したユーザ名のツイート情報を取りだし、callbackで実行させる。
 */
var TinySegmenter = require('tiny_segmenter-0.1');

function getTweetInformation(name){
	var xhr = Ti.Network.createHTTPClient();
	var user = name;
	var url = "http://api.twitter.com/1/statuses/user_timeline.json?screen_name=" + user;

	xhr.open('GET', url);
	/**
	 * コールバック関数
	 */
	xhr.onload = function(){
		var segmenter = new TinySegmenter();
		var timeline = JSON.parse(this.responseText);
	    var tweetdata = "";
	    /*ツイートを取りだし、文字列を結合していく*/
	    for (var i=0;i<timeline.length;i++) {
	        var tweet = timeline[i];
	        tweetdata = tweetdata + tweet.text + " ";
	    }
	    /*ツイート２０個分のデータを形態素解析*/
	    var text_mining_data = segmenter.segment(tweetdata);
	    text_mining_data = text_mining_data.sort();
	    var text_mining = [];
	    for(var i = 0; i < text_mining_data.length; i++){
	    	if(text_mining_data[i].length > 3){
	    		text_mining.push(text_mining_data[i]);
	    	}
	    }
	    //ヒストグラムのハッシュマップを作成（単語ごとの数の配列を作成）
	    var pre = text_mining[0];
	    var count = 1;
	    
	    for(var i = 1; i < text_mining.length; i++){
			if(pre != text_mining[i]){
				tmp = {word:pre, count:count};
				pre = text_mining[i];
				count = 1;
				resultData.push(tmp);
	    	}else{
	    		count+=1;
	    	}
	    }
		resultData.sort(function(a, b) {
			return (a.count < b.count) ? 1 : -1;
	    });
	    
	    //あらかじめ登録されたギークワードをもとにテクノロジーおよび
	    //カルチャー系ごとのギークワードのデータおよび合計数を求める。
	    tgeekword_count = 0;
	    cgeekword_count = 0;
	    for(var i = 0; i < resultData.length; i++){
	    	if(searchTGeek(resultData[i])){
	    		tgeekwords.push(resultData[i]);
	    		tgeekword_count += resultData[i].count;
	    	}else if(searchCGeek(resultData[i])){
	    		cgeekwords.push(resultData[i]);
	    		cgeekword_count += resultData[i].count;
	    	}
	    }
	    
	   result_geekwords = tgeekwords.concat(cgeekwords);
	   result_geekword_count = tgeekword_count + cgeekword_count;
	   
	    //個数の高い順にソートする
	    result_geekwords.sort(function(a, b) {
			return (a.count < b.count) ? 1 : -1;
	    });
	    
	    //パーセンテージも求める(100%以上は100%にする)
	    result_geekword_percentage = result_geekword_count * 6 > 100? 100:result_geekword_count * 6;
	    //フラグも求める
	    var flag
	    if(result_geekword_percentage <= 35){
	    	flag = 0;
	    }else if(result_geekword_percentage <= 70){
	    	flag = 1;
	    }else{
	    	flag = 2;
	    }
	    
	    
	    //イベントExitTweetDataとして発火させる
	    Ti.App.fireEvent("ExitTweetData",{
	    	result_geekwords:result_geekwords,
	    	flag:flag,
	    	result_geekword_percentage:result_geekword_percentage
	    });
	}
	xhr.send();
}

module.exports = getTweetInformation;