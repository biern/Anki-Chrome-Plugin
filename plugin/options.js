// Saves options to localStorage.
function save_options() {
    var status = document.getElementById("status");

    localStorage["confirm"] = document.getElementById("confirm_id").checked;
    debugger;
    localStorage["source"] = document.getElementById("source_id").value;

    status.innerHTML = "Options Saved.";
    setTimeout(function() {
        status.innerHTML = "";
    }, 750);
}

// Restores select box state to saved value from localStorage.
function restore_options() {
    var source = document.getElementById("source_id"),
        sourceVal = localStorage["source"],
        confirm = document.getElementById("confirm_id");

    confirm.checked = (localStorage["confirm"] == "true");

    for (var i = 0; i < source.children.length; i++) {
        var child = source.children[i];
        if (child.value == sourceVal) {
            child.selected = "true";
            break;
        }
    }
}

