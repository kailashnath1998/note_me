var masterUser;

function start() {
    fetch('/get_user', {
        method: 'GET',
        credentials: 'same-origin'
    }).then(function(response) {
        response.text().then(function(user) {
            masterUser = user;
            fetch('/isadmin/' + user).then(function(response) {
                response.text().then(function(result) {
                    if (result == 'true') {
                        document.getElementById('admin').innerHTML = '<a href="/admin"><span class="glyphicon glyphicon-modal-window"></span> Admin Control </a>'
                        var id = window.location.search.split('=')[1];
                        fetch('/user?id=' + id, {
                            method: 'GET',
                            credentials: 'same-origin'
                        }).then(function(response) {
                            response.text().then(function(message) {
                                message = JSON.parse(message);
                                masterUser = message;
                                console.log(message);
                                var username = window.document.getElementById('user');
                                var email = window.document.getElementById('email');
                                var cbox = window.document.getElementById('cadmin');
                                var save = window.document.getElementById('save');
                                username.innerText = username.innerText.split(':')[0] + ' : ' + message.username;
                                email.innerText = email.innerText.split(':')[0] + ' : ' + message.email;
                                if (id != user)
                                    document.getElementById('new_user').innerHTML = document.getElementById('new_user').innerHTML = '<a href="/delete?id=' + message.username + '"><span class="glyphicon glyphicon-trash"></span> Delete User </a>'
                                if (message.admin == true) {
                                    cbox.checked = true;
                                    if (message.master == false)
                                        cbox.disabled = true;
                                    else if (masterUser == message.user)
                                        cbox.disabled = true;
                                }
                                save.disabled = false;
                            });
                        });
                    } else {}
                });
            });
        });
    });
}

window.onload = start();

window.document.getElementById('save').onclick = function() {
    if (masterUser == undefined) {
        var result = window.document.getElementById('result');
        result.innerHTML = 'try after some time';
    } else {
        var cbox = window.document.getElementById('cadmin');
        var result = window.document.getElementById('result');
        result.innerText = '';
        var details = {
            username: masterUser.username,
            email: masterUser.email,
            admin: cbox.checked
        };
        fetch('/updateStatus', {
            method: 'POST',
            body: JSON.stringify(details),
            headers: new Headers({
                'Content-Type': 'application/json'
            }),
            credentials: 'same-origin'
        }).then(function(response) {
            response.text().then(function(message) {
                result.innerHTML = message;
                start();
            })
        })
    }
}