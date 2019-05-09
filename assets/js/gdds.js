(function () {
    var hackString = function () {
        var sp = String.prototype;
        if (!sp)return;

        sp.substr = sp.substr || function (start, length) {
            len = this.length;
            length = length || len;
            if (length > len)length = len;
            if (start < 0)start = 0;
            var r = '';
            for (var i = start; i < length; i++) {
                r += this[i];
            }
            return r;
        };
    };

    var hackArray = function () {
        var ap = Array.prototype;
        if (!ap)return;

        ap.push = ap.push || function (item) {
            if (!item)return;
            if (!this.length)this.length = 0;
            this[this.length] = item;
        }
    };

    var hackClassList = function () {
        if(document.getElementsByTagName('HTML')[0].classList)return; // 原生API支持的话，不进行hack
        // 在DOM元素的原型链上进行hack
        var ep = HTMLElement.prototype ? HTMLElement.prototype : (Element.prototype ? Element.prototype : null);
        if(!ep)return;// 一般不会取不到DOM元素父类的原型，但是还是做检查，防止程序死掉。
        // 创建classList类
        var ClassList = function(elem) {
            var List = (function() {
                var trimStr = elem.className.replace(/^\s+|\s+$/g,'');
                return trimStr?trimStr.split(/\s+/):[];
            }());
            for(var i = 0; i<List.length; i++){
                this.push(List[i]);
            }
            // 更新className
            this._updateClass = function() {
                elem.className = this.join(" ");
            }
            // 检验class是否符合要求
            this._checkClass = function(name) {
                if(!name&&typeof(name)!=="string")return false; // 空或者非字符串
                if(/\s+/.test(name))return false; // 存在空白字符
                return true
            }
        }
        // 设置classList的初始值
        ClassList.prototype = [];

        // classList类contains方法
        ClassList.prototype.contains = function(name) {
            return this.indexOf(name)!==-1;
        }

        // classList类item方法
        ClassList.prototype.item = function(index) {
            return this[index]||null;
        }

        // classList类add方法
        ClassList.prototype.add = function() {
            var classes = arguments,
                update = false,
                len = classes.length,
                i = 0;
            for(;i<len;i++) {
                var item = classes[i];
                if(this._checkClass(item)&&this.indexOf(item)===-1) {
                    this.push(item);
                    update = true;
                }
            }
            if(update)this._updateClass();
        }

        // classList类remove方法
        ClassList.prototype.remove = function() {
            var classes = arguments,
                update = false;
            len = classes.length,
                i = 0;
            for(;i<len;i++) {
                var item = classes[i];
                var index = this.indexOf(item);
                if(this._checkClass(item)&&index!==-1) {
                    this.splice(index,1);
                    update = true;
                }
            }
            if(update)this._updateClass();
        }

        // classList类toggle方法
        ClassList.prototype.toggle = function(name) {
            if(!this._checkClass(name))return;
            var index = this.indexOf(name);
            if(index===-1) {
                this.push(name);
            }else {
                this.splice(index,1);
            }
            this._updateClass();
        }

        var classListGetter = function() {
            return new ClassList(this);
        }
        if(Object.defineProperty) {
            var propDesc = {
                get: classListGetter,
                enumerable: true,
                configurable: true
            }
            try {
                Object.defineProperty(ep, "classList", propDesc)
            }catch(e) {
                if(e.number === -0x7FF5EC54) {
                    propDesc.enumerable = false;
                    Object.defineProperty(ep, "classList", propDesc)
                }
            }
        }else if(Object.prototype.__defineGetter__) {
            ep.__defineGetter__("classList", classListGetter);
        }

    }

    hackString();
    hackArray();
    hackClassList();

}());

window.$p={};/**存储页面相关属性*/
window.$c={};/**存储配置属性*/
window.$d={};/**存储后台推送数据属性*/
window.$g={};/**存储前台框架属性*/

/**初始化客户端设置*/
$g.init = function () {
    if($g.logger) {
        // 当网页渲染完成后,通知Logger把前面堆积的日志显示到页面上
        $g.logger.showPageLog();
    }
};

/** 根路由(不需要指定根路由的,直接设为空字符串) */
$g.RootUrl = '';

$g.KeyCodes = {
    'BACK': 8,
    'ENTER': 13,
    'LEFT': 37,
    'UP': 38,
    'RIGHT': 39,
    'DOWN': 40,
    'NUM_0': 48,
    'NUM_1': 49,
    'NUM_2': 50,
    'NUM_3': 51,
    'NUM_4': 52,
    'NUM_5': 53,
    'NUM_6': 54,
    'NUM_7': 55,
    'NUM_8': 56,
    'NUM_9': 57,
    'PAGE_UP': 33,
    'PAGE_DOWN': 34,
    'FAVORITE': 281,
    'FAST_UP': 264,
    'FAST_DOWN': 265,
    'PLAY':263,
    'STOP':270,
    'LOCATE':271,   // 定位键
    'VOL_UP':259,
    'VOL_DOWN':260,
    'MUTE':261
};

/**元素状态，目前用于保存隐藏的元素*/
$g.ELStatus={};

/*设置元素状态*/
$g.status=function(id,k,v){
    var o=$g.ELStatus[id];
    if(!o){o={};$g.ELStatus[id]=o;};
    if($g.undefine(v))return o[k];
    o[k]=v;
}

/**页面编码*/
$g.PageCodes = {
    /**首页**/
    'HOME':'home',
    /**二级页面——才艺天地**/
    'CY':'cy',
    /**二级页面——拉贝学堂**/
    'XT':'xt',
    /**二级页面——父母中心**/
    'FM':'fm',
    /**二级页面——成长加油站**/
    'JY':'jy',
    /**二级页面——绘本馆**/
    'HB':'hb',
    /**我的小屋**/
    'MY_HOUSE':'myhouse',
    /**三级页面**/
    'VIDEO_LIST':'videolist',
    /**三级页面-绘本**/
    'HUIBEN_PLAY':'huibenplay',
    /**视频播放页面**/
    'VIDEO':'video',
    /**专题-爱得叔叔**/
    'ADSS':'adss',
    /**专题-财商小博士**/
    'CSXBS':'csxbs'
};

/**目前用于Cookie的key值*/
$g.Keys = {
    'CUR_PAGE': 'gddsCurrentPage',
    'FOCUS': 'gddsFocus'
};

/** 日志级别定义 */
$g.LogLevel = {
    'VERBOSE':0,
    'DEBUG':1,
    'INFO':2,
    'WARN':3,
    'ERROR':4,
    'FATAL':5,
    'CLOSE':6
};
/** 日志打印方式定义 */
$g.LogPrintType = {
    'PrintToConsole': 1, // 打印到控制台(开发使用,现网绝对不能使用此选项)
    'PrintToPage': 2,    // 打印到页面(开发使用,现网绝对不能使用此选项)
    'PrintToServer': 3  // 打印到服务器
};

/**
 * 日志打印类
 * (因为需要依赖document.body创建div标签才能打印到页面上,所以要求在页面加载完
 * 成后才能执行log打印,所以此类的实例化放在了$g.init函数里,在$g.init执行之前的
 * 所有打印都会出错)
 * @param level         日志级别
 * @param printType     日志打印方式
 * @returns {{}}
 * @constructor
 */
$g.Logger = function(level, printType) {
    var s = {};

    s.Level = level;
    s.PrintType = printType;

    // 用于显示日志的页面div对象
    s._logdiv;
    // 用于发送日志的页面img对象
    s._logimg;
    // 日志总数量
    s._count = 0;
    // 当前所显示的最后一个日志的序列号
    s._index = 0;
    // 日志内容数组
    s._content = [];

    // pathname是不带参数的,无需编码
    s._url = window.location.pathname;

    /**
     * 返回一个用于打印对应级别日志的打印函数
     * level 日志级别
     * tag 打印到页面时表示日志级别的标记
     * path 打印到服务器时的对应级别日志请求路由
     * method 打印到控制台时的对应级别console方法
     */
    s.getLogFn = function(level, tag, path, method) {
        if(level < s.Level) {
            // 低于打印级别的直接返回空函数
            return function() {};
        }

        if(s.PrintType == $g.LogPrintType.PrintToConsole) {
            return console[method].bind(console);
        } else if(s.PrintType == $g.LogPrintType.PrintToPage) {
            return function() {
                s.logPage(tag, arguments);
            }
        } else if(s.PrintType == $g.LogPrintType.PrintToServer) {
            return function() {
                s.logServer(level, path, arguments);
            }
        }
    };

    s.logServer = function(level, path, params) {
        var mes = s.getFormatLog(params);
        // 注意url编码的效率影响
        mes = $g.URLEncoder.encode(mes);
        var url = path + "?url=" + s._url + "&mes=" + mes;

        if(level == $g.LogLevel.FATAL) {
            // FATAL属于严重错误,需要直接通过HTTP请求服务器并显示错误页面
            $g.redirect(url);
        } else {
            // 其他级别只需要发送ajax报给服务器就行了
            $g.ajax(url, null, true);
        }
    };

    s.sendServer = function(sendUrl, sendData) {
        if(!s._logimg) {
            if(!document.body) {
                return;
            }

            // 动态创建一个heartBeat img,用于发送心跳请求
            var logimg = document.createElement("img");
            logimg.id = "dsHeartBeat";
            logimg.style.position = "absolute";
            logimg.style.left = "1px";
            logimg.style.top = "1px";
            logimg.style.width = "1px";
            logimg.style.height = "1px";
            logimg.style.visibility = "hidden";
            document.body.appendChild(logimg);
            s._logimg = logimg;
        }

        if(sendData) {
            var symbol = '&';
            if(sendUrl.indexOf('?') == -1) symbol = '?';
            for(var key in sendData) {
                sendUrl = sendUrl + symbol + key + '=' + sendData[key];
                symbol = '&';
            }
        }
        s._logimg.src = sendUrl;
    };

    s.logPage = function(tag, params) {
        var mes = s.getFormatLog(params);
        mes = "[" + s._count + "-" + tag + "]" + mes;
        s._count++;

        if(s._content.length >= 100) {
            s._content = [];
        }
        // 直接把日志打印到页面上
        s._content.push(mes);
        s.showPageLog();
    };

    // 把日志显示到页面上
    s.showPageLog = function() {
        if(s._content.length == 0 || s.PrintType != $g.LogPrintType.PrintToPage) {
            return;
        }

        if(!s._logdiv) {
            if(!document.body) {
                return;
            }

            // 动态创建一个log div,用于页面打印日志
            var logdiv = document.createElement("div");
            logdiv.id = "dslog";
            logdiv.style.position = "absolute";
            logdiv.style.left = "50px";
            logdiv.style.top = "50px";
            logdiv.style.width = "600px";
            logdiv.style.fontSize = "12pt";
            logdiv.style.color = "red";
            logdiv.style.zIndex = "10000";
            document.body.appendChild(logdiv);
            s._logdiv = logdiv;
        }

        s._index = s._content.length;
        var showContent = "";
        for(var i=1; i<=10; i++) {
            var index = s._index - i;
            if(index < 0) {
                break;
            }

            showContent = s._content[index] + "<br/>" + showContent;
        }

        s._logdiv.innerHTML = showContent;
    };

    // 控制页面日志面板
    s.controlPageLog = function(key) {
        if(!s._logdiv) {
            return;
        }

        if(key == $g.KeyCodes.NUM_0) {
            // 按数字0键,显示或隐藏页面日志面板
            if(s._logdiv.style.visibility == 'visible') {
                s._logdiv.style.visibility = 'hidden';
            } else {
                s._logdiv.style.visibility = 'visible';
            }
        }
    };

    // 格式化日志字符串(目前只处理 %s、%d、%o、%f)
    s.getFormatLog = function(params) {
        if(params.length == 1) {
            // 前面加空字符的目的是为了保证返回的对象为字符串
            return "" + params[0];
        }

        var messages = params[0].split("%");
        var mes = messages[0];
        var isBeforeNull = false;   // 前一个值是否为空字符串
        var pLength = params.length;
        var mLength = messages.length;

        // 如果字符串第一位为%号,分割的字符串也会在最前面添加一个""空字符串,所以我们从下标1开始循环
        for(var i=1,j=1; ; i++) {
            var submes, para;
            var hasSubmes = false;
            var hasPara = false;

            if(i < mLength) {
                hasSubmes = true;
                submes = messages[i];
            }
            if(j < pLength) {
                hasPara = true;
                para = params[j];
            }

            if(!hasSubmes && !hasPara) {
                // 遍历完成,跳出循环
                break;
            }
            if(!hasSubmes) {
                mes += " " + para;
                j++;
                continue;
            }
            if(!hasPara) {
                mes += "%" + submes;
                continue;
            }

            if(submes == "") {
                // 出现空字符串表示此处有两个以上的%号
                if(!isBeforeNull) {
                    // 两个%号当成一个%号处理
                    mes += "%";
                    isBeforeNull = true;
                } else {
                    isBeforeNull = false;
                }
                continue;
            } else {
                if(isBeforeNull) {
                    // 前面出现了空字符串,紧跟后面的这个应当成普通字符串来处理
                    mes += submes;
                    isBeforeNull = false;
                    continue;
                }

                isBeforeNull = false;
            }

            // 走到这里,就要对字符串进行格式化处理
            if(submes.indexOf("s") == 0) {
                submes = submes.replace("s", para);
            } else if(submes.indexOf("d") == 0) {
                if(parseInt) {
                    para = parseInt(para);
                }
                submes = submes.replace("d", para);
            } else if(submes.indexOf("o") == 0) {
                if(JSON && JSON.stringify) {
                    try {para = JSON.stringify(para);} catch(e) {}
                }
                submes = submes.replace("o", para);
            } else if(submes.indexOf("f") == 0) {
                if(parseFloat) {
                    para = parseFloat(para);
                }
                submes = submes.replace("f", para);
            } else {
                // 没有匹配到,还是当成普通字符串来处理,%号补回来
                mes += "%" + submes;
                continue;
            }

            j++;
            mes += submes;
        }
        return mes;
    };

    return s;
};

/** 配置：日志级别、日志打印方式 ****************************************/
$g.logger = $g.Logger($g.LogLevel.WARN, $g.LogPrintType.PrintToServer);

/** 前端页面日志打印相关函数
 * 注意：字符串格式化只支持 %s-字符串、%d-整数、%o-链接对象、%f-浮点数
 * 用法：
 * $g.debug("hello debug"); ==> hello debug
 * $g.warn("hello", "warn"); ==> hello warn
 * $g.error("%d hello %s", 233, "error"); ==> 233 hello error
 * $g.fatal("hello fatal"); ==> hello fatal (注意:执行fatal后页面会同时跳转到错误页面)
 */
// 详尽哆嗦的信息
$g.verbose = $g.logger.getLogFn($g.LogLevel.VERBOSE, "V", "/weblog/verbose", 'log');
// 调试信息
$g.debug = $g.logger.getLogFn($g.LogLevel.DEBUG, "D", "/weblog/debug", 'debug');
// 普通信息
$g.info = $g.logger.getLogFn($g.LogLevel.INFO, "I", "/weblog/info", 'info');
// 警告信息
$g.warn = $g.logger.getLogFn($g.LogLevel.WARN, "W", "/weblog/warn", 'warn');
// 错误信息
$g.error = $g.logger.getLogFn($g.LogLevel.ERROR, "E", "/weblog/error", 'error');
// 致命的错误信息
$g.fatal = $g.logger.getLogFn($g.LogLevel.FATAL, "F", "/weblog/fatal", 'error');
// 发送数据
$g.send = $g.logger.sendServer;

$g.event = function (e) {
    return e || window.event;
};

$g.ready = function (cb) {
    window.onload = cb;
};

$g.unload = function (cb) {
    window.onunload= cb;
};
//页面按键方法
$g.onKeyDownPageCb = null;
//全局按键方法
$g.onKeyDownGlobalCb = function(e){
    if($g.Screen.onKeyDown(e)){
        return;
    }
    $g.onKeyDownPageCb(e);
};

$g.onkeydown = function (cb) {
    $g.onKeyDownPageCb = cb;
    document.onkeydown = $g.onKeyDownGlobalCb;
};

$g.onkeyup = function (cb) {
    document.onkeyup= cb;
};

$g.redirectUrl = '';
$g.redirectTime = 0;
$g.redirect = function (url,winObject) {
    if($g.RootUrl) {
        url = $g.RootUrl + url;
    }

    if(url.indexOf('http://') == 0) {
        // http:// 开头的url表示需要跨域跳转到另一个产品，应该addHost以及添加身份认证参数
        var host = url;
        var pos = url.indexOf('/', 8);
        if(pos > 0) {
            host = host.substr(0, pos);
        }

        try {
            GddsNative.addHost(host);
            url = GddsNative.getCrossDomainUrl(url);
        } catch(err) {
            // add by liruan 2017.12.28
            // 由于部分用户不升级少儿apk,没有addHost和getCrossDomainUrl函数,所以导流跳转会失败,目前集中把这部分用户跳转到/entercross/20001进行处理
            url = '/entercross/20001?crossurl=' + $g.URLEncoder.encode(url);
        }
    }

    var nowDate = new Date();
    var nowTime = nowDate.getTime();
    if(!url) {
        // window.location.href='' 的行为就是重新加载页面，容易造成页面请求的死循环，所以拒绝这种请求
        return;
    }
    if($g.redirectUrl == url && nowTime - $g.redirectTime < 3000) {
        // 同一个url跳转请求，如果间隔小于3秒，应该把他拒绝掉，以避免页面发起重复请求的情况出现
        $g.redirectTime = nowTime;
        return;
    }

    $g.redirectUrl = url;
    $g.redirectTime = nowTime;
    if(winObject) {
        winObject.location.href = url;
    } else {
        window.location.href = url;
    }
};

$g.ajax = function(url,cb,async){
    var xmlhttprequest = null;
    if(window.XMLHttpRequest)
        xmlhttprequest=new XMLHttpRequest();
    else if(window.ActiveXObject)
        xmlhttprequest=new ActiveXObject("Microsoft.XMLHTTP");
    xmlhttprequest.onreadystatechange = function(){
        if(xmlhttprequest.readyState == 4){
            if(xmlhttprequest.status == 200 || xmlhttprequest.status==0){
                if(!cb) return;
                // 前端并不知道发送ajax返回的结果是不是json格式,也可能只是一个普通的text
                // 所以这里不应该parse他,而是应该交给回调者自行处理返回结果
                //var result = JSON.parse(xmlhttprequest.responseText);
                var result = xmlhttprequest.responseText;
                cb(result);
            }
            xmlhttprequest = null;
        }
    };
    xmlhttprequest.open("GET",url,async);
    xmlhttprequest.send(null);
};

//增加一个post方式的ajax请求，传过去的数据格式为json
$g.post = function(url,data,cb,async){
    var xmlhttprequest = null;
    if(window.XMLHttpRequest)
        xmlhttprequest=new XMLHttpRequest();
    else if(window.ActiveXObject)
        xmlhttprequest=new ActiveXObject("Microsoft.XMLHTTP");
    xmlhttprequest.onreadystatechange = function(){
        if(xmlhttprequest.readyState == 4){
            if(xmlhttprequest.status == 200 || xmlhttprequest.status==0){
                if(!cb) return;
                // 前端并不知道发送ajax返回的结果是不是json格式,也可能只是一个普通的text
                // 所以这里不应该parse他,而是应该交给回调者自行处理返回结果
                //var result = JSON.parse(xmlhttprequest.responseText);
                var result = xmlhttprequest.responseText;
                cb(result);
            }
            xmlhttprequest = null;
        }
    };
    xmlhttprequest.open("POST",url,async);
    xmlhttprequest.setRequestHeader("Content-type","application/json");
    xmlhttprequest.send(JSON.stringify(data));
};

$g.id = function (id) {
    return document.getElementById(id);
};

$g.bodyBg=function(url){
    document.body.style.backgroundImage='url("'+url+'")';
}

$g.show = function (id) {
    // 不存在实际对象也不会报错，用于抽象焦点- Chenzhe - 2016-12-07 14:03:59
    var el = $g.id(id);
    if (el) el.style.visibility = 'visible';
    $g.status(id,'visible','v');
};

$g.hide = function (id) {
    // 不存在实际对象也不会报错，用于抽象焦点- Chenzhe - 2016-12-07 14:03:59
    var el = $g.id(id);
    if (el) el.style.visibility = 'hidden';
    $g.status(id,'visible','h');
};

/*在某些机顶盒上，当要显示、隐藏的元素超过6个速度会很慢，
此时需要使用以下方法，使用透明图片实现显示，隐藏的效果*/
$g.mask=function(id,img){
    // 不存在实际对象也不会报错，用于抽象焦点- Chenzhe - 2016-12-07 14:03:59
    var el = $g.id(id);
    if(el) el.src = img;
    $g.status(id,'visible','h');
};

$g.unmask=function(id,img){
    // 不存在实际对象也不会报错，用于抽象焦点- Chenzhe - 2016-12-07 14:03:59
    var el = $g.id(id);
    if(el) el.src = img;
    $g.status(id,'visible','v');
};

$g.isHide = function (id) {
    return $g.status(id,'visible')=='h';
};

$g.showAll=function(ids){
    for(var i= 0;i<ids.length;i++)
        $g.show(ids[i]);
};

$g.hideAll=function(ids){
    for(var i= 0;i<ids.length;i++)
        $g.hide(ids[i]);
};

$g.cookie = function (k,v,p) {
    p=p||'/';
    if (v) {
        document.cookie = (k + '=' + v+';path='+p);
        return;
    }

    var cookie = document.cookie;
    var start = cookie.indexOf(k + '=');
    if (start == -1)return;

    start = cookie.indexOf('=', start) + 1;
    var end = cookie.indexOf(';', start);
    if (end == -1)end = cookie.length;
    return cookie.substr(start, end - start);
};

$g.undefine=function(v){
    return (typeof v==='undefined');
};


$g.extend=function(c,p,props){
    if(!c||!p||!props)return c;
    for(var i= 0,len=props.length;i<len;i++){
        var prop=props[i];
        if(prop)c[prop]=p[prop];
    }

    return c;
};

/**有关Array的util方法*/
$g.Array={
    /**从values数组匹配value获取索引值i，然后返回keys[i]*/
    'key':function(value,values,keys){
        if($g.undefine(value)||!keys||!values)return;
        var i=$g.Array.indexOf(value,values);
        return keys[i];
    },
    'find':function(key,value,items){
        if(!items)return;

        for(var i= 0,len=items.length;i<len;i++){
            var item=items[i];
            if(item&&item[key]==value)
                return item;
        }
        return false;
    },
    'index':function(key,value,items){
        if(!items)return -1;

        for(var i= 0,len=items.length;i<len;i++){
            var item=items[i];
            if(item&&item[key]==value)
                return i;
        }
        return -1;
    },
    'indexOf':function(value,items){
        if(!items)return -1;

        for(var i= 0,len=items.length;i<len;i++){
            var item=items[i];
            if(item==value)return i;
        }
        return -1;
    }
};

/**URL编码器*/
$g.URLEncoder={
    'SpecChars':[['=', '/', '?', '&', ' ', ':', '@', '+', '$', '#', ',','%'],
        ['3D','2F','3F','26','20','3A','40','2B','24','23','2C','25']],
    'encode':function(url){
        if(!url||url.length==0)return url;

        var r='';
        for(var i=0;i<url.length;i++){
            var c=url.substr(i,1);
            var v=$g.Array.key(c,this.SpecChars[0],this.SpecChars[1]);
            r+=(v?'%'+v:c);
        }
        return r;
    },
    'decode':function(url){
        if(!url||url.length==0)return url;

        var r='';
        for(var i=0;i<url.length;i++){
            var c=url.substr(i,1);
            var k=false;

            if(c=='%'){
                var v=url.substr(i+1,2);
                k=$g.Array.key(v,this.SpecChars[1],this.SpecChars[0]);
            }

            if(k){r+=k;i+=2;}
            else{r+=c;}
        }

        return r;
    }
};

/**用于滚动条目，参数包括(参数值可在创建roller对象后修改)：
 * startFlag:开始标志，一般为用于显示数据的页面元素id，下同
 * endFlag:结束标志
 * flagTotal:标志总数
 * items:数据项
 * cb：回调函数，格式为fn(type,roller)
 * type:可为prev,next,first,last,
 * roller:当前滚动对象
 **/
$g.Roller = function (startFlag, endFlag, flagTotal,items) {
    var s = {};
    s.startFlag = startFlag;
    s.endFlag = endFlag;
    s.flagTotal = flagTotal;
    s.cb =false;

    /**用于滚动的数据项*/
    s.items=function(items){
        if(!items)return this._items;
        this._items=items;/**私有变量，勿直接修改*/
        this.index =this.flagTotal;/**当前指向的数据项,以1开始*/
        this.start =0;/**当前滚动后数据项的开始索引值*/
        this.end =this.flagTotal;/**当前滚动后数据项的结束索引值*/
    };

    s.items(items||[],s);

    /**flag为当前的定位标志，key为按键值，暂仅支持左，右键*/
    s.roll = function (flag,key) {
        var start = -1;
        var type = false;

        if (flag == this.startFlag && key == $g.KeyCodes.LEFT) {
            if (this.index == this.flagTotal)return;
            this.index--;
            type = (this.index == this.flagTotal) ? 'first' : 'prev';
            start = this.index - this.flagTotal;
        } else if (flag == this.endFlag && key == $g.KeyCodes.RIGHT) {
            if (this.index == this._items.length)return;
            this.index++;
            type = (this.index == this._items.length) ? 'last' : 'next';
            start = this.index - this.flagTotal;
        }

        if (start < 0 || !type)return;
        this.start = start;
        this.end = start + this.flagTotal;
        this.cb(type, this);
    }

    return s;
};

/**定时滚动条目
 * items：需要显示的数据项
 * time：多少毫秒后超时
 * cb，回调函数，格式为cb(roller)
 * 注意：在某些机顶盒执行回调函数时，可能已经回收如下的s对象，或者在s的对象方法里，
 * 访问不到s的属性值。为了解决这些问题，首先需要s对象赋给全局变量，其次在调用s方法
 * 时需要重新传回s对象，以便能找到s的属性值*/
$g.TimeoutRoller = function (items) {
    var s={};
    s.count =0;/**从0开始，导致第1次超时取到的是第2个数据项*/
    s.current = false;
    s.items = items;
    s.cb = false;

    s.roll = function () {
        if (this.count >= this.items.length)this.count = 0;
        this.current = this.items[this.count];
        this.count++;
        this.cb(this);
    };

    return s;
};

/**翻页,参数如下：
 * items:需要显示的数据项
 * size:每页显示多少项,必须小于或等于items总数
 * cb:回调函数，格式为cb(pager)*/
$g.Pager = function (size,items) {
    var s = {};

    /**为了避免使用Math对象的方法*/
    s._getTotal = function (length, size) {
        if (length == 0)return 0;

        var count = 0;
        var total = 0;
        for (var i = 0; i < length; i++) {
            count++;
            if (count == size) {
                count = 0;
                total++;
            }
        }
        if (count != 0 && count < size) {
            total++;
        }
        return total;
    };


    s.size = size;/**每页显示条目数*/
    s.cb = false;/**回调函数,格式为fn(pager)*/

    /**需要翻页的数据项*/
    s.items = function (items) {
        if (!items)return this._items;
        this._items = items;/**私有变量，勿直接修改*/
        this.count = this._items.length;/**总条目数*/
        this.current = 0;/**当前页，以1开始*/
        this.total = this._getTotal(this.count, this.size);/**总页数,以1开始*/
        this.currentItems = [];/**当前页面的数据项*/
    };

    s.items(items || [],s);

    /**是否首页*/
    s.isFirst = function () {
        return this.current == 1;
    };

    /**是否末页*/
    s.isLast = function () {
        return this.current == this.total;
    };

    /**前一页*/
    s.prev = function () {
        this.skip(this.current - 1, false); //这里加多一个isNext
    };

    /**后一页*/
    s.next = function () {
        this.skip(this.current + 1, true); //同上
    };

    /**根据按键值翻页*/
    s.go = function (key) {
        if (key == $g.KeyCodes.PAGE_UP) {
            this.prev();
        } else if (key == $g.KeyCodes.PAGE_DOWN) {
            this.next();
        }
    };

    /**跳到指定页数,页数以1开始*/
    s.skip = function (page, isNext) {
        if (this.total == 0) {
            this.currentItems = [];
            this.cb(this);
            return;
        }

        if (page < 1 || page > this.total)return;

        if (page == 1 && this.isFirst() ||
            page == this.total && this.isLast())return;

        this.current =parseInt(page);
        this.currentItems = [];
        var start = (page - 1) * this.size;
        var end = start + this.size;
        end = end < this.count ? end : this.count;
        for (var i = start, j = 0; i < end; i++, j++) {
            this.currentItems[j] = this._items[i];
        }
        this.cb(this, isNext);
    };

    return s;
};

/**焦点路由，用于管理元素焦点*/
$g.FocusRouter = function (fcKey) {
    var s = {};

    s._isValid = function (id) {
        if (!id || $g.isHide(id))return false;

        var route = this.routes[id];
        return route&&!route.disabled;
    };

    s._isHandled=function(type,id){
        return this.cb&&this.cb(type, id, this);
    };

    s._getGId = function (id) {
        var route = this.routes[id];
        if (route && route.group)
            return route.group;
        return 'root';
    };

    s._getImg = function (option, index) {
        if (!option || !option.img)
            return false;

        var imgs = option.img;
        var img = imgs[index];

        /**选中图片默认为focus图片，未选中图片默认为blur图片*/
        if (!img) {
            if (index==3) {img = imgs[1];}
            else if (index==2) {img = imgs[0];}
        }

        return img;
    }

    s._swapImg = function (id,index) {
        // 用于抽象焦点，避免没有实际元素就报错- Chenzhe - 2016-12-07 14:10:47
        var el = null;
        if(!(el=$g.id(id))) return;

        var gid = this._getGId(id);
        if (index == 1) {
            /**如果当前元素被选中且不属于root组，失去焦点后应显示选中时的图片*/
            var sid = this.currentSelects[gid];
            if (sid == id&&gid!='root')index = 2;
        }

        // var group = this.groups[gid];
        // var img = this._getImg(group, index);
        // if (img)$g.id(id).src = img;

        // var route = this.routes[id];
        // img = this._getImg(route, index);
        // if (img)$g.id(id).src = img;

        // 用于抽象焦点，避免没有实际元素就报错 - Chenzhe - 2016-12-07 14:09:41
        var group = this.groups[gid],
            groupImg = this._getImg(group, index),
            route = this.routes[id],
            routeImg = this._getImg(route, index),
            img = routeImg || groupImg; // 优先使用routeImg
        if (img) el.src = img;
    };

    s._exec = function (id,index) {
        this._swapImg(id,index);

        var group = this.groups[this._getGId(id)];
        if (group && group.fn) {
            var fn = group.fn[index];
            if (fn)fn(id, this);
        }

        var route = this.routes[id];
        if (route && route.fn) {
            var fn = route.fn[index];
            if (fn)fn(id, this);
        }
    };

    s.findNextValid=function(id,index){
        var route=this.routes[id];
        var next=route&&route.path?route.path[index]:false;
        // 如果递归过程中path没找到，就立刻返回，因为没路径就不知道怎么走，没必要再递归
        // - Chenzhe - 2016-12-07 14:17:29
        if(next === false || next === undefined ) return false;

        if(!this.enableRecurFind||this._isValid(next)||
            this.recurCount==this.recurTotal){
            this.recurCount=0;
            return this._isValid(next)?next:false;
        }

        this.recurCount++;
        return this.findNextValid(next,index,this);
    }

    /**设置是否启用router*/
    s.enable=true;

    /**保存当前焦点元素的cookie的key名称*/
    s.fcKey=fcKey;

    /**当前获取焦点的元素*/
    s.currentFocus = false;

    /**当前选中的元素，可能包含多个，格式为{gid:id}*/
    s.currentSelects = {};

    /**路由信息,格式如下：
     * id:{'path':[u,r,d,l],'fn':[f,b,s,u],'img':[f,b,s,u],'group':'root','link':'url'}
     * id:可获取焦点的元素id，建议使用img元素,div元素仅作为排版
     * path:元素焦点路由路径，u,r,d,l分别表示上，右，下，左
     * fn:(可选)元素路由事件回调函数，f,b,s,u分别对应4个路由事件onfocus,onblur,onselect,onunselect
     * img:(可选)元素图片,在路由事件触发后会自动设置对应的图片,f,b,s,u意义同上
     * group:(可选)元素所属组，默认为root。具体见this.groups属性说明
     * link:(可选)选中元素后的目标跳转地址
     * disabled:(可选)此路由是否失效，默认为false
     *
     * 回调函数格式为:fn(id,router)
     * id:当前触发事件的元素id
     * router：当前router对象，可获取router.routes/router.groups等数据
     * */
    s.routes = {};

    /**元素分组信息，目前用于控制按钮组状态以及设置同一组元素的回调函数和图片等，
     * 路由事件触发后会先执行分组信息定义的回调函数。格式如下：
     * gid:{'fn':[f,b,s,u],'img':[f,b,s,u]}
     * gid：组id，需要与路由信息的'group'属性值对应
     * fn和img定义与routes的定义相同
     * */
    s.groups = {};

    /**总回调函数，如果返回false，则不会执行默认操作.
     * 回调函数格式fn(type,id,router),参数说明如下：
     * type:需要执行的操作类型，可能为focus,blur,select,unselect
     * id:被操作的元素id值
     * router：当前FocusRouter对象
     * */
    s.cb = false;

    /**如果获取的下一个路由路径无效，总共允许迭代多少次以获取有效路径*/
    s.recurTotal=10;
    /**当前迭代查找有效路径的次数*/
    s.recurCount=0;
    /**是否启用迭代查找下一个有效路由*/
    s.enableRecurFind=true;

    /**设置路由失效、生效*/
    s.enableRoute = function (id, v) {
        var route = this.routes[id];
        if (route)route.disabled = !v;
    };

    /**元素获取焦点*/
    s.focus = function (id) {
        if(!this.enable||this._isHandled('focus', id))return;
        if (!this._isValid(id))return;

        // - Chenzhe - 2016-12-07 14:18:45
        // 再次聚焦同一个id也返回
        // 这里可能要避免回调里再focus自己的死循环
        //
        // 为了可以重复focus自己，去除这个条件，但同时加上调用递归限制
        // if (this.currentFocus == id)return;
        if(!this.__focusLimit) this.__focusLimit = 0;
        if (this.currentFocus == id) {
            // 禁止递归
            if(++this.__focusLimit >= 2) {
                this.__focusLimit = 0;
                return;
            }
        } else {
            // 重复focus自己就不blur自己了。
            this.__focusLimit = 0;
            this.blur(this.currentFocus);
        }

        this.currentFocus = id;
        $g.cookie(this.fcKey,id);

        this._exec(id,0);

        // 只是禁止在focus回调里再focus自己
        //- Chenzhe - 2016-12-07 14:46:07
        this.__focusLimit = 0;
    };

    /**元素失去焦点*/
    s.blur = function (id) {
        if(!this.enable||this._isHandled('blur', id))return;
        if (!this._isValid(id))return;

        this.currentFocus = false;
        this._exec(id,1);
    };

    /**选中元素，如果元素未获取焦点，会先获取焦点*/
    s.select = function (id) {
        if(!this.enable||this._isHandled('select', id))return;
        if (!this._isValid(id))return;
        // 由于可以focus自己了，所以要判定, - Chenzhe - 2016-12-07 14:38:13
        if(this.currentFocus != id) this.focus(id);

        var gid = this._getGId(id);
        var oldSelect = this.currentSelects[gid];

        /**如果当前选中元素属于root组，可以再次选中*/
        if (oldSelect == id&&gid!='root')return;

        if(oldSelect!=id){
            this.unselect(oldSelect);
            this.currentSelects[gid] = id;
        }

        this._exec(id,2);
        var route = this.routes[id];
        if (route && route.link) {
            $g.redirect(route.link);
        }
    };

    /**取消选中元素，不会导致元素失去焦点*/
    s.unselect = function (id) {
        if(!this.enable||this._isHandled('unselect',id))return;
        if (!this._isValid(id))return;

        var gid = this._getGId(id);
        this.currentSelects[gid] = false;
        this._exec(id,3);
    };

    /**根据传入的按键值移动元素焦点或选中元素*/
    s.go = function (key) {
        if(!this.enable)return ;

        var K = $g.KeyCodes;
        if (key == K.ENTER) {
            this.select(this.currentFocus);
            return;
        }

        var index = -1;
        if (key == K.UP) {index = 0}
        else if (key == K.RIGHT) {index = 1}
        else if (key == K.DOWN) {index = 2}
        else if (key == K.LEFT) {index = 3}
        else {return;}

        var id=this.findNextValid(this.currentFocus,index);
        this.focus(id);
    };

    return s;
};



/* 用于实现类似儿歌的固定中间项翻页滚动功能
 * flag:定义元素id,
 * range:要额外显示的数据项取值范围
 * items：数据项
 * cb:回调函数，格式为fn(type,roller)  type可能值为prev,next
 * */
$g.CycleRoller=function(flag,range,items){
    var s={};
    s.flag=flag;
    s.range=range;
    s.cb=false;

    s.resetIndexes=function(){
        this.indexes=[];
        if(this.range==0)
            return this.indexes.push(this.index);

        var c=this.range*2+1;
        var len=this._items.length;
        var start=this.index-this.range;
        for(var i= 0;i<c;i++){
            var v=start>=0?start:start+len;
            v=v<len?v:v-len;
            start++;
            this.indexes.push(v);
        }
    };
    s.items=function(items){
        if(!items)return this._items;
        this._items=items;
        this.index=0;/*当前数据项索引值*/
        this.indexes=[];/*当前要显示的全部数据项索引值*/
        this.prevIndexes =this.indexes;
        this.resetIndexes();
    };
    s.items(items);

    /*orientation:滚动方向，
     *可能值：h(水平，默认值)，v(垂直)*/
    s.roll=function(flag,key,orientation){
        if(this.flag!=flag||!this._items)return;
        var len=this._items.length;
        var type=false;
        var L=$g.KeyCodes.LEFT;
        var R=$g.KeyCodes.RIGHT;
        if(orientation=='v'){
            L=$g.KeyCodes.UP;
            R=$g.KeyCodes.DOWN;
        }
        if(key==L){
            type='prev';
            this.index--;
            if(this.index<0)this.index=len-1;
        }else if(key==R){
            type='next';
            this.index++;
            if(this.index>=len)this.index=0;
        }

        if(type&&this.cb){
            this.prevIndexes= [];
            for(var i = 0 ;i<this.indexes.length;i++)  this.prevIndexes.push(this.indexes[i]);
            this.resetIndexes();
            this.cb(type,this);
        }
    };

    return s;
};

/**
 * classList - 方便操作element的className
 * @param {HTMLElement} elem 要操作的元素
 * @return {Object} 方法对象，支持链式
 */
$g.classList = function(elem) {
    // slice, splice, split
    if (typeof elem === 'string') {
        try {
            elem = $g.id(elem);
        } catch(e){
            $g.warn('classList can\'t find id:', elem)
        }
    }
    return {
        _elem      : elem,
        _uniqueList: null,
        // 去重
        _unique    : function(arr) {
            var uniqueList = [], tempObj = {};
            for (var i = arr.length; i--;) {
                if (!tempObj[arr[i]]) {
                    uniqueList.push(arr[i]);
                    tempObj[arr[i]] = true;
                }
            }
            return uniqueList;
        },
        // 整理传入的className，返回数组
        // 只接受单个参数，字符串或数组
        _filter: function(className) {
            if (typeof className === 'string') {
                if(className === '') return [];
                var list = className.trim().split(/\s+/);
                return this._unique(list);
            } else if (className instanceof Array) {
                for (var i = className.length; i--;) {
                    if (typeof className[i] !== 'string') {
                        throw new Error('className must be string in Array');
                    }
                }
                return this._unique(className);
            }
            return [];
        },
        _setClassName: function(list) {
            this._uniqueList = list;
            this._elem.className = list.join(' ');
        },
        // 返回className数组
        getClassList: function() {
            if (this._uniqueList) return this._uniqueList.slice();
            var list = this._filter(this._elem.className);
            this._uniqueList = list.slice();
            elem.className = list.join(' ');
            return list;
        },
        // 传入单个或多个className，添加className
        add: function(className) {
            var newList = this._filter(className);
            var list = this.getClassList();
            for (var i = newList.length; i--;) {
                if (list.indexOf(newList[i]) === -1) {
                    list.push(newList[i]);
                }
            }
            this._setClassName(list);
            return this;
        },
        // 传入单个或多个className,删除className
        remove: function(className) {
            var newList = this._filter(className);
            var list = this.getClassList();
            for (var i = newList.length; i--;) {
                var index = list.indexOf(newList[i]);
                if (index !== -1) {
                    list.splice(index, 1);
                }
            }
            this._setClassName(list);
            return this;
        },
        // 传入单个或多个className,添加或删除className,取决于原本有没有这个className
        toggle: function(className) {
            var newList = this._filter(className);
            var list = this.getClassList();
            for (var i = newList.length; i--;) {
                var index = list.indexOf(newList[i]);
                if (index !== -1) {
                    list.splice(index, 1);
                } else {
                    list.push(newList[i]);
                }
            }
            this._setClassName(list);
            return this;
        },
        // 传入一个对象，对象的key是className, 对象的value是className的开关
        // 删掉现有的className，以对象的key为准
        option: function(opts) {
            var list = [], key = '';
            for (key in opts) {
                if (opts[key]) {
                    list.push(key);
                }
            }
            this._setClassName(list);
            return this;
        }
    };
};

/**
 * supportCSS 检查是否支持某一属性
 * @param {String} 不带前缀的style属性名
 * @return
 */
$g.supportCSS = function(style) {
    // 原理是支持的属性会出现在computedStyle中
    // XXX: 云南的机顶盒存在有属性但无效的情况
    var div, computedSytle;
    var prefix = ['', 'webkit'],

        len = prefix.length,
        flag = false,
        i = 0;
    try { // 怕getComputedStyle出错
        div = document.createElement('div');
        computedSytle = getComputedStyle(div, null);

        for (;i < len && !flag; i++) {
            var pre = prefix[i],
                capitalStyle = i === 0 ? style : style[0].toUpperCase() + style.substring(1),
                checkedStyle = pre + capitalStyle;
            if (checkedStyle in computedSytle) flag = true;
        }
        return flag;
    } catch (e) {
        return false;
    } finally {
        // clean
        div = null;
        computedSytle = null;
    }
};

// 方便储存cookie，多个数据共用一条cookie
// key默认是时间戳
$g.Memory = (function() {
    'use strict';
    /**
     * cookie记忆类，存入对象，实现多个数据共用一条cookie
     * @constructor
     * @param       {String} key -- cookie储存的键名
     * @return      {Memory}
     */
    function Memory(key) {
        this._key = key || new Date().getTime() + '_memory';
    }

    /**
     * save 储存数据对象
     * @param {Object} opt -- 数据对象，数据值不能含有分号';'逗号',' 也不能有cookie关键字（没验证）
     * @return void
     *
     * 注意如果没有JSON.stringify就不能储存了
     */
    Memory.prototype.save = function(opt) {
        try {
            var json = opt ? JSON.stringify(opt) : false;
            if (!json || json === '{}') return;
            $g.cookie(this._key, json);
        } catch (e) {
            $g.warn(e);
        } finally {
            // 每次储存都要清空缓存
            this._memory = null;
            // 储存后可get
            this._skipGet = false;
        }
    };

    /**
     * get 读取cookie
     * @param {String} [key] -- 可选，返回对应的键值或者整个对象
     * @return {Object || Anything}
     */
    Memory.prototype.get = function(key) {
        // 出错后不能再get，除非重新储存
        if(this._skipGet) return {};
        try {
            if (!this._memory) this._memory = JSON.parse($g.cookie(this._key));
        } catch (e) {
            $g.warn(e);
            this._skipGet = true;
        } finally {
            if (key !== undefined && this._memory) return this._memory[key];
            return this._memory || {};
        }
    };

    /**
     * getAll 读取整个对象，get方法不传参的别名
     * @return {Object} cookie记忆的对象
     */
    Memory.prototype.getAll = function () {
        return this.get();
    };

    /**
     * clean 清除cookie
     * @return void
     */
    Memory.prototype.clean = function() {
        var date = new Date();
        var expires = date.toUTCString();
        // 立即过期
        $g.cookie(this._key, 'nothing;expires=' + expires);

        this._skipGet = true;
        this._memory = null;
    };

    return Memory;
}());

/**
 * 这个函数不由页面直接调用
 * 编码当前url，这个url为相对地址，作为跳转到下一个页面时的query参数，
 * @returns {string}
 */
$g.getCurrentUrl = function(){
    var currentUrl = window.location.pathname+window.location.search;
    currentUrl = $g.URLEncoder.encode(currentUrl);
    return currentUrl;
};
/**
 * 用于上报按钮或海报点击数
 * @param page  当前页面
 * @param poster  对应海报或按钮
 */
$g.clickCount = function(page,poster){
    // var url = "/api/v1/Poster?page="+page+"&pos="+poster;
    // $g.ajax(url,function(){});
};
/**
 * 用于上报打点, 根据probeDot.js里的配置文件,来传递层级, 通过解析字符串进行编码上报
 * @param {String} pos 'pet.mySkill.add'
 * @param {Sring} var_val '万箭齐发'
 */
$g.probeDot = function(pos, var_val) {
    var data = $g.__ProbeDotData;   // 打点位置配置文件路劲/assets/js/probeDot.js
    if(!pos || !data) {
        $g.error('缺少打点配置文件$g.__ProbeDotData或者必要参数pos:%s', pos);
        return;
    }
    var url, posCode = '';
    var api = '/api/v1/Pogopin?';
    var arr = pos.split('.');
    var catche = null, item;
    for(var i=0, _l = arr.length; i < _l; i++) {
        if(i==0) {
            catche = data;
        }else {
            catche = catche[arr[i-1]].children || {};
        }
        item = catche[arr[i]] || {};
        if(!item.id) {
            $g.error('打点上报出错,找不到对应id: %s', pos);
            return;
        }
        if(i < _l - 1) {
            posCode = posCode + item.id + '_';
        }else {
            posCode = posCode + item.id;
        }
    }
    url = api + 'posCode=' + posCode;
    if(var_val) url = url + '&var_val=' + var_val;
    $g.ajax(url, null, true);
};
$g.EMPTY = '/assets/img/pure.png';  // 空的透明图
/**
 * 注意：此方法只能在高清盒子上使用
 * @param id {String} 播放GIF的id
 * @param imgs {Array} 存放所有图片的数组
 * @param [speed=300] {Number} 可选参数，每一帧的播放时间默认300ms
 * @param [option] {Object} 可选参数，GIF的额外选项
 *      [option.times] {Number} gif播放次数，默认循环播放
 *      [option.frame] {String} 停止GIF后显示的关键帧 可选第一帧（first）或最后一帧（last） 或自定义（传入图片地址），默认在哪一帧stop就显示哪一帧
 *      [option.cb] {Array} 每一帧的回调函数，并带有自身的GIF实例对象
 * @returns {{}}
 */
$g.createGif = function (id, imgs, speed, option) {
    // speed = speed || 300;
    var _preLoadImg = function() {
        var that = s;
        var type = typeof that.imgs;
        if(!(that.imgs instanceof Array)) {
            console.log('** the type of second argument(imgs) is wrong, expect Array get %s(id:%s)', type, that.idName);
            return;
        }
        var len = that.fbs = that.imgs.length;
        var imgObjs = [];

        for(var i=0; i < len; i++) {
            that.preLoadImgs[i] = that.imgs[0];  // 先默认都填充第一张图;
            imgObjs[i] = new Image();
            imgObjs[i].seq = i;
            // IE8及以下版本不支持onload事件,但支持onreadystatechange事件;
            // readyState是onreadystatechange事件的一个状态,值为loaded或complete的时候,表示已经加载完毕;
            imgObjs[i].onload = imgObjs[i].onreadystatechange = function() {
                if(!this.readyState||this.readyState=='loaded'||this.readyState=='complete'){
                    // 加载完成, 替换预设的图片路径为真正需要的图片路径;
                    that.preLoadImgs[this.seq] = that.imgs[this.seq];
                }
            }
            imgObjs[i].onerror = function() {
                // $g.warn('***** [$g.createGif]img preload callback [img.onerror],id[%o],seq[%s]', that.idName, this.seq);
                that.preLoadImgs[this.seq] = $g.EMPTY;
                this.onerror = null;
            }
            // 先注册onload事件,再设src, ie浏览器会因为缓冲区的原因,先设src再注册onload有时候不触发onload事件;
            imgObjs[i].src = that.imgs[i];
        }
    };
    var s = {};
    s.idName = id;
    s.id = $g.id(id);
    s.imgs = imgs;
    s.fbs = 0;  // 默认是0帧
    s.preLoadImgs = [];  // 预加载完的图片放这里
    s.timer = null;
    s.speed = speed || 300;
    s.option = option || null;
    s.times = 0;
    s.index = 0;

    s._roll = function () {
        var cb = this.option && this.option.cb;
        if (this.index >= this.fbs) this.index = 0;
        this.id.src = this.preLoadImgs[this.index];
        if(cb) {
            if(typeof this.option.cb == 'function') {
                if(this.index === this.fbs - 1) cb(this);
            }else {
                if(cb[this.index]) cb[this.index](this);
            }
        }
        this.index++;
    };
    s.stop = function (cb) {
        clearTimeout(this.timer);
        this.times = 0;
        this.index = 0;
        if(cb) cb(this);
        if (!this.option) return;
        if (this.option.frame === 'first') {
            this.id.src = this.preLoadImgs[0];
        } else if (this.option.frame === 'last') {
            var len = this.fbs;
            this.id.src = this.preLoadImgs[len - 1];
        } else if (this.option.frame) {
            this.id.src = this.option.frame;
        }
    };
    s.start = function () {
        if (this.index === this.fbs) this.times++;
        if (this.option && this.option.times && this.times === this.option.times) {
            this.stop();
            return;
        }
        this._roll();
        var that = this;
        this.timer = setTimeout(function () {
            that.start();
        }, this.speed);
    };
    _preLoadImg(); // 创建gif时进行图片预加载
    return s;
};
/*
 *控制div从一个位置到另一个位置的移动的动画;
 *endCb stop结束后的回调;
 *obj {id:'', begin:[left,top], end: [left,top], speed: 2000, isloop:true, endCb:function(){}}}
 */
$g.move = function (obj) {
    var m = {};
    m.fbs = 20; // 帧数
    m.el = $g.id(obj.id);
    m.begin = obj.begin;
    m.end = obj.end;
    m.speed = parseInt(obj.speed / m.fbs);
    m.isloop = obj.isloop;
    m.Xdistance = m.end[0] - m.begin[0];
    m.Ydistance = m.end[1] - m.begin[1];
    m.Xper = parseInt(m.Xdistance / m.fbs);
    m.Yper = parseInt(m.Ydistance / m.fbs);
    m.endCb = obj.endCb;
    m.timer = null;
    m.current = [m.begin[0], m.begin[1]];
    m.count = 0;
    m.flag = ''; // 3是指left,top都移动, 2--只改变top, 1--只改变left
    m._check = function () {
        if (this.Xdistance === 0) {
            if (this.Ydistance === 0) return false;
            else return '2';
        } else {
            if (this.Ydistance === 0) return '1';
            else return '3';
        }
    };
    m.start = function () {
        var that = this;
        if (this.count === 0) {
            this.flag = this._check();
            if (!this.flag) return;
        }
        this.count = 1;
        this.timer = setTimeout(function () {
            that.start();
        }, this.speed);
        // 设置left值
        if (this.flag === '1' || this.flag === '3') {
            this.current[0] += this.Xper;
            this.el.style.left = this.current[0] + 'px';
            if ((this.current[0] >= this.end[0] && this.Xdistance >= 0) || (this.current[0] <= this.end[0] && this.Xdistance < 0)) {
                this.current[0] = this.begin[0];
                if (!this.isloop) {
                    this.stop();
                    this.el.style.left = this.end[0] + 'px';
                }
            }
        }
        // 设置top值
        if (this.flag === '2' || this.flag === '3') {
            this.current[1] += this.Yper;
            this.el.style.top = this.current[1] + 'px';
            if ((this.current[1] >= this.end[1] && this.Ydistance >= 0) || (this.current[1] <= this.end[1] && this.Ydistance < 0)) {
                this.current[1] = this.begin[1];
                if (!this.isloop) {
                    this.stop();
                    this.el.style.top = this.end[1] + 'px';
                }
            }
        }
    };
    // 停止
    m.stop = function () {
        clearTimeout(this.timer);
        if (this.endCb) this.endCb(this);
    };
    // 临时暂停一会: time 暂停时间
    m.pause = function (time, cb) {
        clearTimeout(this.timer);
        var that = this;
        if (cb) cb(that.el);
        setTimeout(function () {
            that.start();
        }, time);
    };
    return m;
};
/**
 * 加载gdds后会生成一个$g.Screen对象，如果本页面需要启用屏保，则通过$g.Screen.init() 方式初始化屏保功能即可
 * 初始化传入参数 flag为页面标记 ，openLimitTime为展开屏保所需时间
 */
$g.Screen = {
    'is_off' : 0,//不启用 无需屏保
    'is_on' : 1,//启用 能够展开屏保
    'is_open' : 2,//屏保已展开（展开中）
    'is_close' : 3,//屏保当前被收回（展开过）
    'flag' : '未知来源',
    'status' : 0,//当前屏保状态 默认不启用
    'openTimer' : null,//屏保展开计时器
    'rollTimer' : null,//屏保图片轮播计时器
    'openLimitTime' : 10*60*1000,//屏保展开默认所需时长
    'openCountTime' : 0,//屏保展开计时
    'rollLimitTime' : 8*1000,//屏保轮播切图所需时长
    'containerId' : 'shaoer_screen',//屏保容器元素id
    'imgId' : 'shaoer_screen_img',//屏保图片元素id
    'list' : [],//屏保配置列表
    'index' : 0,//当前使用的屏保配置序列
    'api' : "/api/v1/GetRecommend?page=homeRecommend&key=screen",//屏保配置获取接口
    //启用屏保
    'init' : function(flag,openLimitTime){
        this.status = this.is_on;
        this.flag = flag || this.flag;
        this.openLimitTime = openLimitTime || this.openLimitTime;
        this.runClock();
    },
    //屏保启用监听时钟，当前页面启用后保持运行
    'runClock' : function(){
        var that = this;
        this.openTimer = setTimeout(function(){
            that.runClock();
            if(that.status == that.is_open){
                return;
            }
            if(that.openCountTime < that.openLimitTime){
                that.openCountTime += 300;
            }else{
                that.open();
            }
        },300);
    },
    //展开屏保
    'open' : function(){
        $g.clickCount("screen-open",this.flag+"第"+(this.index+1)+"屏保");
        if(vplayer) vplayer.pause();
        if(this.status == this.is_close){
            $g.show(this.containerId);
            this.status = this.is_open;
            $g.id(this.imgId).parentNode.className = 'carousel-fade-in-and-out';
            this.roll();
            return;
        }
        var divObj = document.createElement("div");
        divObj.id = this.containerId;
        divObj.style.zIndex = '100001';
        divObj.innerHTML = "<div style='position:absolute;left:0px;top:0px;width:1280px;height:720px;background-color:black;'></div>\
            <div class='carousel-fade-in-and-out'><img id='"+this.imgId+"'/></div>";
        document.body.appendChild(divObj);
        var that = this;
        $g.ajax(this.api,function(result){
            that.list = JSON.parse(result).recommendData;
            that.status = that.is_open;
            that.roll();
        });
    },
    //收回屏保
    'close' : function(){
        if(vplayer) vplayer.play();
        this.openCountTime = 0;
        this.status = this.is_close;
        $g.hide(this.containerId);
        $g.id(this.imgId).parentNode.className = '';
        $g.clickCount("screen-close",this.flag+"第"+(this.index+1)+"屏保");
    },
    //启用轮播
    'roll' : function(){
        if(!this.list || this.list.length < 1) return;
        if(this.index == this.list.length) this.index = 0;
        $g.id(this.imgId).src = this.list[this.index].img;
        var that = this;
        this.rollTimer = setTimeout(function() {
            that.index ++;
            that.roll();
        }, this.rollLimitTime);
    },
    //屏保点击跳转
    'jump' : function(){
        clearTimeout(this.openTimer);
        clearTimeout(this.rollTimer);
        this.status = this.is_off;
        $g.clickCount("screen-jump",this.flag+"第"+(this.index+1)+"屏保");
        $g.redirect(this.list[this.index].url);
    },
    'onKeyDown' : function(e){
        if(this.status == this.is_open){
            if($g.event(e).keyCode == $g.KeyCodes.ENTER){
                this.jump();
            }else{
                this.close();
            }
            return true;
        }
        if(this.status != this.is_off){
            this.openCountTime = 0;
        }
        return false;
    }
};
/**
 * 获取网页url上的参数,return key and value
 * @return {}
 */
$g.getQuery = function () {
    var urlStr = window.location.search.substr(1);
    var temp = [],
        query = {},
        key, val, arr;
    temp = urlStr.split('&');
    if (!temp[0]) return query;
    for (var j = 0; j < temp.length; j++) {
        arr = temp[j].split('=');
        key = arr[0];
        val = arr[1];
        query[key] = val;
    }
    // console.log(query);
    return query;
};

/**
 * 一个拼接url的方法,可以对url进行添加参数, 同时支持多层页面地址嵌套处理;
 * @param 参数个数决定嵌套层数
 * @param {Object | String} String类型时,代表页面的url地址,url可以是http://开头url或者/router路由
 * 如果要对url添加参数,传入Object{pageUrl: String, props: Object},
 * pageUrl 为url地址,props中以键值对传入参数名和值, props可以为null或'',表示不需要添加参数
 * @示例: $g.assembleUrl('/jump_page?theme=a&item=b',
 *                      {pageUrl: '/recommend/zzx', props:{focus: 'a1_btn',page: 1}},
 *                      '/home');
 * @return "/jump_page?theme=a&item=b&backUrl=%2Frecommend%2Fzzx%3Ffocus%3Da1_btn%26page%3D1%26backUrl%3D%252Fhome"
 */
$g.assembleUrl = function() {
    var _equal = '=';
    // 获取连接符
    var getSymbol = function(url){
        return url.indexOf('?') === -1 ? '?' : '&';
    };
    // 检测页面的url是否合法
    var checkPageUrl = function(pu) {
        if(!pu) return false;
        if(pu.indexOf('%') !== -1) return false; // url不能是编码过的
        if(pu.indexOf('http://') === 0) return true;
        if(pu.indexOf('/') !== 0) return false;  // 地址不是http开头的,且不是以/开头的是非法地址
        return true;
    };
    // 拼接某个页面地址的参数
    var putArgs = function(config) {
        var u = config.pageUrl;
        if(!checkPageUrl(u)) return '';
        var args = config.props;
        if(!args) return u;
        for(var k in args) {
            if(!args[k]) continue;
            u = u + getSymbol(u) + k + _equal + args[k];
        }
        return u;
    };
    // 累加,将当前处理的和上一次处理的结果进行拼接,上一个作为当前的backUrl
    var _reduce = function(pre, cur){
        if(!cur) return pre;
        return pre ? cur + getSymbol(cur) + 'backUrl' + _equal + encodeURIComponent(pre) : cur;
    };
    var configs = arguments;
    var al = configs.length;
    var config,
        pageUrl = '', targetUrl = '';
    // 对传入的参数配置项,倒过来for循环,后一个作为前一个的backUrl
    for(var i = al; i--; ) {
        config = configs[i];
        pageUrl = typeof config === 'string' ? (checkPageUrl(config) ? config : '') : putArgs(config);
        targetUrl = _reduce(targetUrl, pageUrl);
        if(i === 0) {
            if (!pageUrl) targetUrl = '';  // 第一层链接因为参数不合法不能成功拼接的话,就回个''
            return targetUrl;
        }
    }
};

/**
 * 加载插件方法 目前页面上需要调用的也仅有init
 */
$g.loading = {
    /**
     * 初始化插件
     * @param info  插件信息
     * @param installCb  开始安装插件事件
     * @param progressCb 安装进度条事件
     * @param resultCb 安装结果事件
     * @param startCb 安装成功后打开插件事件
     * @returns {*}
     */
    "init": function(info, installCb, progressCb, resultCb, startCb){
        this.pkgname = info.pkgname;
        this.pkgclass = info.pkgclass;
        this.downloadurl = info.downloadurl;
        this.version = info.version;

        if(this._isInstalled() && !this._isDiffVersion()) return this._start(startCb);
        else this._install(installCb, progressCb, resultCb, startCb);
    },
    "_isInstalled": function(){
        return window.joyuhost.isPluginInstalled(this.pkgname);
    },
    "_isDiffVersion": function(){
        //如果没有指定版本 默认不更新（已安装的前提下）
        var version = window.joyuhost.getPluginVersion(this.pkgname);
        return this.version ? version == this.version : false;
    },
    "_start": function(done){
        done && done();
        window.joyuhost.startPluginActivity(this.pkgname, this.pkgclass);
    },
    "_install": function(installCb, progressCb, resultCb, startCb){
        var that = this;
        function progress(current, total){
            progressCb && progressCb(current, total);
        }
        function success(url){
            resultCb && resultCb(null, url);
            that._start(startCb);
        }
        function fail(url){
            var err = "安装或者下载" + url + "失败";
            resultCb && resultCb(err, url);
        }
        window.joyuhost.installPlugin(this.downloadurl, 'progress', 'success', 'fail');
    },
    //卸载插件
    "unInstall": function(pkgname, resultCb) {
        var that = this;
        function success(){
            resultCb && resultCb();
        }
        function fail(){
            var err = "卸载失败";
            resultCb && resultCb(err);
        }
        window.joyuhost.unInstallPlugin(pkgname, 'success', 'fail');
    },
    //预加载(只对已安装的插件有用, 加快插件的打开速度)
    "preLoad": function(pkgname, resultCb) {
        var that = this;
        function success(){
            resultCb && resultCb();
        }
        function fail(){
            var err = "预加载失败";
            resultCb && resultCb(err);
        }
        window.joyuhost.preLoadPlugin(pkgname, 'success', 'fail');
    },
    "goBackPage": function(){
        window.joyuhost.goBackPage();
    }
};

// 用这个变量控制指定图片更换
$g.skin = '';// '' 为默认皮肤（紫色） newYear 为新年皮肤