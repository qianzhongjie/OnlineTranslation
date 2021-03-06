﻿// Your code here!

(function () {
    "use strict";

    //封装htttp请求 get post
    function httpRequest(url, type, data, result) {
        //var name = encodeURI("北京西");
        //var dzb = "username=" + name + "&password=123";
        var xmlhttp = null;
        if (window.ActiveXObject) {
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }
        else if (window.XMLHttpRequest) {
            xmlhttp = new XMLHttpRequest();
        }
        //请求方法
        function send(datas) {
            if (type == 'get' || type == 'GET') {
                xmlhttp.open("GET", url + '?' + datas, true);
                xmlhttp.send(null);
            } else {
                xmlhttp.open("POST", url, true);
                xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;");  //用POST的时候一定要有这句
                xmlhttp.send(datas);
            }
            xmlhttp.onreadystatechange = callhandle;
        }
        //遍历对象组装成字符串=&
        function allPrpos(obj) {
            // 用来保存所有的属性名称和值  
            var props = "";
            // 开始遍历  
            for (var p in obj) {
                // 方法  
                if (typeof (obj[p]) == "function") {
                    obj[p]();
                } else {
                    // p 为属性名称，obj[p]为对应属性的值  
                    props += p + "=" + obj[p] + "&";
                }
            }
            // 最后显示所有的属性  
            return props.substring(0, props.length - 1);
        }
        //回调函数
        function callhandle() {
            if (xmlhttp.readyState == 4) {
                if (xmlhttp.status == 200) {
                    var objs = eval('(' + xmlhttp.responseText + ')');
                    result(objs);
                    //alert(xmlhttp.responseText);
                }
            }
        }
        //开始请求
        if (xmlhttp != null) {
            //封装请求参数
            var s = allPrpos(data);
            send(s);
        }
    }

    //获取select值
    function getSelectValve(elementString) {
        var obj = document.getElementById(elementString);
        var index = obj.selectedIndex; // 选中索引

        var text = obj.options[index].text; // 选中文本

        var value = obj.options[index].value; // 选中值
        return value;
    }

    //去字符串空格
    function trimString(str) {
        return str.replace(/(^\s*)|(\s*$)/g, "");
    }


    //交换option
    function delOption() {
        var sel = document.getElementById("fromLug");
        var sele = document.getElementById("toLug");
        var option1 = null;
        for (var i = 0; i < sel.options.length; i++) {
            if (sel.options[i].selected) {
                option1 = sel.options[i];
                sel.options.remove(i);

                break;
            }
        }
        var option2 = null;
        for (var i = 0; i < sele.options.length; i++) {
            if (sele.options[i].selected) {
                option2 = sele.options[i];
                sele.options.remove(i);

                break;
            }
        }
        if (option1 != null && option2 != null) {

            addOption("fromLug", option2.value, option2.text);
            addOption("toLug", option1.value, option1.text);

        }
    }
    //新增option并选中
    function addOption(idString, value, text) {
        var sel = document.getElementById(idString);
        var op = document.createElement("option");
        op.value = value;
        op.text = text;
        op.selected = 'selected';
        sel.add(op);
    }
    //默认
    function disabledDefault() {
        var obj = document.getElementById("swithObj");
        if (getSelectValve("fromLug") == 'auto') {
            obj.setAttribute("disabled");
            obj.setAttribute('class', 'btn btn-default active');
        } else {
            obj.removeAttribute("disabled");
            obj.setAttribute('class', 'btn btn-default');
        }
    }

    //select change
    document.getElementById("fromLug").onchange = function () {
        disabledDefault();
    };

    //翻译common
    function fanYi() {
        if (trimString(document.getElementById("textarea").innerText) == '') {
            document.getElementById('resultData').innerHTML = "输入要翻译的文字";
            return;
        }
        var appid = '20160814000026741';
        var key = 'NbXwfWv1PSXsX5_6YNAa';
        var salt = (new Date).getTime();

        var query = document.getElementById("textarea").innerText;
        // 多个query可以用\n连接  如 query='apple\norange\nbanana\npear'
        var from = getSelectValve("fromLug");
        //$('#fromLug').val();
        var to = getSelectValve('toLug');
        var str1 = appid + query + salt + key;
        var sign = MD5(str1);
        httpRequest("http://api.fanyi.baidu.com/api/trans/vip/translate", "GET", {
            q: query,
            appid: appid,
            salt: salt,
            from: from,
            to: to,
            sign: sign
        }, function (obj) {
            try {
                if (obj != null && obj.trans_result.length > 0) {
                    document.getElementById('resultData').innerText = "" + decodeURIComponent('' + obj.trans_result[0].dst);
                }
            } catch (e) {

            }
        });
    }
    //自动增加高度textarea
    function resizeTextarea(idString) {
        // 最小高度
        var minRows = 7;
        // 最大高度，超过则出现滚动条
        var maxRows = 20;
        var t = document.getElementById(idString);
        if (t.scrollTop == 0) t.scrollTop = 1;
        while (t.scrollTop == 0) {
            if (t.rows > minRows)
                t.rows--;
            else
                break;
            t.scrollTop = 1;
            if (t.rows < maxRows)
                t.style.overflowY = "hidden";
            if (t.scrollTop > 0) {
                t.rows++;
                break;
            }
        }
        while (t.scrollTop > 0) {
            if (t.rows < maxRows) {
                t.rows++;
                if (t.scrollTop == 0) t.scrollTop = 1;
            }
            else {
                t.style.overflowY = "auto";
                break;
            }
        }
    }

    //交换点击时间
    document.getElementById("swithObj").addEventListener('click', function () {
        delOption();
    }, false);
    //翻译点击事件
    document.getElementById("postBtn").addEventListener('click', function () {
        fanYi();
    }, false);

    //获得焦点 监视回车键
    document.getElementById("textarea").onfocus = function () {

        document.onkeydown = function () {
            if (event.keyCode == 13) {
                fanYi();
            }
        }
    }

    disabledDefault();
})();
window.onerror = function (E) {
    debugger;
}




