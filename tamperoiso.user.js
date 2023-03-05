// ==UserScript==
// @name         tamperOIso - OIer的好帮手
// @namespace    http://tampermonkey.net/
// @homepage     https://www.oiso.cf/
// @version      1.0.3
// @description  在洛谷、Codeforces等网站上提供OI检索服务
// @author       OIso开发团队
// @match        https://www.luogu.com.cn/*
// @match        https://www.oiso.cf/*
// @connect      oiso.cf
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.min.js
// @icon         https://www.oiso.cf/img/favicon.svg
// @grant        GM_xmlhttpRequest
// ==/UserScript==
(function () {
    'use strict';

    function msg(modname, msg) {
        console.log("%c[tamperOIso." + modname + "] %c" + msg, "color: #ff7f00", "color: #065279");
    }
    msg("main", "正在加载tamperOIso");

    function refirstTime(){
        localStorage.setItem('firTime', 'true');
    }
    // refirstTime();

    // 检查是否是用户第一次使用
    if (localStorage.getItem('firTime') == null || localStorage.getItem('firTime') == 'true') {
        localStorage.setItem('firTime', 'false');
        // 如果是第一次使用，则弹出欢迎界面
        var welcome = document.createElement('div');
        welcome.id = 'welcome';
        welcome.style.position = 'fixed';
        welcome.style.top = '0';
        welcome.style.left = '0';
        welcome.style.width = '100%';
        welcome.style.height = '100%';
        welcome.style.background = 'rgba(0, 0, 0, 0.5)';
        welcome.style.backdropFilter = 'blur(5px)';
        welcome.style.transition = 'opacity 0.5s';
        welcome.style.opacity = '0';
        welcome.style.zIndex = '1000';
        setTimeout(function () {
            welcome.style.opacity = '1';
        }, 0);
        document.body.appendChild(welcome);

        var welcomeBox = document.createElement('div');
        welcomeBox.id = 'welcomeBox';
        welcomeBox.style.position = 'fixed';
        welcomeBox.style.top = '30%';
        welcomeBox.style.left = '50%';
        welcomeBox.style.transform = 'translate(-50%, -50%)';
        welcomeBox.style.width = '620px';
        welcomeBox.style.height = '400px';
        welcomeBox.style.background = 'white';
        welcomeBox.style.borderRadius = '10px';
        welcomeBox.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
        welcomeBox.style.transition = 'opacity 0.5s';
        welcomeBox.style.opacity = '0';
        welcomeBox.style.zIndex = '1001';
        setTimeout(function () {
            welcomeBox.style.opacity = '1';
        }, 0);
        document.body.appendChild(welcomeBox);

        var welcomeBoxTitle = document.createElement('div');
        welcomeBoxTitle.id = 'welcomeBoxTitle';
        welcomeBoxTitle.style.position = 'absolute';
        welcomeBoxTitle.style.top = '0';
        welcomeBoxTitle.style.left = '0';
        welcomeBoxTitle.style.width = '100%';
        welcomeBoxTitle.style.height = '50px';
        welcomeBoxTitle.style.lineHeight = '50px';
        welcomeBoxTitle.style.textAlign = 'center';
        welcomeBoxTitle.style.fontSize = '20px';
        welcomeBoxTitle.style.fontWeight = 'bold';
        welcomeBoxTitle.style.color = 'white';
        welcomeBoxTitle.style.background = 'linear-gradient(90deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #9400d3)';
        welcomeBoxTitle.style.backgroundSize = '600%';
        welcomeBoxTitle.style.animation = 'gradient 15s ease infinite';
        welcomeBoxTitle.innerHTML = '欢迎使用tamperOIso';
        welcomeBox.appendChild(welcomeBoxTitle);

        var welcomeBoxContent = document.createElement('div');
        welcomeBoxContent.id = 'welcomeBoxContent';
        welcomeBoxContent.style.position = 'absolute';
        welcomeBoxContent.style.top = '50px';
        welcomeBoxContent.style.left = '0';
        welcomeBoxContent.style.width = '100%';
        welcomeBoxContent.style.height = '350px';
        welcomeBoxContent.style.padding = '20px';
        welcomeBoxContent.style.boxSizing = 'border-box';
        welcomeBoxContent.style.fontSize = '16px';
        welcomeBoxContent.style.color = 'black';
        welcomeBoxContent.innerHTML = `tamperOIso是一个OIer的好帮手，它可以在洛谷等网站上提供OI检索服务。<br/>它可以让您查看并参与帖子投票、在任何地方按下 Shift+Space 来搜索，还能支持显示头像挂件。<br/>此界面将不会再显示。强烈建议新手查看<a style="color:blue" href="https://www.amzcd.top/posts/tamperOIso-guide/">新手指南</a>，里面包含了更多关于tamperOIso的用法说明。`;
        welcomeBox.appendChild(welcomeBoxContent);
        
        var welcomeBoxButton = document.createElement('div');
        welcomeBoxButton.id = 'welcomeBoxButton';
        welcomeBoxButton.style.position = 'absolute';
        welcomeBoxButton.style.bottom = '20px';
        welcomeBoxButton.style.right = '20px';
        welcomeBoxButton.style.width = '80px';
        welcomeBoxButton.style.height = '40px';
        welcomeBoxButton.style.lineHeight = '40px';
        welcomeBoxButton.style.textAlign = 'center';
        welcomeBoxButton.style.fontSize = '16px';
        welcomeBoxButton.style.fontWeight = 'bold';
        welcomeBoxButton.style.color = 'white';
        welcomeBoxButton.style.background = 'linear-gradient(90deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #9400d3)';
        welcomeBoxButton.style.backgroundSize = '600%';
        welcomeBoxButton.style.animation = 'gradient 15s ease infinite';
        welcomeBoxButton.style.borderRadius = '10px';
        welcomeBoxButton.style.cursor = 'pointer';
        welcomeBoxButton.innerHTML = '确定';
        welcomeBoxButton.onclick = function () {
            welcome.style.opacity = '0';
            welcomeBox.style.opacity = '0';
            setTimeout(function () {
                document.body.removeChild(welcome);
                document.body.removeChild(welcomeBox);
            }, 500);
        };
        welcomeBox.appendChild(welcomeBoxButton);

        // 获取uid
        // <img data-v-258e49ac="" data-v-0640126c="" src="https://cdn.luogu.com.cn/upload/usericon/222419.png" alt="diyanqi" class="avatar">
        var uid = document.querySelector('.avatar').src.match(/\/(\d+)\./)[1];
        // https://online.oiso.cf/rewards/tamper/report/222419
        var url = 'https://online.oiso.cf/rewards/tamper/report/' + uid;
        requestWithCache(url, function (data) {
            if (data.code == 200) {
                welcomeBoxContent.innerHTML += '<br/><br/>系统监测到您这是第一次使用tamperOIso，感谢您的支持！<b>5</b> 积分已经发放到您的账户中。';
            } else {
                welcomeBoxContent.innerHTML += '<br/><br/>感谢您选择使用 tamperOIso！';
            }
        });
    }

    function requestWithCache(url, callback) {
        // 从缓存中读取数据
        var cache = JSON.parse(localStorage.getItem('cache'));
        if (cache == null) {
            cache = {};
        }
        if (cache[url] != null) {
            msg("requestWithCache", "cache hit.");
            msg("requestWithCache", cache[url]);
            callback(cache[url]);
            if (new Date().getTime() - cache[url].updateTime < 1000 * 60 * 60 * 24) {
                // 缓存数据不超过一天，不需要更新
                return;
            } else {
                // 缓存数据超过一天，需要更新
                msg("requestWithCache",  "but the cache has expired.");
            }
        }
        // 缓存中没有数据，从服务器获取数据
        msg("requestWithCache",  "cache miss.");
        // 蓝色console.log
        msg("requestWithCache",  "url = " + url);
        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            onload: function (response) {
                // 将数据缓存到本地
                const res = { "responseText": response.responseText, "status": response.status, "updateTime": new Date().getTime() };
                cache[url] = res;
                msg("requestWithCache",  "res = " + res);
                localStorage.setItem('cache', JSON.stringify(cache));
                callback(res);
            }
        });
    }

    function getPendant(uid, callback) {
        // 检查本地缓存
        var cache = JSON.parse(localStorage.getItem('pendantCache'));
        if (cache != null && cache["updateTime"] != null && new Date().getTime() - cache["updateTime"] < 1000 * 60 * 60 * 24) {
            msg("getPendant",  "pendant cache hit.");
            msg("getPendant",  cache[uid]);
            if(cache[uid] == undefined || cache[uid] == null) {
                callback({"responseText":"False"});
                return;
            }
            callback({"responseText":cache[uid]});
            return;
        }
        // 本地缓存中没有数据，从服务器获取数据
        msg("getPendant",  "pendant cache miss.");
        GM_xmlhttpRequest({
            method: "GET",
            url: "https://online.oiso.cf/pendant/getall",
            onload: function (response) {
                // 将数据缓存到本地
                const res = JSON.parse(response.responseText);
                cache = res;
                msg("getPendant",  cache);
                cache["updateTime"] = new Date().getTime();
                localStorage.setItem('pendantCache', JSON.stringify(cache));
                if(cache[uid] == undefined || cache[uid] == null) {
                    callback({"responseText":"False"});
                    return;
                }
                callback({"responseText":cache[uid]});
            }
        });
    }

    function clearCache() {
        localStorage.removeItem('cache');
        localStorage.removeItem('pendantCache');
    }
    // clearCache();

    function luogu() {
        // 监听按下shift+space键
        document.addEventListener('keydown', function (event) {
            if (event.keyCode == 32 && event.shiftKey) {
                msg("quickSearch",  "shift+space pressed.");
                if (window['searchBoxOpened'] == true) {
                    // 如果搜索框已经打开，则关闭搜索框
                    window['searchBoxOpened'] = false;
                    document.getElementById('mask').style.opacity = '0';
                    document.getElementById('searchBox').style.opacity = '0';
                    setTimeout(function () {
                        document.body.removeChild(document.getElementById('mask'));
                        document.body.removeChild(document.getElementById('searchBox'));
                    }, 500);
                    return;
                }
                // 记录搜索框已经打开的状态
                window['searchBoxOpened'] = true;
                // 先来一个全屏的黑色遮罩
                var mask = document.createElement('div');
                mask.id = 'mask';
                mask.style.position = 'fixed';
                mask.style.top = '0';
                mask.style.left = '0';
                mask.style.width = '100%';
                mask.style.height = '100%';
                // 毛玻璃效果
                mask.style.background = 'rgba(0, 0, 0, 0.5)';
                mask.style.backdropFilter = 'blur(5px)';
                // 缓慢的出现过渡效果
                mask.style.transition = 'opacity 0.5s';
                mask.style.opacity = '0';
                mask.style.zIndex = '1000';
                setTimeout(function () {
                    mask.style.opacity = '1';
                }, 0);
                document.body.appendChild(mask);

                // 搜索框
                var searchBox = document.createElement('div');
                searchBox.id = "searchBox";
                searchBox.style.position = 'fixed';
                searchBox.style.top = '30%';
                searchBox.style.left = '50%';
                searchBox.style.transform = 'translate(-50%, -50%)';
                // 谷歌搜索框的样式，右边容纳一个搜索按钮，左右两边都是圆的
                searchBox.style.width = '620px';
                searchBox.style.height = '50px';
                searchBox.style.borderRadius = '20px';
                searchBox.style.background = '#fff';
                searchBox.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.2)';
                searchBox.style.transition = 'opacity 0.5s';
                searchBox.style.opacity = '0';
                searchBox.style.zIndex = '1001';
                // 如果系统是暗色模式，则搜索框也是暗色的
                if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                    searchBox.style.background = '#333';
                }
                setTimeout(function () {
                    searchBox.style.opacity = '1';
                }, 0);
                document.body.appendChild(searchBox);

                // 搜索框的输入框
                var searchBoxInput = document.createElement('input');
                searchBoxInput.id = "searchBoxInput";
                searchBoxInput.style.position = 'absolute';
                searchBoxInput.style.top = '0';
                searchBoxInput.style.left = '0';
                searchBoxInput.style.width = '550px';
                searchBoxInput.style.height = '50px';
                searchBoxInput.style.lineHeight = '50px';
                searchBoxInput.style.paddingLeft = '20px';
                searchBoxInput.style.fontSize = '20px';
                searchBoxInput.style.border = 'none';
                searchBoxInput.style.outline = 'none';
                searchBoxInput.style.backgroundColor = 'transparent';
                searchBoxInput.style.borderRadius = '5px 0 0 5px';
                searchBoxInput.style.cursor = 'text';
                searchBoxInput.style.zIndex = '1002';
                searchBoxInput.placeholder = '搜索题目、帖子、题解、博客、用户';
                searchBoxInput.autofocus = true;
                // 如果系统是暗色模式，则文本是白色的
                if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                    searchBoxInput.style.color = '#fff';
                }
                searchBox.appendChild(searchBoxInput);
                // 按下回车键时，跳转到搜索结果页面
                searchBoxInput.addEventListener('keydown', function (event) {
                    if (event.keyCode == 13) {
                        msg("quickSearch",  "enter pressed.");
                        window.open("https://www.oiso.cf/search?q=" + searchBoxInput.value);
                    }
                });
                // 当输入框内容发生变化，getSuggestions函数会被调用
                searchBoxInput.addEventListener('input', function (event) {
                    getSuggestions(searchBoxInput.value);
                });

                // 搜索框的搜索按钮，搜索框图标来自Google
                var searchBoxButton = document.createElement('div');
                searchBoxButton.style.position = 'absolute';
                searchBoxButton.style.top = '0';
                searchBoxButton.style.right = '0';
                searchBoxButton.style.width = '50px';
                searchBoxButton.style.height = '50px';
                searchBoxButton.style.lineHeight = '50px';
                searchBoxButton.style.textAlign = 'center';
                searchBoxButton.style.fontSize = '20px';
                searchBoxButton.style.fontWeight = 'bold';
                searchBoxButton.style.cursor = 'pointer';
                searchBoxButton.style.fill = 'currentColor';
                searchBoxButton.style.zIndex = '1002';
                // svg图标来自Google
                searchBoxButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>';
                // 如果系统是暗色模式，则图标是白色的
                if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                    searchBoxButton.style.color = '#fff';
                }
                // 向下偏移一点，使得图标居中
                searchBoxButton.style.transform = 'translateY(5px)';
                searchBoxButton.onclick = function () {
                    window.open('https://www.oiso.cf/search?q=' + searchBoxInput.value);
                };
                searchBox.appendChild(searchBoxButton);

                // 智能提示候选列表
                const styleStr = `#suggestionContainer div {
                    /* border-radius: 15px; */
                    display: -webkit-box;
                    -webkit-box-orient: vertical;
                    -webkit-line-clamp: 1;
                    overflow: hidden;
                    clear: both;
                    height: 30px;
                    padding-left: 20px;
                    line-height: 30px;
                    cursor: pointer;
                    background: rgba(0, 0, 0, 0.09);
                    color: rgba(255, 255, 255, .8);
                    transition: .25s;
                }
                #suggestionContainer {
                    overflow: hidden;
                    z-index: 114514;
                    border-radius: 15px;
                    transition: .25s;
                    -webkit-backdrop-filter: blur(30px) saturate(1.25);
                    backdrop-filter: blur(30px) saturate(1.25);
                    box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;
                }
                #suggestionContainer div:hover {
                    background: rgba(0, 0, 0, 0.27);
                    color: rgba(255, 255, 255, .8);
                    transition: .25s;
                }`
                var style = document.createElement('style');
                style.type = 'text/css';
                style.innerHTML = styleStr;
                document.getElementsByTagName('head')[0].appendChild(style);
                var suggestionContainer = document.createElement('div');
                suggestionContainer.id = 'suggestionContainer';
                suggestionContainer.style.height = 'auto';
                suggestionContainer.style.opacity = '1';
                suggestionContainer.style.display = 'block';
                suggestionContainer.style.position = 'absolute';
                suggestionContainer.style.top = '50px';
                suggestionContainer.style.transform = 'translateX(-50%);';
                suggestionContainer.style.width = '620px';
                // 如果系统是暗色模式，则背景是灰色的
                if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                    suggestionContainer.style.backgroundColor = '#333';
                }
                searchBox.appendChild(suggestionContainer);

                function quit() {
                    mask.style.opacity = '0';
                    searchBox.style.opacity = '0';
                    window['searchBoxOpened'] = false;
                    setTimeout(function () {
                        document.body.removeChild(mask);
                        document.body.removeChild(searchBox);
                    }, 500);
                }

                mask.addEventListener('click', function () {
                    quit();
                });
                document.addEventListener('keydown', function (event) {
                    if (event.keyCode == 27) {
                        quit();
                    }
                });

                const script_str = `function gosug(name) {
                    document.getElementById("searchBoxInput").value = (name);
                    window.open('https://www.oiso.cf/search?q=' + name);
                }`;
                var script = document.createElement('script');
                script.type = 'text/javascript';
                script.innerHTML = script_str;
                document.getElementsByTagName('body')[0].appendChild(script);

                function getSuggestions() {
                    if (window['sugStatus'] === true) {
                        return;
                    }
                    var myurl = `https://online.oiso.cf/suggestion?q=${searchBoxInput.value}`;
                    msg("getSuggestions",  myurl);
                    window['sugStatus'] = true;
                    requestWithCache(myurl, function (response) {
                        var data = JSON.parse(response.responseText);
                        msg("getSuggestions",  data);
                        let hits = data.hits.hits;
                        $("#suggestionContainer").empty();
                        let sel = $("#suggestionContainer");
                        for (const hit in hits) {
                            msg("getSuggestions",  hits[hit]._id);
                            sel.append(`<div style="height:35px;" onclick="gosug('${hits[hit]._source.name}')">${hits[hit]._source.name}</div>`);
                        }
                        window['sugStatus'] = false;
                    });
                }
            }
        });

        function render_avatar_pendant() {
            var avatars = document.getElementsByClassName('am-comment-avatar');
            for (let i = 0; i < avatars.length; i++) {
                const avatar = avatars[i];
                msg("render_avatar_pendant",  avatar);
                const uid = avatar.src.split('/')[5].split('.')[0];
                msg("render_avatar_pendant",  uid);
                // avatar 是一个 img 标签
                // 添加一张头像挂件图片，刚好覆盖在头像上面
                var avatarPendant = document.createElement('img');
                getPendant(uid, function (response) {
                    if (response.responseText != 'False') {
                        msg("render_avatar_pendant",  response.responseText);
                        avatarPendant.src = response.responseText;
                        // avatarPendant.style.position = 'absolute';
                        avatarPendant.className = 'am-comment-avatar-pendant';
                        avatarPendant.style.top = '0';
                        avatarPendant.style.left = '0';
                        avatarPendant.style.height = '48px';
                        // 中心放大
                        avatarPendant.style.transform = 'scale(1.35)';
                        avatarPendant.style.marginLeft = '-48px';
                        avatarPendant.style.borderRadius = '5%';
                        avatarPendant.style.opacity = '0.75';
                        // 父元素的后面插入
                        avatar.parentNode.insertBefore(avatarPendant, avatar.nextSibling);
                    }
                });
            }
            var my_avatar = document.getElementsByClassName('avatar')[0];
            if (my_avatar) { // 右上角的头像
                const uid = my_avatar.src.split('/')[5].split('.')[0];
                msg("render_avatar_pendant",  "my_avatar", uid);
                getPendant(uid, function (response) {
                    msg("render_avatar_pendant",  response.responseText);
                    if (response.responseText != 'False') {
                        var my_avatar_pendant = document.createElement('img');
                        my_avatar_pendant.src = response.responseText;
                        my_avatar_pendant.className = 'am-comment-avatar-pendant';
                        my_avatar_pendant.style.top = '0';
                        my_avatar_pendant.style.right = '0';
                        my_avatar_pendant.style.height = '35px';
                        my_avatar_pendant.style.transform = 'scale(1.35)';
                        my_avatar_pendant.style.borderRadius = '5%';
                        my_avatar_pendant.style.opacity = '0.75';
                        my_avatar_pendant.style.position = 'absolute';
                        my_avatar.parentNode.insertBefore(my_avatar_pendant, my_avatar.nextSibling);
                    }
                });
            }
            if (location.href.indexOf("https://www.luogu.com.cn/user/") != -1) {
                var uid;
                if (document.getElementsByClassName('avatar')[1]) {
                    uid = document.getElementsByClassName('avatar')[1].src.split('/')[5].split('.')[0];
                    msg("render_avatar_pendant",  uid);
                    getPendant(uid, function (response) {
                        msg("render_avatar_pendant",  response.responseText);
                        if (response.responseText != 'False') {
                            var my_avatar_pendant = document.createElement('img');
                            my_avatar_pendant.src = response.responseText;
                            my_avatar_pendant.className = 'am-comment-avatar-pendant';
                            my_avatar_pendant.style.bottom = '25px';
                            my_avatar_pendant.style.left = '25px';
                            my_avatar_pendant.style.height = '64px';
                            my_avatar_pendant.style.transform = 'scale(1.35)';
                            my_avatar_pendant.style.borderRadius = '5%';
                            my_avatar_pendant.style.opacity = '0.75';
                            my_avatar_pendant.style.position = 'absolute';
                            document.getElementsByClassName('avatar')[1].parentNode.insertBefore(my_avatar_pendant, document.getElementsByClassName('avatar')[1].nextSibling);
                        }
                    });
                }
                if (document.getElementsByClassName('avatar')[2]) {
                    for (let i = 2; i < document.getElementsByClassName('avatar').length; i++) {
                        getPendant(uid, function (response) {
                            msg("render_avatar_pendant",  response.responseText);
                            if (response.responseText != 'False') {
                                const element = document.getElementsByClassName('avatar')[i];
                                var my_avatar_pendant = document.createElement('img');
                                my_avatar_pendant.src = response.responseText;
                                my_avatar_pendant.className = 'am-comment-avatar-pendant';
                                my_avatar_pendant.style.top = '10px';
                                my_avatar_pendant.style.left = '0px';
                                my_avatar_pendant.style.height = '60px';
                                my_avatar_pendant.style.transform = 'scale(1.35)';
                                my_avatar_pendant.style.borderRadius = '5%';
                                my_avatar_pendant.style.opacity = '0.75';
                                my_avatar_pendant.style.position = 'absolute';
                                element.parentNode.insertBefore(my_avatar_pendant, element.nextSibling);
                            }
                        });
                    }
                }
            } else if (location.href.indexOf("https://www.luogu.com.cn/record/list") != -1) {
                for (let i = 1; i < document.getElementsByClassName('avatar').length; i++) {
                    const element = document.getElementsByClassName('avatar')[i];
                    const uid = document.getElementsByClassName('avatar')[i].children[0].src.split('/')[5].split('.')[0];
                    msg("render_avatar_pendant",  uid);
                    getPendant(uid, function (response) {
                        msg("render_avatar_pendant",  response.responseText);
                        if (response.responseText != 'False') {
                            var my_avatar_pendant = document.createElement('img');
                            my_avatar_pendant.src = response.responseText;
                            my_avatar_pendant.className = 'am-comment-avatar-pendant';
                            my_avatar_pendant.style.marginLeft = '-45px';
                            my_avatar_pendant.style.marginTop = '12px';
                            my_avatar_pendant.style.height = my_avatar_pendant.style.width = '35px';
                            my_avatar_pendant.style.transform = 'scale(1.35)';
                            my_avatar_pendant.style.borderRadius = '5%';
                            my_avatar_pendant.style.opacity = '0.75';
                            element.parentNode.insertBefore(my_avatar_pendant, element.nextSibling);
                        }
                    });
                }
            } else if (location.href.indexOf("https://www.luogu.com.cn/problem/solution/") != -1) {
                for (let i = 1; i < document.getElementsByClassName('avatar').length; i++) {
                    const element = document.getElementsByClassName('avatar')[i];
                    const uid = document.getElementsByClassName('avatar')[i].src.split('/')[5].split('.')[0];
                    msg("render_avatar_pendant",  uid);
                    getPendant(uid, function (response) {
                        msg("render_avatar_pendant",  response.responseText);
                        if (response.responseText != 'False') {
                            var my_avatar_pendant = document.createElement('img');
                            my_avatar_pendant.src = response.responseText;
                            my_avatar_pendant.className = 'am-comment-avatar-pendant';
                            my_avatar_pendant.style.marginLeft = '-3em';
                            my_avatar_pendant.style.marginTop = '0px';
                            my_avatar_pendant.style.height = my_avatar_pendant.style.width = '2em';
                            my_avatar_pendant.style.transform = 'scale(1.35)';
                            my_avatar_pendant.style.borderRadius = '5%';
                            my_avatar_pendant.style.opacity = '0.75';
                            element.parentNode.insertBefore(my_avatar_pendant, element.nextSibling);
                        }
                    });
                }
            }
        }

        // 头像挂件服务
        // 如果是首页
        if (window.location.href != "https://www.luogu.com.cn" || window.location.href != "https://www.luogu.com.cn/") {
            setTimeout(function () {
                render_avatar_pendant();
            }, 750);
        } else {
            render_avatar_pendant();
        }

        // 检测页面url变化（即便是#后面的变化）
        window.addEventListener('click', function (e) {
            msg("reRender",  e.target);
            // 重新渲染头像挂件
            setTimeout(function () {
                var avatarPendants = document.getElementsByClassName('am-comment-avatar-pendant');
                for (let i = 0; i < avatarPendants.length; i++) {
                    const avatarPendant = avatarPendants[i];
                    avatarPendant.remove();
                }
                render_avatar_pendant();
            }, 750);
        });

        // 正则匹配url https://www.luogu.com.cn/discuss/<数字>
        var reg = new RegExp("https://www.luogu.com.cn/discuss/[0-9]+");
        if (reg.test(window.location.href)) {
            const discussId = window.location.href.match(/[0-9]+/)[0];
            setTimeout(function () {
                const pannel = document.getElementsByClassName('am-panel')[0];
                pannel.children[0].innerHTML += `
                <a id="forbutton" class="am-btn am-btn-primary am-btn-sm" style="margin-top: 5px;" num=0>👍_次点赞</a><span>&nbsp;</span><a class="am-btn am-btn-danger am-btn-sm" name="save-discuss" id="againstbutton" style="margin-top: 5px;" num=0>👎_次踩</a>
                <br>
                <button id="savebbsbutton" class="am-btn am-btn-success am-btn-sm" style="margin-top: 5px;">点击保存</button><span>&nbsp;</span><a class="am-btn am-btn-warning am-btn-sm" name="save-discuss" target='_blank' href="https://lgbbs.oiso.cf/show.php?url=https://www.luogu.com.cn/discuss/${discussId}" style="margin-top: 5px;">前往备份</a>
                `;
                document.getElementById("savebbsbutton").addEventListener("click", function () {
                    document.getElementById("savebbsbutton").innerHTML = "保存中……";
                    msg("bbs",  "savebbs~!");
                    const url = `https://lgbbs.oiso.cf/save.php?url=https://www.luogu.com.cn/discuss/${discussId}?page=1`;
                    GM_xmlhttpRequest({
                        method: "GET",
                        url: url,
                        onload: function (response) {
                            if (response.responseText == 'success') {
                                document.getElementById("savebbsbutton").innerHTML = "保存成功！";
                                setTimeout(function () {
                                    document.getElementById("savebbsbutton").innerHTML = "再次保存";
                                }, 1000);
                            } else {
                                document.getElementById("savebbsbutton").innerHTML = "保存失败qwq";
                                setTimeout(function () {
                                    document.getElementById("savebbsbutton").innerHTML = "重新保存";
                                }, 1000);
                            }
                        }
                    });
                });
                document.getElementById("forbutton").addEventListener("click", function () {
                    document.getElementById("forbutton").innerHTML = "赞成中……";
                    msg("bbs",  "for~!");
                    const url = `//online.oiso.cf/lgbbs/for?id=${discussId}`;
                    GM_xmlhttpRequest({
                        method: "GET",
                        url: url,
                        onload: function (response) {
                            if (JSON.parse(response.responseText).code == 200) {
                                document.getElementById("forbutton").innerHTML = "点赞成功！";
                                setTimeout(function () {
                                    // 获取当前点赞数
                                    const forCount = document.getElementById("forbutton").getAttribute("num");
                                    // 设置新的点赞数
                                    document.getElementById("forbutton").setAttribute("num", parseInt(forCount) + 1);
                                    // 设置新的点赞数
                                    document.getElementById("forbutton").innerHTML = `👍${parseInt(forCount) + 1}次点赞`;
                                }, 1000);
                            } else {
                                document.getElementById("forbutton").innerHTML = "赞成失败qwq";
                                setTimeout(function () {
                                    // 获取当前点赞数
                                    const forCount = document.getElementById("forbutton").getAttribute("num");
                                    // 设置新的点赞数
                                    document.getElementById("forbutton").innerHTML = `👍${forCount}次点赞`;
                                }, 1000);
                            }
                        }
                    });
                });
                document.getElementById("againstbutton").addEventListener("click", function () {
                    document.getElementById("againstbutton").innerHTML = "反对中……";
                    msg("bbs",  "against~!");
                    const url = `//online.oiso.cf/lgbbs/against?id=${discussId}`;
                    GM_xmlhttpRequest({
                        method: "GET",
                        url: url,
                        onload: function (response) {
                            if (JSON.parse(response.responseText).code == 200) {
                                document.getElementById("againstbutton").innerHTML = "踩成功！";
                                setTimeout(function () {
                                    // 获取当前点赞数
                                    const againstCount = document.getElementById("againstbutton").getAttribute("num");
                                    // 设置新的点赞数
                                    document.getElementById("againstbutton").setAttribute("num", parseInt(againstCount) + 1);
                                    // 设置新的点赞数
                                    document.getElementById("againstbutton").innerHTML = `👎${parseInt(againstCount) + 1}次踩`;
                                }, 1000);
                            } else {
                                document.getElementById("againstbutton").innerHTML = "反对失败qwq";
                                setTimeout(function () {
                                    // 获取当前点赞数
                                    const againstCount = document.getElementById("againstbutton").getAttribute("num");
                                    // 设置新的点赞数
                                    document.getElementById("againstbutton").innerHTML = `👎${againstCount}次踩`;
                                }, 1000);
                            }
                        }
                    });
                });
                GM_xmlhttpRequest({
                    method: "GET",
                    url: `//online.oiso.cf/lgbbs/get?id=${discussId}`,
                    onload: function (response) {
                        msg("bbs",  response.responseText);
                        if (JSON.parse(response.responseText).code == 200) {
                            const data = JSON.parse(response.responseText);
                            document.getElementById("forbutton").setAttribute("num", data.for);
                            document.getElementById("forbutton").innerHTML = `👍${data.for}次点赞`;
                            document.getElementById("againstbutton").setAttribute("num", data.against);
                            document.getElementById("againstbutton").innerHTML = `👎${data.against}次踩`;
                        }
                    }
                });
            }, 750);
        }

        // 在帖子链接右边显示赞/踩数量
        if (true) {
            setTimeout(function () {
                // 获取所有 /discuss/show?postid=<数字> 的<a>标签
                const discussList = document.querySelectorAll("a[href^='/discuss/show?postid=']");
                // 遍历所有的帖子
                var ids = [];
                for (let i = 0; i < discussList.length; i++) {
                    // 获取帖子的id
                    const discussId = discussList[i].getAttribute("href").split("=")[1];
                    // 添加到ids数组中
                    ids.push(discussId);
                }
                // 获取这些帖子的赞/踩
                GM_xmlhttpRequest({
                    method: "POST",
                    url: "//online.oiso.cf/lgbbs/getlist",
                    data: JSON.stringify(ids),
                    headers: {
                        "Content-Type": "application/json"
                    },
                    onload: function (response) {
                        msg("bbs",  response.responseText);
                        if (JSON.parse(response.responseText).code == 200) {
                            const data = JSON.parse(response.responseText);
                            // 遍历所有的帖子
                            for (let i = 0; i < discussList.length; i++) {
                                // 获取帖子的id
                                const discussId = discussList[i].getAttribute("href").split("=")[1];
                                // 获取帖子的赞/踩
                                const discussData = data[discussId];
                                // 获取帖子的标题
                                const discussTitle = discussList[i].innerHTML;
                                // 设置新的标题
                                discussList[i].innerHTML = `${discussTitle} <div style="float:right;">[&#8593;${discussData.for} &#8595;${discussData.against}]</div>`;
                            }
                        }
                    }
                });
            }, 0);
        }

        // 刷新缓存按钮
        setTimeout(function () {
            msg("clearCache",  "Button added!");
            document.getElementsByClassName("info")[document.getElementsByClassName("info").length-1].innerHTML += `<button class="am-btn am-btn-primary am-btn-sm" id="refreshcache" style="float:right;">刷新 tamperOIso 缓存</button>`;
            document.getElementById("refreshcache").addEventListener("click", function () {
                clearCache();
                window.location.reload();
            });
        }, 100);
    }

    function codeforces() {
        ;
    }

    function oiso() {
        ;
    }

    if (window.location.href.indexOf("luogu") != -1) {
        luogu();
    } else if (window.location.href.indexOf("codeforces") != -1) {
        codeforces();
    } else if (window.location.href.indexOf("oiso") != -1) {
        oiso();
    }
})();
