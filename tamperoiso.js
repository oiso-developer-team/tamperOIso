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
(function () {
    'use strict';
    console.log("tamperOIso loaded.");

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
                        window.location.href = "https://www.oiso.cf/search?q=" + searchBoxInput.value;
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
                suggestionContainer.style.left = '50%';
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

                function gosug(name) {
                    console.log("gosug" + name)
                    $searchBoxInput.val(name);
                    window.open('https://www.oiso.cf/search?q=' + name);
                }

                function getSuggestions() {
                    if (window['sugStatus'] === true) {
                        return;
                    }
                    var myurl = `https://online.oiso.cf/suggestion?q=${searchBoxInput.value}`;
                    console.log(myurl);
                    window['sugStatus'] = true;
                    GM_xmlhttpRequest({
                        method: "get",
                        url: myurl,
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
                        },
                        onload: function (response) {
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
                        },
                        onerror: function (response) {
                            console.log("获取提示信息失败...");
                            window['sugStatus'] = false;
                        }
                    });
                }
            }
        });
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