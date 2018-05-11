window.document.getElementById('register-button').onclick = function() {
    var data = {
        email: window.document.getElementById('email').value,
        uname: window.document.getElementById('uname').value,
        psw: window.document.getElementById('psw').value
    }
    if (data.email.length > 0 && data.uname.length > 0 && data.psw.length > 0) {
        fetch('http://' + window.location.host + '/new_user', {
            method: 'POST', // or 'PUT'
            body: JSON.stringify(data), // data can be `string` or {object}!
            headers: new Headers({
                'Content-Type': 'application/json'
            }),
            credentials: 'same-origin'
        }).then(function(response) {
            response.text().then(function(message) {
                if (message == 'User Registered Successfully') {
                    window.document.getElementById('email').innerText = ' ';
                    window.document.getElementById('email').disabled = true;
                    window.document.getElementById('uname').innerText = ' ';
                    window.document.getElementById('uname').disabled = true;
                    window.document.getElementById('psw').innerText = ' ';
                    window.document.getElementById('psw').disabled = true;
                    window.document.getElementById('register-button').disabled = true;
                    window.document.getElementById('msg').innerHTML = "<i class=\"glyphicon glyphicon-ok-circle\"></i><b>" + message + "</b> - Please <a href = 'http://" + window.location.host + " '> Sign in</a> to contiue";
                } else {
                    window.document.getElementById('msg').innerHTML = "<i class=\"glyphicon glyphicon-ban-circle\"></i><b>" + message + "</b>"
                }
            });
        });
    }

};

window.onload = function() {
    document.getElementById('nav-signin').href = 'http://' + window.location.host;
    document.getElementById('nav-logo').href = 'http://' + window.location.host;
};