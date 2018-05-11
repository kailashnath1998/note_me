window.onload = function() {
    document.getElementById('nav-logo').href = 'http://' + window.location.host;
    fetch('http://' + window.location.host + '/messages', {
        method: 'GET',
        credentials: 'same-origin'
    }).then(function(messages) {
        return messages.text().then(function(messages) {
            console.log(messages);
            if (messages == 'signin')
                window.location.href = 'http://' + window.location.host;
            if (messages.length > 0)
                messages = JSON.parse(messages);
            else
                messages = []
            var content = document.getElementById('content');
            if (true) {
                console.log('YES');
                document.getElementById('new_note').innerHTML = '<a href="/msg_edit?id=new"><span class="glyphicon glyphicon-plus-sign"></span> New Note </a>'
            }
            messages.forEach(element => {
                console.log(element);
                var row = document.createElement('div');
                row.className = 'row';
                var anc = document.createElement('a');
                anc.href = (window.location.href + 'msg_edit?id=' + element.id);
                anc.style.color = 'black';
                var div = document.createElement('div');
                div.style.wordWrap = "break-word";
                div.style.backgroundColor = '#f2e8e8';
                div.style.borderColor = '#E7E7E7';
                div.style.fontFamily = 'arial,sans-serif;'
                div.className = "col-xs-12 col-sm-12 col-md-12 col-lg-12";
                div.style.borderRadius = "15px";
                var txt = element.content;
                if (txt.length > 500)
                    txt = txt.substr(0, 499) + "..";
                div.innerHTML = `<p><h4>${element.title}</h4><font size = 2>${txt}</p><div>`
                anc.appendChild(div);
                row.appendChild(anc);
                row.style.margin = "2px 0 20px 0";
                row.style.padding = "5px";
                content.appendChild(row);
            });
        })
    });
    fetch('/get_user', {
        method: 'GET',
        credentials: 'same-origin'
    }).then(function(response) {
        response.text().then(function(user) {
            fetch('/isadmin/' + user).then(function(response) {
                response.text().then(function(result) {
                    if (result == 'true') {
                        document.getElementById('admin').innerHTML = '<a href="/admin"><span class="glyphicon glyphicon-modal-window"></span> Admin Control </a>'
                    } else {
                        //null
                    }
                })
            })
            document.getElementById('user_disp').innerHTML = '<a href="/me"><span class="glyphicon glyphicon-user"></span> ' + user + ' </a>';
        })
    })
};

console.log("KNN ♥");