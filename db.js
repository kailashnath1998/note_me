var mongoose = require('mongoose');

var Schema = mongoose.Schema;

mongoose.connect("mongodb://localhost:27017/noteme");

mongoose.connection.on('open', function(ref) {
    console.log('Connected to mongo server.');
});
mongoose.connection.on('error', function(err) {
    console.log('Could not connect to mongo server!');
    console.log(err);
});


var NoteSchema = new mongoose.Schema({
    id: {
        type: String,
        unique: true,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    content: {
        type: String,
    },
    title: {
        type: String,
    }
}, { strict: false });

var UserSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    reset: {
        type: String
    },
    verified: {
        type: String
    },
    admin: {
        type: Boolean
    },
    master: {
        type: Boolean
    }
}, { strict: false });

var WaitingSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    reset: {
        type: String
    },
    verified: {
        type: String
    },
    admin: {
        type: Boolean
    },
    master: {
        type: Boolean
    },
    verfication: {
        type: String
    }
}, { strict: false });

var ResetSchema = new mongoose.Schema({
    createdAt: {
        type: Date,
        expires: 3600000,
        default: Date.now
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    username: {
        type: String,
        unique: true,
        required: true
    },
    resetkey: {
        type: String,
        unique: true,
        required: true
    }
}, { strict: false });

module.exports.notes = mongoose.model('notes', NoteSchema);

module.exports.users = mongoose.model('users', UserSchema);

module.exports.reset = mongoose.model('reset', ResetSchema);

module.exports.waiting = mongoose.model('waiting', WaitingSchema);

// 'C:\Program Files\MongoDB\Server\3.4\bin'