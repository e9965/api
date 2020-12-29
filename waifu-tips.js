const initLive2dData = () => {

    //初始位置，默认左上角，与下面的 目标位置 搭配修改
    $(".waifu").css({
        'top': 0,
        'left': 0
    });

    // 隐藏看板娘后的选项区域
    const live2dHideBtn = (function () {
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            return
        }

        let isShow = false, // 当前是否正在显示
            lock = false; // 动画过程中，锁定状态

        let $btn = $('#waifu-btn');

        let show = function () {
            if (lock) return;
            if (!isShow) $btn.addClass('load');
            isShow = true;
        }

        let hide = function () {
            if (lock) return;
            if (isShow) {
                $btn.removeClass('load')
                isShow = false
            }
        }

        let runAway = function () {
            lock = true
            $btn.addClass('ani-leave')

            setTimeout(function () {
                $btn.removeClass('ani-leave').addClass('leaved')
            }, 390)

            setTimeout(function () {
                $btn.addClass('ending')
            }, 120)

            setTimeout(function () {
                $btn.removeClass('load')
            }, 1500);

            setTimeout(function () {
                lock = false
                isShow = false
                $btn.removeClass('leaved ending');
            }, 2000);
        };

        $btn.click(runAway);

        return {
            show,
            hide,
            runAway
        }
    })();

    // 是否允许出现 2018.playwater 模型
    const showR18Model = true;

    const avaiableIds = ['2017.summer.normal1', '2019.bls', '2020.newyear',
        '2016.xmas2', '2019.summer', '2017.newyear', '2017.valley', '2019.deluxe2',
        '2018.bls-winter', '2017.cba-normal', '2018.lover', '2018.spring',
        '2017.school', '2017.summer.normal2', '2017.summer.super1', '2017.vdays',
        '2017.tomo-bukatsu.low', '2017.summer.super2', 'default.v2', '2017.tomo-bukatsu.high',
        '2018.bls-summer', '2019.deluxe1', '2016.xmas1', '2017.cba-super', '2018.playwater'
    ]
    let waifu_display = localStorage.getItem('waifu-display');
    if (waifu_display === "none") {
        $('.waifu').hide();
        live2dHideBtn.show();
    }
    // 开关被打开时
    $('.waifu-btn').click(function () {
        localStorage.removeItem('waifu-display');
        $('.waifu').show();
        // $('.waifu-btn').hide();
        showMessage('兔然出现~', 4000)
    });
    // 点击返回主页按钮
    $('.waifu-tool .wt-home').click(function () {
        try {
            if (typeof (ajax) === "function") {
                ajax(window.location.protocol + '//' + window.location.hostname + '/', "pagelink")
            } else {
                window.location = window.location.protocol + '//' + window.location.hostname + '/'
            }
        } catch (e) {}
    });
    // 随机一句话
    $('.waifu-tool .wt-comments').click(function () {
        showHitokoto()
    });
    // 详情页面
    $('.waifu-tool .wt-info-circle').click(function () {
        window.open('https://cxlm.work/archives/add-live2d-2233');
    });
    // 拍照页面
    $('.waifu-tool .wt-camera').click(function () {
        showMessage('照片可爱吗？', 5000);
        window.Live2D.captureName = model_p + '.png';
        window.Live2D.captureFrame = true
    });
    // 关闭按钮
    $('.waifu-tool .wt-close').click(function () {
        localStorage.setItem('waifu-display', 'none');
        showMessage('それじゃあまたね', 2000);
        window.setTimeout(function () {
            $('.waifu').hide();
            live2dHideBtn.show();
        }, 1000)
    });
    // 切换角色
    var model_p = 22,
        m22_id = m33_id = 0;
    $('.waifu-tool .wt-drivers-license-o').click(function () {
        if (model_p === 22) {
            loadlive2d('live2d', 'https://e9965.github.io/api' + '/22.' + avaiableIds[m22_id] + '.config.json');
            model_p = 33;
            showMessage('哟！想我了？', 4000)
        } else {
            loadlive2d('live2d', 'https://e9965.github.io/api' + '/33.' + avaiableIds[m33_id] + '.config.json');
            model_p = 22;
            showMessage('我回来啦！', 4000)
        }
    });
    // 换装按钮
    $('.waifu-tool .wt-street-view').click(function () {
        let border = avaiableIds.length;
        if (!showR18Model) {
            border -= 1;
        }
        if (model_p === 22) {
            let oldId = m33_id;
            m33_id += ~~(Math.random(border));
            if (oldId === m33_id) {
                m33_id = (m33_id + 1) % border;
            }
            loadlive2d('live2d', 'https://e9965.github.io/api' + '/33.' + avaiableIds[m33_id] + '.config.json')
        } else {
            let oldId = m22_id;
            m22_id += ~~(Math.random(border));
            if (oldId === m22_id) {
                m22_id = (m22_id + 1) % border;
            }
            loadlive2d('live2d', 'https://e9965.github.io/api' + '/22.' + avaiableIds[m22_id] + '.config.json')
        }
        if (border === avaiableIds.length - 1) {
            showMessage('変態！見ないで！')
        } else {
            showMessage('怎么样？', 4000);
        }
    });
    // 剪贴板监听
    $(document).on('copy', function () {
        showMessage('转载要记得加上出处哦~', 8000)
    });
    // 响应式
    $(window).resize(function () {
        $(".waifu").css('top', window.innerHeight - 250)
    });

    function showHitokoto() {
        $.get("https://v1.jinrishici.com/all.txt", function (result) {
            showMessage(result)
        })
    }

    function showMessage(a, b) {
        if (b == null) b = 10000;
        jQuery(".waifu-tips").hide().stop();
        jQuery(".waifu-tips").html(a);
        jQuery(".waifu-tips").fadeTo("10", 1);
        jQuery(".waifu-tips").fadeOut(b)
    }
    (function () {
        var text;
        var SiteIndexUrl = window.location.protocol + '//' + window.location.hostname + '/';
        if (window.location.href == SiteIndexUrl) {
            var now = (new Date()).getHours();
            if (now <= 5) {
                text = '你是守夜冠军吗？这么晚还不睡觉，明天起的来嘛'
            } else if (now > 5 && now <= 7) {
                text = '早上好！新的一天就要开始了'
            } else if (now > 7 && now <= 11) {
                text = '上午好！不要久坐，多起来走动走动哦！'
            } else if (now > 11 && now <= 14) {
                text = '中午了，赶紧开饭吧！'
            } else if (now > 14 && now <= 17) {
                text = '午后很容易犯困呢，今天的目标完成了吗？'
            } else if (now > 17 && now <= 19) {
                text = '傍晚了！窗外夕阳的景色很美丽呢，最美不过夕阳红~'
            } else if (now > 19 && now <= 21) {
                text = '晚上好，今天过得怎么样？'
            } else if (now > 21) {
                text = '已经这么晚了呀，早点休息吧，晚安~'
            } else {
                text = '嗨~ 快来逗我玩吧！'
            }
        } else {
            if (document.referrer !== '') {
                var referrer = document.createElement('a');
                referrer.href = document.referrer;
                var domain = referrer.hostname.split('.')[1];
                if (window.location.hostname == referrer.hostname) {
                    text = '欢迎来到<span style="color:#0099cc;">『' + document.title.split(' - ')[0] + '』</span>'
                } else if (domain == 'baidu') {
                    text = 'Hello! 来自 百度搜索 的朋友<br>你是搜索 <span style="color:#0099cc;">' + referrer.search.split('&wd=')[1].split('&')[0] + '</span> 找到的我吗？'
                } else if (domain == 'so') {
                    text = 'Hello! 来自 360搜索 的朋友<br>你是搜索 <span style="color:#0099cc;">' + referrer.search.split('&q=')[1].split('&')[0] + '</span> 找到的我吗？'
                } else if (domain == 'google') {
                    text = 'Hello! 来自 谷歌搜索 的朋友<br>欢迎阅读<span style="color:#0099cc;">『' + document.title.split(' - ')[0] + '』</span>'
                } else {
                    text = 'Hello! 来自 <span style="color:#0099cc;">' + referrer.hostname + '</span> 的朋友'
                }
            } else {
                text = '欢迎阅读<span style="color:#0099cc;">『' + document.title.split(' - ')[0] + '』</span>'
            }
        }
        //目标位置，默认左下角
        $(".waifu").animate({
            top: $(window).height() - 250,
            left: 0
        }, 800);
        showMessage(text, 8000)
    })();
    $("#live2d").mouseover(function () {
        msgs = ["你要干嘛呀？", "要姐姐陪你玩吗？", "喵喵喵？", "怕怕", "搞啥哦(⊙﹏⊙)"];
        var i = Math.floor(Math.random() * msgs.length);
        showMessage(msgs[i])
    });
    jQuery(document).ready(function () {
        // 初始化
        loadlive2d('live2d', 'https://e9965.github.io/api' + '/33.2019.summer.config.json');
    });
    jQuery(document).ready(function ($) {
        $('#search-box').mouseover(function () {
            showMessage('点击它可以回到顶部哦')
        });
        $('.gotop-box').mouseover(function () {
            showMessage('要回到开始的地方么？')
        });
        $('.waifu-tool .wt-home').mouseover(function () {
            showMessage('回到首页？')
        });
        $('.waifu-tool .wt-comments').mouseover(function () {
            showMessage('要让我瞎说了吗？')
        });
        $('.waifu-tool .wt-drivers-license-o').mouseover(function () {
            if (model_p === 22) {
                showMessage('要见见我的姐姐嘛')
            } else {
                showMessage('什么？服务不满意吗？')
            }
        });
        $('.waifu-tool .wt-street-view').mouseover(function () {
            showMessage('要换装吗？')
        });
        $('.waifu-tool .wt-camera').mouseover(function () {
            showMessage('要拍照啦？ワクワク！')
        });
        $('.waifu-tool .wt-info-circle').mouseover(function () {
            showMessage('想知道更多关于我的事么？')
        });
        $('.waifu-tool .wt-close').mouseover(function () {
            showMessage('到了要说再见的时候了吗')
        });
        $(document).on("click", "a.post-title-link", function () {
            showMessage('加载<span style="color:#0099cc;">' + $(this).text() + '</span>中...请稍候', 600)
        });
        $(document).on("mouseover", "a.post-title-link", function () {
            showMessage('要看看<span style="color:#0099cc;">' + $(this).text() + '</span>么？')
        });
        $(document).on("mouseover", "div.post-nav-prev", function () {
            showMessage('要看上一篇文章吗?')
        });
        $(document).on("mouseover", "div.post-nav-next", function () {
            showMessage('要看下一篇文章吗?')
        });
        $(document).on("mouseover", "div.comment-item", function () {
            showMessage('要说点什么吗')
        });
        $(document).on("mouseover", "div.social-share-icon", function () {
            showMessage('要分享吗？好期待啊~')
        });
        $(document).on("click", "li.header-item-nickname", function () {
            showMessage("留下您的称呼哦！")
        });
        $(document).on("click", "li.header-item-email", function () {
            showMessage("留下您的邮箱，不然就是无头像人士了！")
        });
        $(document).on("click", "li.header-item-website", function () {
            showMessage("快快告诉我你的家在哪里，好让我去参观参观！")
        });
        $(document).on("click", "li.comment-poster-editor-wrapper", function () {
            showMessage("发表您的伟论吧~")
        });
    });
    jQuery(document).ready(function ($) {
        window.setInterval(function () {
            showMessage(showHitokoto());
        }, 25000);
        var stat_click = 0;
        // 绑定点击事件监听
        $("#live2d").click(function () {
            if (!ismove) {
                stat_click++;
                if (stat_click > 6) {
                    msgs = ["来るな！", "いい加減にしろよ！", "你已经摸我" + stat_click + "次了", "救命！", "いやだ！", "110吗，这里有个变态一直在摸我(ó﹏ò｡)"];
                    var i = Math.floor(Math.random() * msgs.length)
                } else {
                    msgs = ["不小心的对吧，一定是这样", "我跑呀跑呀跑！~~", "再摸的话我可要报警了！⌇●﹏●⌇", "别摸我，有什么好摸的！", "不要摸我了，我超凶的！", "干嘛动我呀！小心我咬你！"];
                    var i = Math.floor(Math.random() * msgs.length)
                }
                s = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.75, -0.1, -0.2, -0.3, -0.4, -0.5, -0.6, -0.7, -0.75];
                var i1 = Math.floor(Math.random() * s.length);
                var i2 = Math.floor(Math.random() * s.length);
                $(".waifu").animate({
                    left: (document.body.offsetWidth - 210) / 2 * (1 + s[i1]),
                    top: (window.innerHeight - 240) - (window.innerHeight - 240) / 2 * (1 - s[i2])
                }, {
                    duration: 500,
                    complete: showMessage(msgs[i])
                })
            } else {
                ismove = false
            }
        });
    });
    
    var ismove = false;
    // 在屏幕里乱跑
    jQuery(document).ready(function ($) {
        var box = $('.waifu')[0];
        var topCount = 20;
        box.onmousedown = function (e) {
            var Ocx = e.clientX;
            var Ocy = e.clientY;
            var Oboxx = parseInt(box.style.left);
            var Oboxy = parseInt(box.style.top);
            var Ch = document.documentElement.clientHeight;
            var Cw = document.documentElement.clientWidth;
            document.onmousemove = function (e) {
                var Cx = e.clientX;
                var Cy = e.clientY;
                box.style.left = Oboxx + Cx - Ocx + "px";
                box.style.top = Oboxy + Cy - Ocy + "px";
                if (box.offsetLeft < 0) {
                    box.style.left = 0
                } else if (box.offsetLeft + box.offsetWidth > Cw) {
                    box.style.left = Cw - box.offsetWidth + "px"
                }
                if (box.offsetTop - topCount < 0) {
                    box.style.top = topCount + "px"
                } else if (box.offsetTop + box.offsetHeight - topCount > Ch) {
                    box.style.top = Ch - (box.offsetHeight - topCount) + "px"
                }
                ismove = true
            };
            document.onmouseup = function (e) {
                document.onmousemove = null;
                document.onmouseup = null
            }
        }
    });
}

// 因加载方式导致，必须等到 Jquery 可用时才能初始化
let jqeurySpinWaitTime = 0;
let intervalId = setInterval(() => {
    if (window.$) {
        clearInterval(intervalId);
        initLive2dData();
    } else if (jqeurySpinWaitTime == 100) {
        alert("无法加载模型，因为等待 JQuery 超时，请确认是否添加了 JQuery");
        console.error("JQuery 缺失！");
        clearInterval(intervalId);
    } else {
        jqeurySpinWaitTime++;
        console.debug('Waiting for JQuery');
    }
}, 200);