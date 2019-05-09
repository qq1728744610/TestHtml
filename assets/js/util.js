var LgnUtil = function () {
    this.ajax = function (url, cb, async) {
        var xmlhttprequest = null;
        if (window.XMLHttpRequest)
            xmlhttprequest = new XMLHttpRequest();
        else if (window.ActiveXObject)
            xmlhttprequest = new ActiveXObject("Microsoft.XMLHTTP");
        xmlhttprequest.onreadystatechange = function () {
            if (xmlhttprequest.readyState == 4) {
                if (xmlhttprequest.status == 200 || xmlhttprequest.status == 0) {
                    if (!cb) return;
                    // 前端并不知道发送ajax返回的结果是不是json格式,也可能只是一个普通的text
                    // 所以这里不应该parse他,而是应该交给回调者自行处理返回结果
                    //var result = JSON.parse(xmlhttprequest.responseText);
                    var result = xmlhttprequest.responseText;
                    cb(result);
                }
                xmlhttprequest = null;
            }
        };
        xmlhttprequest.open("GET", url, async);
        xmlhttprequest.send(null);
    };

    this.warn = function (msg) {
        this.ajax(this.logUrl + '?msg=' + msg, null, true);
    };

    var logUrl = "";
    this.logUrl = logUrl;
};