
// ==UserScript==
// @name         Auto Complete
// @namespace    http://lilpolak.space/
// @version      0.1
// @description  Too much effort to do memrise?
// @author       mzk
// @include      https://www.memrise.com/course/*
// @grant        GM_getValue
// @grant        GM_listValues
// @grant        GM_setValue
// @grant        GM_deleteValue
// ==/UserScript==


// Note to self - dictionary handler ENG is 1 LANG is 0

var dict = {};
var dictValidation = new RegExp("https:\/\/www.memrise.com\/course\/[A-Za-z0-9\-]+\/+[A-Za-z0-9\-]+\/+[0-9]+(\/|)$", "gi");
var gameValidation = new RegExp("https:\/\/www.memrise.com\/course\/[A-Za-z0-9\-]+\/+[A-Za-z0-9\-]+\/+[0-9]+\/+garden+\/+(learn|classic_review)\/$","gi");
var url;

function generateDict(){
    var all = document.getElementsByClassName("text-text");
    for (i = 0; i < all.length; i++) {
        var lang = all[i].getElementsByClassName("col text")[0].innerText.replace("\n", "");
        var eng = all[i].getElementsByClassName("col text")[1].innerText.replace("\n", "");
        dict[lang] = eng;
        GM_setValue("lang_dict", dict);

    }
}

function getMemrise(){
    try{
        var langWord = document.getElementsByClassName("qquestion qtext")[0];
        var nextButton = document.getElementsByClassName("next-icon")[0];
        var entryField = document.getElementsByClassName("roundy shiny-box typing-type-here")[0];
        return [langWord, nextButton, entryField];
    } catch(e){
        // pass
    }

}




function memriseMain(){
    var dict = GM_getValue("lang_dict");
    var translations = Object.entries(dict);
    var answer;

    var runtime = function(){
        
        try{
            
            var endBanner = document.getElementById("session-complete-banner");
            
            if(endBanner.innerText.split("!",1)=="Session complete"){
                console.log("done");
                clearInterval(intervalID);
            } else {
                // pass
            }
        } catch(e){
            // pass
        }
        var memriseDocument = getMemrise();
        main: for (var i in translations){
            for (var x in translations[i]){
                if (translations[i][x] == memriseDocument[0].innerText){
                    answer = translations[i][0];
                    break main;
                } else {
                    // pass
                }
            }
        }
        memriseDocument[2].value = answer;
        memriseDocument[1].click();


    };
    var intervalID = setInterval(runtime, 100);



}

$(window).on( "load", function() {
    var url = window.location.href.split('?')[0];

    if (dictValidation.test(url)) {
        generateDict();
    }else if (gameValidation.test(url)){
        memriseMain();
    }
});
