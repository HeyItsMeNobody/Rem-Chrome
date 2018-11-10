var contextMenuControlPanel = {
    "id": "controlpanel",
    "title": "Control Panel",
    "contexts": ["all"]
};
var contextMenuOn = {
    "id": "on",
    "title": "On",
    "contexts": ["all"]
};
var contextMenuOff = {
    "id": "off",
    "title": "Off",
    "contexts": ["all"]
};
Toggle = true;

chrome.contextMenus.create(contextMenuControlPanel);
chrome.contextMenus.create(contextMenuOn);
chrome.contextMenus.create(contextMenuOff);

chrome.contextMenus.onClicked.addListener(function(contextMenuClick) {
    if (contextMenuClick.menuItemId == "controlpanel") {
        chrome.tabs.create({ url: "http://localhost:9999/" });
    }
    if (contextMenuClick.menuItemId == "on") {
        Toggle = true;
    }
    if (contextMenuClick.menuItemId == "off") {
        Toggle = false;
    }
});

setInterval(function() {
    if (Toggle == true) {
        try {
            chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
                var url = tabs[0].url;
                
                var step1 = url.replace("http://", "");
                var step2 = step1.replace("https://", "");
                var finish = step2.replace("www.", "");
                if (finish.indexOf('chrome://') == 0) {}
                else finish = finish.substring(0, finish.indexOf('/')+1).replace('/', '');
                if (finish == 'youtube.com') {
                    var ytVideoID = step2;
                }
    
                xhr = new XMLHttpRequest();
                var url = "http://localhost:9999/api/chrome";
                xhr.open("POST", url, true);
                xhr.setRequestHeader("Content-type", "application/json");
                xhr.onreadystatechange = function () { 
                    if (xhr.readyState == 4 && xhr.status == 200) {
                        var json = JSON.parse(xhr.responseText);
                        console.log(`RemChrome: Received message from localhost back: ${json.message}`)
                    }
                }
    
                if(finish == "youtube.com") {
                    var data = JSON.stringify({"details":`${finish}`,"state":`${ytVideoID}`, "largeImageKey":"chrome"});
                } else {
                    var data = JSON.stringify({"details":`${finish}`,"state":"N/A", "largeImageKey":"chrome"});
                }
    
                xhr.send(data);
                console.log(`RemChrome: Send RPC to http://localhost:9999/api/chrome with data ${data}`);
            });
        }
        catch (e) {
            console.log(`Error: ${e}`)
        }
    }
}, 1000);