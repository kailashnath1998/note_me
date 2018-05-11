window.document.getElementById('register-button').onclick = function() {
    var data = {
        email: window.document.getElementById('email').value,
        uname: window.document.getElementById('uname').value,
        psw: window.document.getElementById('psw').value
    }
    if (data.email.length > 0 && data.uname.length > 0 && data.psw.length > 0) {
        fetch('/direct_add', {
            method: 'POST', // or 'PUT'
            body: JSON.stringify(data), // data can be `string` or {object}!
            headers: new Headers({
                'Content-Type': 'application/json'
            }),
            credentials: 'same-origin'
        }).then(function(response) {
            response.text().then(function(message) {
                console.log(message);
                if (message == 'User Registered Successfully') {
                    window.document.getElementById('email').innerText = ' ';
                    window.document.getElementById('email').disabled = true;
                    window.document.getElementById('uname').innerText = ' ';
                    window.document.getElementById('uname').disabled = true;
                    window.document.getElementById('psw').innerText = ' ';
                    window.document.getElementById('psw').disabled = true;
                    window.document.getElementById('register-button').disabled = true;
                    window.document.getElementById('msg').innerHTML = "<i class=\"glyphicon glyphicon-ok-circle\"></i><b>" + message + "</b>"
                } else {
                    window.document.getElementById('msg').innerHTML = "<i class=\"glyphicon glyphicon-ban-circle\"></i><b>" + message + "</b>"
                }
            });
        });
    }
};

window.onload = function() {
    fetch('/get_user', {
        method: 'GET',
        credentials: 'same-origin'
    }).then(function(response) {
        response.text().then(function(user) {
            fetch('/isadmin/' + user).then(function(response) {
                response.text().then(function(result) {
                    if (result == 'true') {
                        document.getElementById('admin').innerHTML = '<a href="/admin"><span class="glyphicon glyphicon-modal-window"></span> Admin Control </a>'
                        document.getElementById('new_user').innerHTML = document.getElementById('new_user').innerHTML = '<a href="/admin_add"><span class="glyphicon glyphicon-plus-sign"></span> Add New User </a>'
                    } else {}
                });
            });
        });
    });
}