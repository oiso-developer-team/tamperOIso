// ==UserScript==
// @name         tamperOIso - OIer的好帮手
// @namespace    https://www.oiso.cf/
// @version      0.9.1
// @description  在洛谷、Codeforces等网站上提供OI检索服务
// @author       OIso开发团队
// @match        https://www.luogu.com.cn/*
// @match        https://www.oiso.cf/*
// @icon         https://www.oiso.cf/img/favicon.svg
// @grant        none
// ==/UserScript==
(function() {
    'use strict';
    console.log("tamperOIso loaded.");

    function luogu(){
        ;
    }

    function codeforces(){
        ;
    }
    
    function oiso(){
        ;
    }

    if(window.location.href.indexOf("luogu") != -1){
        luogu();
    }else if(window.location.href.indexOf("codeforces") != -1){
        codeforces();
    }else if(window.location.href.indexOf("oiso") != -1){
        oiso();
    }
})();