let token = '';
$(function () {
    // 页面数据从content-script
    $("#btnGetToken").click(function () {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { action: "getToken"}, function (response) {
                var win = chrome.extension.getBackgroundPage();
                if(response) {
                    win.token=response;
                    alert(`获取到了商户token${win.token}`);
                } else {
                    alert("错误!!请确定当前是商户管理页面和商户已登录")
                }
            });  
        });
    });
    $("#btnListen").click(function () {
        var win = chrome.extension.getBackgroundPage();
        if (win.token) {
            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                chrome.tabs.sendMessage(tabs[0].id, { action: "startListen", token: win.token }, function (response) {
                    // alert(response);
                });
            }); 
        } else {
            alert("未获取到商户信息")
        }
    });
});

