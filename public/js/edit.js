var author = undefined;
var id_ = undefined;
var note = undefined;

window.onload = function() {
    var logo = document.getElementById('rootadd');
    var main_content = document.getElementById('main-content');
    logo.href = 'http://' + window.location.host;
    var id = window.location.search.split('=')[1];
    this.console.log(id);
    if (id == 'new') {
        main_content.innerHTML = '<b>Creating a new Note Hold on!<b>';
        fetch('http://' + window.location.host + '/get_note/new', {
            method: 'GET',
            credentials: 'same-origin'
        }).then(function(response) {
            response.text().then(function(newnote) {
                newnote = JSON.parse(newnote);
                window.location.href = 'http://' + window.location.host + '/msg_edit?id=' + newnote.id;
            });
        });
    } else {
        fetch('http://' + window.location.host + '/get_user', {
            method: 'GET',
            credentials: 'same-origin'
        }).then(function(user) {
            return user.text().then(function(user) {
                fetch('http://' + window.location.host + '/get_note/' + user + '/' + id).then(function(response) {
                    response.text().then(function(notefrmsev) {
                        if (notefrmsev == undefined)
                            alert('Error');
                        else {
                            note = JSON.parse(notefrmsev);
                            console.log(note);
                            author = note.author;
                            id_ = note.id;
                            document.getElementById('title-val').innerText = note.title;
                            document.getElementById('content').innerText = note.content;
                            var title = document.getElementById('title-val');
                            var content = document.getElementById('content');
                            setInterval(function save() {
                                console.log(title.value);
                                if (title.value != note.title || content.value != note.content) {
                                    note.title = title.value;
                                    note.content = content.value;
                                    console.log(note);
                                    var formData = new FormData();
                                    formData.append('json', JSON.stringify(note));
                                    var request = new XMLHttpRequest();
                                    request.open("POST", 'http://' + window.location.host + '/save');
                                    request.setRequestHeader("Content-type", "application/json; charset=utf-8");
                                    request.onreadystatechange = function() {
                                        if (request.readyState == 4 && request.status == 200) {
                                            console.log('YES')
                                        }
                                    }
                                    request.send(JSON.stringify(note));
                                }
                            }, 1000 * 30 * 1);
                        }
                    });
                });
            });
        });
    }
    fetch('/get_user', {
        method: 'GET',
        credentials: 'same-origin'
    }).then(function(response) {
        response.text().then(function(user) {
            fetch('/isadmin/' + user).then(function(response) {
                response.text().then(function(result) {
                    if (result == 'true') {
                        document.getElementById('admin').innerHTML = '<a href="/admin"><span class="glyphicon glyphicon-modal-window"></span> Admin Control</a>'
                    } else {
                        //null
                    }
                })
            })
        })
    })
}

document.getElementById('save').onclick = function() {
    var title = document.getElementById('title-val');
    var content = document.getElementById('content');
    note.title = title.value;
    note.content = content.value;
    console.log(note);
    var formData = new FormData();
    formData.append('json', JSON.stringify(note));
    var request = new XMLHttpRequest();
    request.open("POST", 'http://' + window.location.host + '/save');
    request.setRequestHeader("Content-type", "application/json; charset=utf-8");
    request.onreadystatechange = function() {
        if (request.readyState == 4 && request.status == 200) {
            console.log('YES')
        } else if (request.readyState == 4) {
            console.log(request);
            alert('Error in Saving');
        }
    }
    request.send(JSON.stringify(note));
}

window.onbeforeunload = function() {
    if (id != 'new') {
        console.log(id);
        var title = document.getElementById('title-val');
        var content = document.getElementById('content');
        if (title.value != note.title || content.value != note.content) {
            return 'Are you sure you want to leave?';
        }
    }
}

window.document.getElementById('delete').onclick = function() {
    console.log(author);
    fetch('/delete/' + author + '/' + id_).then(function(response) {
        response.text().then(function(message) {
            console.log(message);
        });
    });
}