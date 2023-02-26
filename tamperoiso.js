// ==UserScript==
// @name         tamperOIso - OIer的好帮手
// @namespace    https://www.oiso.cf/
// @version      0.9.2
// @description  在洛谷、Codeforces等网站上提供OI检索服务
// @author       OIso开发团队
// @match        https://www.luogu.com.cn/*
// @match        https://www.oiso.cf/*
// @connect      online.oiso.cf
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.min.js
// @icon         https://www.oiso.cf/img/favicon.svg
// @grant        GM_xmlhttpRequest
// ==/UserScript==
(function () {
    'use strict';
    console.log("tamperOIso loaded.");

    function requestWithCache(url, callback) {
        // 从缓存中读取数据
        var cache = JSON.parse(localStorage.getItem('cache'));
        if (cache == null) {
            cache = {};
        }
        if (cache[url] != null && new Date().getTime() - cache[url].updateTime < 1000 * 60 * 60 * 24) {
            console.log("cache hit.");
            console.log(cache[url]);
            callback(cache[url]);
            return;
        }
        // 缓存中没有数据，从服务器获取数据
        console.log("cache miss.");
        // 蓝色console.log
        console.log("%c[requestWithCache] url = " + url, "color: blue");
        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            onload: function (response) {
                // 将数据缓存到本地
                const res = {"responseText":response.responseText, "status":response.status, "updateTime":new Date().getTime()};
                cache[url] = res;
                console.log("%c[requestWithCache] res = " + res, "color: blue");
                localStorage.setItem('cache', JSON.stringify(cache));
                callback(res);
            }
        });
    }

    function clearCache() {
        localStorage.removeItem('cache');
    }
    // clearCache();

    function luogu() {
        // 监听按下shift+space键
        document.addEventListener('keydown', function (event) {
            if (event.keyCode == 32 && event.shiftKey) {
                console.log("shift+space pressed.");
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
                searchBoxInput.placeholder = '搜索题目、题解、博客、用户';
                searchBoxInput.autofocus = true;
                // 如果系统是暗色模式，则文本是白色的
                if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                    searchBoxInput.style.color = '#fff';
                }
                searchBox.appendChild(searchBoxInput);
                // 按下回车键时，跳转到搜索结果页面
                searchBoxInput.addEventListener('keydown', function (event) {
                    if (event.keyCode == 13) {
                        console.log("enter pressed.");
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
                    console.log("gosug" + name)
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
                    console.log(myurl);
                    window['sugStatus'] = true;
                    // GM_xmlhttpRequest({
                    //     method: "get",
                    //     url: myurl,
                    //     headers: {
                    //         "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
                    //     },
                    //     onload: function (response) {
                    //         var data = JSON.parse(response.responseText);
                    //         console.log(data);
                    //         let hits = data.hits.hits;
                    //         $("#suggestionContainer").empty();
                    //         let sel = $("#suggestionContainer");
                    //         for (const hit in hits) {
                    //             console.log(hits[hit]._id);
                    //             sel.append(`<div style="height:35px;" onclick="gosug('${hits[hit]._source.name}')">${hits[hit]._source.name}</div>`);
                    //         }
                    //         window['sugStatus'] = false;
                    //     },
                    //     onerror: function (response) {
                    //         console.log("获取提示信息失败...");
                    //         window['sugStatus'] = false;
                    //     }
                    // });
                    requestWithCache(myurl, function (response) {
                        var data = JSON.parse(response.responseText);
                        console.log(data);
                        let hits = data.hits.hits;
                        $("#suggestionContainer").empty();
                        let sel = $("#suggestionContainer");
                        for (const hit in hits) {
                            console.log(hits[hit]._id);
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
                console.log(avatar);
                const uid = avatar.src.split('/')[5].split('.')[0];
                console.log(uid);
                // avatar 是一个 img 标签
                // 添加一张头像挂件图片，刚好覆盖在头像上面
                var avatarPendant = document.createElement('img');
                requestWithCache("https://online.oiso.cf/pendant/get?uid=" + uid, function (response) {
                    if (response.responseText != 'False') {
                        console.log(response.responseText);
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
                console.log("my_avatar", uid);
                requestWithCache("https://online.oiso.cf/pendant/get?uid=" + uid, function (response) {
                    console.log(response.responseText);
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
                    console.log(uid);
                    requestWithCache("https://online.oiso.cf/pendant/get?uid=" + uid, function (response) {
                        console.log(response.responseText);
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
                        requestWithCache("https://online.oiso.cf/pendant/get?uid=" + uid, function (response) {
                            console.log(response.responseText);
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
                    console.log(uid);
                    requestWithCache("https://online.oiso.cf/pendant/get?uid=" + uid, function (response) {
                        console.log(response.responseText);
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
                    console.log(uid);
                    requestWithCache("https://online.oiso.cf/pendant/get?uid=" + uid, function (response) {
                        console.log(response.responseText);
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
        // 检测点击事件
        document.addEventListener('click', function (e) {
            // 如果超链接
            console.log(e);
            if (e.target.tagName == 'SPAN') {
                // 重新渲染头像挂件
                setTimeout(function () {
                    var avatarPendants = document.getElementsByClassName('am-comment-avatar-pendant');
                    for (let i = 0; i < avatarPendants.length; i++) {
                        const avatarPendant = avatarPendants[i];
                        avatarPendant.remove();
                    }
                    render_avatar_pendant();
                }, 750);
            } else if (e.target.tagName == 'A') {
                // 重新渲染头像挂件
                setTimeout(function () {
                    var avatarPendants = document.getElementsByClassName('am-comment-avatar-pendant');
                    for (let i = 0; i < avatarPendants.length; i++) {
                        const avatarPendant = avatarPendants[i];
                        avatarPendant.remove();
                    }
                    render_avatar_pendant();
                }, 1500);
            }
        });

        // 正则匹配url https://www.luogu.com.cn/discuss/<数字>
        var reg = new RegExp("https://www.luogu.com.cn/discuss/[0-9]+");
        if (reg.test(window.location.href)) {
            setTimeout(function () {
                const discussId = window.location.href.match(/[0-9]+/)[0];
                const pannel = document.getElementsByClassName('am-panel')[0];
                pannel.innerHTML += `<p>
                <a class="am-btn am-btn-primary am-btn-sm" style="margin-top: 5px;" target='_blank' href="https://lgbbs.oiso.cf/save.php?url=https://www.luogu.com.cn/discuss/${discussId}?page=1">赞成本帖</a><span>&nbsp;</span><a class="am-btn am-btn-danger am-btn-sm" name="save-discuss" target='_blank' href="https://lgbbs.oiso.cf/show.php?url=https://www.luogu.com.cn/discuss/${discussId}" style="margin-top: 5px;">踩一脚</a>
                <br>
                <a class="am-btn am-btn-success am-btn-sm" style="margin-top: 5px;" target='_blank' href="https://lgbbs.oiso.cf/save.php?url=https://www.luogu.com.cn/discuss/${discussId}?page=1">保存帖子</a><span>&nbsp;</span><a class="am-btn am-btn-warning am-btn-sm" name="save-discuss" target='_blank' href="https://lgbbs.oiso.cf/show.php?url=https://www.luogu.com.cn/discuss/${discussId}" style="margin-top: 5px;">查看备份</a>
                </p>`;
            }, 750);
        }
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
        oiso();GM_xmlhttpRequest
    }
})();