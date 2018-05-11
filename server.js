var express = require('express');
var qs = require('querystring');
var path = require('path');
var JSON = require('JSON');
var cookie = require('set-cookie');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var jsonParser = require('json-parser');
var app = express();
var nodemailer = require('nodemailer');
var uuid = require('uuid');
var db = require('./db.js');
var bcrypt = require('bcrypt');
//var nodemailer = require('nodemailer');
console.log(path.join(__dirname, '/'));
const spath = path.join(__dirname, '/public/');
app.use(express.static(spath));
app.use(cookieParser());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

// var user = {
//     email: 'kailashnath1998@gmail.com',
//     username: 'knn',
//     password: 'knn',
//     reset: undefined,
//     verified: 'true',
//     admin: true,
//     master: true
// };

// db.users.create(user, function(err, res) {
//     if (err)
//         console.log(err);
//     else
//         console.log(res);
// });


// bcrypt.hash('admin', 1, function(err, result) {
//     console.log(result);
//     var myquery = { username: 'admin2' }
//     var newvalues = { $set: { 'password': result, admin: true } };
//     db.users.updateOne(myquery, newvalues, function(err, res) {
//         if (err)
//             console.log(err);
//         else
//             console.log(res);
//     });
// })


// var myquery = { username: 'knn' }
// var newvalues = { $set: { master: true } };
// db.users.updateOne(myquery, newvalues, function(err, res) {
//     if (err)
//         console.log(err);
//     else
//         console.log(res);
// });

function validate(notes, id, user) {
    return new Promise(function(resolve, reject) {
        var edit = false;
        notes.forEach(element => {
            if (element.id == id && element.author == user)
                edit = true;
        });
        resolve(edit);
        reject(false);
    })
}

function getNote(notes, id, user) {
    return new Promise(function(resolve, reject) {
        var set = false;
        notes.forEach(element => {
            if (element.id == id && element.author == user) {
                resolve(element);
                set = true;
            }
        });
        if (!set)
            resolve(undefined);
        reject(undefined);
    })
}

function updateNote(note) {
    console.log(note);
    return new Promise(function(resolve, reject) {
        var myquery = { id: note.id }
        var newvalues = { $set: { content: note.content, title: note.title } };
        db.notes.updateOne(myquery, newvalues, function(err, res) {
            if (err) {
                resolve(false);
                reject(undefined);
            } else {
                resolve(true);
                reject(undefined);
            }
        });
    })
}

function send_mail(email, sub, message) {
    return new Promise(function(resolve, reject) {
        console.log(email);
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'kailashtestscripts@gmail.com',
                pass: '1234567890asdfghjkl'
            }
        });
        var mailOptions = {
            from: 'Note ME <kailashtestscripts@gmail.com>',
            to: email,
            subject: sub,
            html: message
        };
        transporter.sendMail(mailOptions, function(error, info) {
            if (error) {
                resolve(error);
                console.log(error);
            } else {
                resolve('success');
                console.log('Email sent: ' + info.response);
            }
            reject(false);
        });
    });
}


function validate_user(user, password) {
    console.log(user);
    return new Promise(function(resolve, reject) {
        db.users.findOne({ username: user }, function(err, doc) {
            console.log(doc);
            if (err) {
                resolve(err);
            } else if (doc == null) {
                resolve('not-registered');
            } else {
                bcrypt.compare(password, doc.password, function(err, resu) {
                    console.log(resu);
                    if (resu == true) {
                        resolve('success');
                    } else {
                        resolve('wrong');
                    }
                    reject(undefined);
                });
            }
        });
    });
}

app.post('/login', function(req, res) {
    console.log(req.body);
    var uname = req.body.uname;
    var psw = req.body.psw;
    validate_user(uname, psw).then(function(result) {
        console.log(result);
        if (result == 'not-registered')
            res.send('not-registered');
        else if (result == 'success') {
            console.log(uname);
            var user = uname;
            res.cookie('user', { user });
            console.log('cookie set succesfully\n');
            res.send('success');
        } else if (result == 'wrong')
            res.send('wrong');
        else
            res.send('err');
    });

});

app.get('/logout', function(req, res) {
    var cookie = req.cookies.user;
    console.log(cookie);
    if (cookie == undefined) {
        res.sendFile(path.join(spath, 'html/logout.html'));
    } else {
        res.clearCookie("user");
        res.sendFile(path.join(spath, 'html/logout.html'));
    }
});

app.get('/', function(req, res) {
    var cookie = req.cookies.user;
    console.log(cookie);
    if (cookie == undefined) {
        // var user = 'knn'
        // res.cookie('user', { user });
        // console.log('cookie set succesfully\n');
        res.sendFile(path.join(spath, 'html/login.html'));
    } else {
        res.sendFile(path.join(spath, 'html/index.html'));
    }
});

app.get('/messages', function(req, res) {
    var cookie = req.cookies.user;
    if (cookie == undefined) {
        res.sendFile('signin');
    } else {
        res.type('text');
        db.notes.find({ author: cookie.user }, function(err, result) {
            if (err) console.log(err);
            console.log(result + '-2');
            res.send(JSON.stringify(result));
        });
    }
});


app.get('/msg_edit', function(req, res) {
    var cookie = req.cookies.user;
    if (cookie == undefined)
        res.sendFile(path.join(spath + 'html/login.html'));
    var user = cookie.user;
    var msgid = req.query.id;
    console.log(msgid == 'new');
    if (msgid == 'new')
        res.sendFile(path.join(spath, 'html/edit.html'));
    else if (msgid && user) {
        db.notes.find({ author: user }, function(err, notes) {
            if (err) console.log(err);
            //console.log(result + '1');
            validate(notes, msgid, user).then(function(result) {
                if (result)
                    res.sendFile(path.join(spath, 'html/edit.html'));
                else
                    res.send('Not Allowed');
            });
        });
    } else if (msgid) {
        res.send('not allowed');
    } else {
        res.sendFile(path.join(spath + 'html/login.html'));
    }

});

app.get('/get_user', function(req, res) {
    var cookie = req.cookies.user;
    if (cookie == undefined)
        res.send('undefined');
    else
        res.send(cookie.user)
});

app.get('/isadmin/:user', function(req, res) {
    var user = req.params.user;
    db.users.findOne({ username: user }, function(err, user) {
        if (err) {
            console.log(err);
            res.send('Error')
        }
        //console.log(user);
        if (user == undefined)
            res.send('false');
        else if (user.admin == true) {
            res.send('true');
        } else {
            res.send('false');
        }
    });
});

app.get('/delete/:user/:post', function(req, res) {
    console.log('delete : ', req.params.post);
    db.notes.deleteOne({ id: req.params.post, author: req.params.user }).then(function(err, result) {
        if (err) {
            console.log(err);
            res.send(err);
        } else {
            res.send('success')
        }
    });
});

app.get('/get_note/:user/:id', function(req, res) {
    var id = req.params.id;
    var user = req.params.user;
    db.notes.find({ author: user }, function(err, notes) {
        if (err) {
            console.log(err);
            res.send('Error')
        }
        console.log(notes);
        getNote(notes, id, user).then(function(note) {
            res.send(note);
        });
    });
});

app.get('/get_note/new', function(req, res) {
    var cookie = req.cookies.user;
    if (cookie == undefined)
        res.send('Not Allowed');
    else {
        var note = {
            id: Number(String(Math.floor(Math.random() * 1000000)) + Date.now()).toString(36),
            content: ``,
            title: 'Untitled',
            author: cookie.user
        }
        db.notes.create(note, function(err, result) {
            if (err) {
                console.log("Failed adding note for ", note.author, " cause : ", err);
            } else {
                console.log("new note added id : ", note.id, " for ", note.author);
                res.send(note);
            }
        });

    }
});

var server = app.listen(8080, function() {
    console.log('Server Listening on port 8080!')
});

app.post('/save/', function(req, res) {
    var note = req.body;
    updateNote(note).then(function(result) {
        if (result)
            res.send('success');
        else
            res.send(undefined);
    });
});

app.get('/register', function(req, res) {
    res.sendFile(path.join(spath, 'html/register.html'));
});

app.post('/new_user', function(req, res) {
    var newUser = {
        email: req.body.email,
        username: req.body.uname,
        password: req.body.psw,
        reset: undefined,
        verified: 'true',
        admin: false,
        master: false,
        verfication: uuid.v1()
    };
    console.log(newUser);

    bcrypt.hash(newUser.password, 1, function(err, hash) {
        if (err)
            res.send(err);
        else {
            db.users.findOne({ $or: [{ username: newUser.username }, { email: newUser.email }] }, function(err, doc) {
                if (err) {
                    console.log(err);
                    res.send('Error');
                } else if (doc == null) {
                    newUser.password = hash;
                    db.waiting.findOne({ username: newUser.username }, function(err, result) {
                        if (err) {
                            console.log(err);
                            res.send(err);
                        } else if (result != null) {
                            var myquery = { username: newUser.username }
                            var newvalues = { $set: { email: newUser.email, password: newUser.password, verfication: newUser.verfication } };
                            db.waiting.updateOne(myquery, newvalues, function(err, dres) {
                                if (err)
                                    res.send('master' + err);
                                send_mail(newUser.email, 'Account Activation', 'Please Follow the link to activate your account http://localhost:8080/validateuser?id=' + newUser.verfication + '&user=' + newUser.username).then(function(result) {
                                    if (result == 'success')
                                        res.send('Check Mail for Further Details - Pending Account verification');
                                    else
                                        res.send('Internal Error');
                                });
                            })
                        } else {
                            db.waiting.create(newUser, function(err, r) {
                                if (err) {
                                    res.send('Email ID Already Exist');
                                    console.log(err);
                                } else {
                                    send_mail(newUser.email, 'Account Activation', 'Please Follow the link to activate your account http://localhost:8080/validateuser?id=' + newUser.verfication + '&user=' + newUser.username).then(function(result) {
                                        if (result == 'success')
                                            res.send('Check Mail for Further Details - Pending Account verification');
                                        else
                                            res.send('Internal Error');
                                    });
                                }
                            });
                        }
                    })
                } else {
                    if (doc.username == newUser.username)
                        res.send('Username Already Exist');
                    else
                        res.send('Email Already in use');
                }
            });
        }
    });
});

app.get('/admin', function(req, res) {
    res.sendfile(path.join(spath, 'html/admin.html'));
});

app.get('/get_users/all', function(req, res) {
    var cookie = req.cookies.user;
    if (cookie == undefined)
        res.send('x');
    else {
        db.users.findOne({ username: cookie.user }, function(err, user) {
            if (err) {
                console.log(err);
                res.send('error')
            }
            if (user.admin == true) {
                db.users.find({}, {
                    username: 1,
                    email: 1,
                    admin: 1,
                    _id: 0
                }, function(err, users) {
                    console.log(users);
                    res.send(users);
                });
            } else {
                res.send('x');
            }
        });
    }
});

app.get('/reset/:user', function(req, res) {
    var user = req.params.user;
    console.log('reset : ', user);
    db.users.findOne({ username: user }, function(err, doc) {
        if (doc == null)
            res.send('username was not found')
        else {
            var id_ = uuid.v1();
            console.log(id_);
            var details = {
                email: doc.email,
                username: doc.username,
                resetkey: id_
            }
            db.reset.findOne({ username: doc.username }, function(err, reset) {
                if (reset) {
                    var transporter = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                            user: 'kailashtestscripts@gmail.com',
                            pass: '1234567890asdfghjkl'
                        }
                    });
                    var mailOptions = {
                        from: 'Note ME <kailashtestscripts@gmail.com>',
                        to: doc.email,
                        subject: 'Password Reset - Note ME',
                        html: 'Please Follow the link to reset the password http://localhost:8080/passwordreset?id=' + reset.id + '&user=' + doc.username
                    };
                    transporter.sendMail(mailOptions, function(error, info) {
                        if (error) {
                            res.send(err);
                            console.log(error);
                        } else {
                            res.send('success');
                            console.log('Email sent: ' + info.response);
                        }
                    });
                    console.log(user, ' - ', reset.resetkey);
                    //res.send('success');
                } else {
                    db.reset.create(details, function(err, result) {
                        var transporter = nodemailer.createTransport({
                            service: 'gmail',
                            auth: {
                                user: 'kailashtestscripts@gmail.com',
                                pass: '1234567890asdfghjkl'
                            }
                        });
                        var mailOptions = {
                            from: 'Note ME <kailashtestscripts@gmail.com>',
                            to: doc.email,
                            subject: 'Password Reset - Note ME',
                            html: 'Please Follow the link to reset the password http://localhost:8080/passwordreset?id=' + id_ + '&user=' + doc.username
                        };
                        transporter.sendMail(mailOptions, function(error, info) {
                            if (error) {
                                res.send(err);
                                console.log(error);
                            } else {
                                res.send('success');
                                console.log('Email sent: ' + info.response);
                            }
                        });
                        console.log(user, ' - ', id_);
                        //res.send('success');
                    });
                }
            });
        }
    });
});

app.get('/passwordreset', function(req, res) {
    res.sendFile(path.join(spath, 'html/reset.html'));
});

app.get('/validateuser', function(req, res) {
    res.sendFile(path.join(spath, 'html/validate.html'));
});

app.post('/conform', function(req, res) {

    var details = req.body;
    db.waiting.findOne({ username: details.user, verfication: details.id }, function(err, doc) {
        if (err)
            res.send(doc);
        else if (doc == null)
            res.send('Invalid Link');
        else {
            var user = {
                email: doc.email,
                username: doc.username,
                password: doc.password,
                reset: undefined,
                verified: 'true',
                admin: false,
                master: false,
            };
            db.waiting.deleteOne({ username: details.user, verfication: details.id }, function(err, result) {
                db.users.create(user, function(err, result) {
                    if (err)
                        res.send(err);
                    else {
                        send_mail(user.email, 'Welcome to Note ME', `Hello ${user.username},<br>Welcome to Note ME. Happpy to serve you :)<br>Team<br>Note ME`).then(function(resu) {});
                        res.send('Validation Successfull')
                    }

                })
            });
        }
    })
})

app.post('/updatepass', function(req, res) {
    var details = req.body;
    console.log(details);
    db.reset.findOne({ resetkey: details.id, username: details.user }, function(err, doc) {
        if (doc == null) {
            res.send('Invalid Link');
        } else {
            var user = doc.username;
            var pass = req.body.pass;
            bcrypt.hash(pass, 1, function(err, result) {
                if (err) {
                    console.log(err);
                    res.send(err);
                }
                console.log(result);
                var myquery = { username: user }
                var newvalues = { $set: { 'password': result } };
                db.users.updateOne(myquery, newvalues, function(err, dres) {
                    if (err) {
                        console.log(err);
                        res.send(err);
                    } else {
                        console.log(dres);
                        console.log(details.id);
                        db.reset.deleteMany({ resetkey: details.id }, function(err, dres) {
                            if (err) {
                                console.log(err);
                                res.send(err);
                            } else {
                                console.log(dres);
                                console.log("Deleted the record for ", user, " from reset DB");
                                res.send('Success');
                            }
                        })
                    }
                });
            })
        }
    });
});

app.get('/dispuser', function(req, res) {
    res.sendFile(path.join(spath, 'html/dispuser.html'));
});

app.get('/user', function(req, res) {
    var cookie = req.cookies.user;
    if (cookie == undefined) {
        res.send("NOT ALLOWED");
    } else {
        db.users.findOne({ username: cookie.user }, function(err, doc) {
            //console.log(doc);
            if (err) {
                console.log(err);
                res.send('error')
            } else if (doc.admin == true) {
                var reqUser = req.query.id;
                console.log(reqUser);
                db.users.findOne({ username: reqUser }, {
                    username: 1,
                    email: 1,
                    admin: 1,
                    master: 1,
                    _id: 0
                }, function(err, user) {
                    if (err) {
                        console.log(err);
                        res.send(err);
                    } else {
                        console.log(user);
                        user.master = doc.master;
                        res.send(user);
                    }
                })
            } else {
                res.send('Not Allowed');
            }
        });
    }
});

app.post('/updateStatus', function(req, res) {
    var details = req.body;
    var crrUser = req.cookies.user;
    if (crrUser == undefined) {
        res.send("Not Allowed");
    } else {
        db.users.findOne({ username: crrUser.user }, function(err, doc) {
            if (err) {
                console.log(err);
                res.send(err);
            } else if (doc) {
                if (doc.admin == true && details.admin == true) {
                    var myquery = { username: details.username, email: details.email };
                    var newvalues = { $set: { admin: details.admin } };
                    db.users.updateOne(myquery, newvalues, function(err, res_) {
                        if (err) {
                            console.log(err);
                            res.send(err);
                        } else {
                            console.log(res_);
                            res.send('Updated Sucessfully');
                        }
                    });
                } else if (doc.master == true) {
                    var myquery = { username: details.username, email: details.email };
                    var newvalues = { $set: { admin: details.admin } };
                    db.users.updateOne(myquery, newvalues, function(err, result) {
                        if (err) {
                            console.log(err);
                            res.send(err);
                        } else {
                            console.log(result);
                            res.send('Updated Sucessfully');
                        }
                    });
                } else {
                    res.send("Not Allowed");
                }
            } else {
                res.send('err');
            }
        })
    }
})

app.get('/admin_add', function(req, res) {
    res.sendFile(path.join(spath, 'html/adminadd.html'));
});

app.post('/direct_add', function(req, res) {
    console.log("Direct Add Request");
    var cookie = req.cookies.user;
    var details = req.body;
    var newUser = {
        email: details.email,
        username: details.uname,
        password: details.psw,
        reset: undefined,
        verified: 'true',
        admin: false,
        master: false,
    };
    if (cookie == undefined) {
        res.send('Please Sign in');
    } else {
        db.users.findOne({ username: cookie.user }, function(err, doc) {
            console.log(doc);
            if (err) {
                console.log(err);
                res.send(err);
            } else if (doc == null) {
                res.send('Please Sign in');
            } else {
                if (doc.admin == false) {
                    res.send('Not Allowed');
                } else {
                    db.users.findOne({ $or: [{ username: newUser.username }, { email: newUser.email }] }, function(err, doc1) {
                        if (err) {
                            console.log(err);
                            res.send(err);
                        } else if (doc1 == null) {
                            bcrypt.hash(newUser.password, 1, function(err, hashed) {
                                newUser.password = hashed;
                                db.users.create(newUser, function(err, result) {
                                    if (err) {
                                        console.log(err);
                                        res.send(err);
                                    } else {
                                        send_mail(newUser.email, 'Welcome to Note ME', `Hello ${newUser.username},<br><br>Welcome to Note ME. Happpy to serve you :)<br><br>Team<br>Note ME`).then(function(resu) {});
                                        res.send("User Registered Successfully");
                                    }
                                });
                            });
                        } else {
                            if (doc1.username == newUser.username)
                                res.send("Username Already exist");
                            else
                                res.send("Email id Already exist");
                        }
                    });
                }
            }
        })
    }
});

app.get('/delete', function(req, res) {
    var cookie = req.cookies.user;
    var iammaster = undefined;
    if (cookie == undefined) {
        res.send('Sign In');
    } else {
        db.users.findOne({ username: cookie.user }, function(err, doc) {
            if (err) {
                console.log(err);
                res.send(err);
            } else if (doc == null) {
                res.send("NOT ALLOWED");
            } else {
                if (doc.admin == false)
                    res.send("NOT ALLOWED");
                else {
                    var user = req.query.id;
                    db.users.findOne({ username: user }, function(err, docuser) {
                        if (err) {
                            console.log(err);
                            res.send(err);
                        } else if (docuser == null) {
                            res.send("NOT ALLOWED");
                        } else {
                            if (docuser.master == true || (docuser.admin == true && doc.master == false))
                                res.send("NOT ALLOWED :<>");
                            else {
                                console.log(iammaster);
                                db.users.deleteOne({ username: user }, function(err, docfinal) {
                                    if (err) {
                                        console.log(err);
                                        res.send(err);
                                    } else {
                                        db.notes.deleteMany({ author: user }, function(err, doc_) {
                                            if (err) {
                                                console.log(err);
                                                res.send(err);
                                            } else {
                                                res.sendFile(path.join(spath, 'html/admin.html'));
                                            }
                                        });
                                    }
                                });
                            }

                        }
                    })
                }
            }
        });
    }

})

app.get('/get_user_det', function(req, res) {
    var cookie = req.cookies.user;
    if (cookie == undefined) {
        res.send('Invalid');
    } else {
        db.users.findOne({ username: cookie.user }, {
            username: 1,
            email: 1,
            admin: 1,
            _id: 0
        }, function(err, doc) {
            if (err)
                res.send(err);
            else if (doc == null)
                res.send('Invalid');
            else
                res.send(doc);
        })
    }
});

app.get('/me', function(req, res) {
    res.sendFile(path.join(spath, 'html/personal.html'))
});

//var myquery = { username: 'knn' }
//     var newvalues = { $set: { 'password': result, admin: true } };
//     db.users.updateOne(myquery, newvalues, function(err, res) {
//         if (err)
//             console.log(err);
//         else
//             console.log(res);
//     });