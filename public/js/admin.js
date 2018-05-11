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
                        fetch('get_users/all', {
                            method: 'GET',
                            credentials: 'same-origin'
                        }).then(function(response) {
                            response.text().then(function(usersTXT) {
                                users = JSON.parse(usersTXT);
                                console.log(users);
                                var content = document.getElementById('content');
                                var par = document.createElement('h4');
                                par.style.paddingLeft = '5%';
                                par.innerText = 'List of Users';
                                content.appendChild(par);
                                var row = document.createElement('div');
                                users.forEach(element => {
                                    console.log(element);
                                    row.className = 'row';
                                    var anc = document.createElement('a');
                                    anc.href = ('/dispuser?id=' + element.username);
                                    anc.style.color = 'black';
                                    var div = document.createElement('div');
                                    div.style.margin = '2% 4% 2% 4%';
                                    div.style.wordWrap = "break-word";
                                    div.style.backgroundColor = '#f2e8e8';
                                    div.style.borderColor = '#E7E7E7';
                                    div.style.fontFamily = 'arial,sans-serif;'
                                    div.style.paddingTop = '10px';
                                    div.className = "col-xs-12 col-sm-6 col-md-4 col-lg-3"
                                    div.style.borderRadius = '15px';
                                    div.innerHTML = `<p><b>username : </b>${element.username}<br><b>email : </b>${element.email}<br><b>admin : </b>${element.admin}</p><div>`
                                    anc.appendChild(div);
                                    row.appendChild(anc);
                                    row.style.margin = "2px 0 20px 0";
                                    row.style.padding = "5px";
                                });
                                content.appendChild(row);
                            });
                        });
                    } else {
                        //null
                    }
                });
            });
        });
    });
}