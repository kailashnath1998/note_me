window.document.getElementById('login-button').onclick = function() {
    var json = {
        json: JSON.stringify({
            uname: window.document.getElementById('uname').value,
            psw: window.document.getElementById('psw').value
        }),
        delay: 1
    };
    var data = {
        uname: window.document.getElementById('uname').value,
        psw: window.document.getElementById('psw').value
    }
    fetch('http://' + window.location.host + '/login', {
        method: 'POST', // or 'PUT'
        body: JSON.stringify(data), // data can be `string` or {object}!
        headers: new Headers({
            'Content-Type': 'application/json'
        }),
        credentials: 'same-origin'
    }).then(function(response) {
        response.text().then(function(message) {
            if (message == 'success')
                window.location.reload();
            else {
                window.document.getElementById('msg').innerText = message;
            }
        });
    });
}


window.document.getElementById('reset-button').onclick = function() {
    console.log("YES");
    document.getElementById('id01').style.display = 'block'
}

window.onclick = function(event) {
    var modal = document.getElementById('id01');
    if (event.target == modal) {
        var msg_disp = window.document.getElementById('msg_1');
        msg_disp.innerHTML = ' ';
        modal.style.display = "none";
    }
}

window.document.getElementById('fsubmit').onclick = function() {
    console.log('YUP');
    var update_username = window.document.getElementById('funame').value;
    if (update_username.length > 0) {
        fetch('/reset/' + update_username).then(function(response) {
            response.text().then(function(message) {
                var msg_disp = window.document.getElementById('msg_1');
                if (message == 'success') {
                    msg_disp.innerHTML = "<i class=\"glyphicon glyphicon-ok-circle\"></i>Instructions have been mailed to you Please check mail to contiue";
                } else {
                    msg_disp.innerText = "<i class=\"glyphicon glyphicon-ban-circle\"></i><b>" + message;
                }
            });
        });
    }
}

window.document.getElementById('close-z-1').onclick = function() {
    var modal = document.getElementById('id01');
    var msg_disp = window.document.getElementById('msg_1');
    msg_disp.innerHTML = ' ';
    modal.style.display = "none";
}