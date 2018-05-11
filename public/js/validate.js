window.onload = function() {
    var id_ = window.location.search.split('=')[1].split('&')[0];
    var user = window.location.search.split('=')[2];
    console.log(id_);
    console.log(user);
    var details = {
        id: id_,
        user: user
    }
    fetch('/conform', {
        method: 'POST',
        body: JSON.stringify(details),
        headers: new Headers({
            'Content-Type': 'application/json'
        }),
        credentials: 'same-origin'
    }).then(function(response) {
        response.text().then(function(message) {
            document.getElementById('msg').innerText = message;
        })
    });
}