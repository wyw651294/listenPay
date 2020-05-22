// content-script必须要重新打开标签（打开标签的时候才会生成一个content-script）

chrome.extension.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.action === "getToken") {
            const token = localStorage.getItem("token");
            sendResponse(token);
        } else if (request.action === "startListen") {
            // sendResponse(request.token);
            // alert(`获取到了商户信息${request.token}`);
            // WebSocketTest(request.token)
            setPersonalInfo("姓名", "银行账号", 10);
        }
    }
);

// 模拟人工事件
function inputChangeValue(dom,eventName,st) {
    let evt = document.createEvent('HTMLEvents');
    evt.initEvent(eventName, true, true);
    dom.value = st;
    dom.dispatchEvent(evt)
}

// 设置转账信息
function setPersonalInfo(name, phone, money) {
    // 姓名
    inputChangeValue(document.getElementById("txmainfrm").contentDocument.getElementById("TR_SKZHMC").querySelector(".third_td").querySelector("input"),'change', name);
    // 电话、银行账号
    inputChangeValue(document.getElementById("txmainfrm").contentDocument.getElementById("TR_SKZH").querySelector(".third_td").querySelector("input"),'blur',phone);
    inputChangeValue(document.getElementById("txmainfrm").contentDocument.getElementById("TR_SKZH").querySelector(".third_td").querySelector("input"),'focusout',phone);
    // 金额
    inputChangeValue(document.getElementById("txmainfrm").contentDocument.getElementById("txtTranAmt"),'blur', money);
    // 下一步
    setTimeout(()=>{
        document.getElementById("txmainfrm").contentDocument.getElementById("subBut").click();
    },1000)
}

// websocket监听出款
function WebSocketTest(token) {
    if ("WebSocket" in window) {
        alert("您的浏览器支持 WebSocket!");
        // 打开一个 web socket
        var ws = new WebSocket('ws://192.168.1.103:9051/ws');
        ws.onopen = function () {
            // Web Socket 已连接上，使用 send() 方法发送数据
            const param = {
                "sn": 1,
                "msgid": 1,
                "data": {
                    "device_id": "1234567890"
                },
                "token": token || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJDdXN0b20iOnsiSUQiOjE2LCJVc2VyVHlwZSI6MCwiQWNjb3VudE5hbWUiOiJ0ZXN0IiwiTG9naW5JUCI6IjE5Mi4xNjguMS4xMDIifSwiZXhwIjoxNTkwMTQxODc1LCJpYXQiOjE1OTAwNTU0NzUsIm5iZiI6MTU5MDA1NTQ3NSwic3ViIjoiMTkyLjE2OC4xLjEwMiJ9.NeAvx3jd4fQossB3_db6nMr22bEB4uJx3e99SwdzLAY"
            }
            ws.send(JSON.stringify(param));
            alert("数据发送中...");
        };

        ws.onmessage = function (evt) {
            var received_msg = evt.data;
            console.log("数据已接收", received_msg);
            alert(JSON.stringify(received_msg));
        };

        ws.onclose = function () {
            // 关闭 websocket
            alert("连接已关闭...");
        };
    }

    else {
        // 浏览器不支持 WebSocket
        alert("您的浏览器不支持 WebSocket!");
    }
}