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
                        document.getElementById('new_user').innerHTML = document.getElementById('new_user').innerHTML = '<a href="/delete?id=' + user + '"><span class="glyphicon glyphicon-trash"></span> Delete User </a>'
                    };
                });
            });
        });
    });
    fetch('/get_user_det', {
        method: 'GET',
        credentials: 'same-origin'
    }).then(function(response) {
        response.text().then(function(message) {
            message = JSON.parse(message);
            var username = window.document.getElementById('user');
            var email = window.document.getElementById('email');
            var cbox = window.document.getElementById('cadmin');
            var save = window.document.getElementById('save');
            username.innerText = username.innerText.split(':')[0] + ' : ' + message.username;
            email.innerText = email.innerText.split(':')[0] + ' : ' + message.email;
            document.getElementById('new_user').innerHTML = document.getElementById('new_user').innerHTML = '<a href="/delete?id=' + message.username + '"><span class="glyphicon glyphicon-trash"></span> Delete User </a>'
            if (message.admin == true) {
                cbox.checked = true;
            }
            cbox.disabled = true;
        })
    });
}

window.onload = start();