chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
    var front, back;

    if (request.action == "cardAdd") {
        // Get selected text and trim it
        front = window.getSelection().toString().replace(/^\s+|\s+$/g, '');
        if (request.promptForBack) {
            back = prompt('Back side of "' + front + '": ');
            // Add card only if ok was pressed
            if (back != null) {
                sendResponse({ card: { front: front, back: back }});
            }
        } else {
            // Just add selected word
            sendResponse({ card: { front: front }});
        }
    } else if (request.action == "cardAddSuccess") {
        onCardAddSuccess(request.card, request.confirm);
    } else if (request.action == "cardAddError") {
        onCardAddError(request.card, request.reason);
    }
});


function onCardAddError(card, reason) {
    reason = reason || "Unknown";
    alert('Error adding \n\n"' + card.front + '"\n\n to deck: \n  ' + reason);
}


function onCardAddSuccess(card, confirm) {
    var msg = 'Card \n\n"' + card.front + '"\n';

    if (!confirm) {
        return;
    }
    if (card.back) {
        msg += ' -> \n"' + card.back + '"\n\n';
    }
    msg += ' added!';
    alert(msg);
}
