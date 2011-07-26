// Saves options to localStorage.
function save_options() {
    var status = document.getElementById("status");

    localStorage["confirm"] = document.getElementById("confirm_id").checked;
    localStorage["prompt"] = document.getElementById("prompt_id").checked;

    status.innerHTML = "Options Saved.";
    setTimeout(function() {
        status.innerHTML = "";
    }, 750);
}

// Restores select box state to saved value from localStorage.
function restore_options() {
    document.getElementById("confirm_id").checked = (localStorage["confirm"] == "true");
    document.getElementById("prompt_id").checked = (localStorage["prompt"] == "true");
}

