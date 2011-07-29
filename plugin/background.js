// Set default options
var options = {
    confirm: false,
    source: "prompt"
};

for (var key in options) {
    if (!localStorage[key]) {
        localStorage[key] = options[key];
    }
}

// Add menu item
var item = chrome.contextMenus.create({
    title: "Add to Anki",
    contexts: ["selection"],
    onclick: handleClick
});

function handleClick(info, tab) {
    chrome.tabs.sendRequest(tab.id, {
        action: "cardAdd",
        promptForBack: localStorage["source"] == "prompt"
    }, function(response){
        if (localStorage["source"] == "definition") {
            addCardDefinition(tab, response.card);
        } else {
            addCard(tab, response.card);
        }
    });
}

function addCardDefinition(tab, card) {
   var xhr = new XMLHttpRequest(),
       url = "http://services.aonaware.com/DictService/DictService.asmx/Define?word=" + card.front;

    xhr.open("GET", url);
    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var text = this.responseText.match(/<WordDefinition>\s*([\s\S]*?)\s*<\/WordDefinition>/)[1];

            card.back = text;
            addCard(tab, card);
        } else if (this.readyState == 4 && this.status != 200) {
            alert("Error while looking up for word's definition: "
                  + "\nstatus: " + this.status);
        }
    };
    xhr.send();
}


function addCard(tab, card) {
    var xhr = new XMLHttpRequest(),
        dataString = "action=Add&Front=" + card.front;

    // Anki does not support multiline input - split it
    card.front = card.front.replace("\\n", " ");
    if (card.back) {
        card.back = card.back.replace("\\n", " ");
        dataString += "&Back=" + card.back;
    }
    xhr.open("POST", "http://ankiweb.net/deck/edit");
    xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            handleXHRSuccess(this, tab, card);
        } else if (this.readyState == 4 && this.status != 200) {
            handleXHRError(this, tab, card);
        }
    };
    xhr.send(dataString);
}


function handleXHRSuccess(xhr, tab, card) {
    // Check if user was logged in
    if (xhr.responseText.search("Added OK!") > 0 ) {
        chrome.tabs.sendRequest(tab.id, {
            action: "cardAddSuccess",
            card: card,
            confirm: localStorage["confirm"] == "true"
        });
    // If sign up is displayed, than probably not
    } else if (xhr.responseText.search(/<h1>Sign Up<\/h1>/i) > 0) {
        chrome.tabs.sendRequest(tab.id, {
            action: "cardAddError",
            card: card,
            reason: "Are you logged in?"
        });
    //
    } else {
        chrome.tabs.sendRequest(tab.id, {
            action: "cardAddError",
            card: card,
            reason: "Unknown - Card already exists?"
        });
    }
}


function handleXHRError(xhr, tab, card) {
    chrome.tabs.sendRequest(tab.id, {
        action: "cardAddError",
        card: card,
        reason: "Bad response status"
    });
}
