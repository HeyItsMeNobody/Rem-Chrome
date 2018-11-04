setInterval(function() {
    try {
        chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
            var url = tabs[0].url;
            
            var step1 = url.replace("http://", "");
            var finish = step1.replace("https://", "");
            finish = finish.substring(0, finish.indexOf('/')+1).replace('/', '');
                
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
            var data = JSON.stringify({"details":`${finish}`,"state":"N/A", "largeImageKey":"chrome"});
            xhr.send(data);
            
            console.log(`RemChrome: Send RPC to http://localhost:9999/api/chrome with data ${data}`);
        });
    }
    catch (e) {
        console.log(`Error: ${e}`)
    }
}, 1000);