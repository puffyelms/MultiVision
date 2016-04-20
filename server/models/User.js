var mongoose = require('mongoose'),
    encrypt = require('../utilities/encryption');

var userSchema = mongoose.Schema({
    firstName: {type:String, required:'{PATH} is required!'},
    lastName: {type:String, required:'{PATH} is required!'},
    username: {
        type:String,
        required: '{PATH} is required!',
        unique:true
    },
    salt: {type:String, required:'{PATH} is required!'},
    hashed_pwd: {type:String, required:'{PATH} is required!'},
    roles: [String]
});
userSchema.methods = {
    authenticate: function(passwordToMatch) {
        return encrypt.hashPwd(this.salt, passwordToMatch) === this.hashed_pwd;
    }
};

var User = mongoose.model('User', userSchema);

function createDefaultUsers() {

    User.find({}).exec(function(err, collection) {
        if(collection.length==0) {
            var salt, hash;
            salt = encrypt.createSalt();
            hash = encrypt.hashPwd(salt,'joe');
            User.create({firstName:'Joe',lastName:'Eames',username:'joe',salt:salt,hashed_pwd:hash,roles:['admin']});
            salt = encrypt.createSalt();
            hash = encrypt.hashPwd(salt,'tim');
            User.create({firstName:'Tim',lastName:'Eames',username:'tim',salt:salt,hashed_pwd:hash,roles:[]});
            salt = encrypt.createSalt();
            hash = encrypt.hashPwd(salt,'bob');
            User.create({firstName:'Bob',lastName:'Eames',username:'bob',salt:salt,hashed_pwd:hash,roles:[]});
        }

    })
}

exports.createDefaultUsers = createDefaultUsers;