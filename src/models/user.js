const mongoose = require('mongoose');
const {Schema} = mongoose;
const passportLocalMongoose = require('passport-local-mongoose')
const userSchema = new Schema({
firstName: {type: String, required: true},
lastName: String,
phone: {type: String, trim: true},
email: {type: String, required: true, trim: true},
school:{},
isVerified: {
    type: Boolean,
    default: false
},

resetPasswordToken: {
    type: String,
    required: false
},

resetPasswordExpires: {
    type: Date,
    required: false
}
}, {timestamps: true});

// userSchema.pre('save',  function(next) {
//     const user = this;
//     if (!user.isModified('password')) return next();

//         bcrypt.genSalt(10, function(err, salt) {
//         if (err) return next(err);
//         bcrypt.hash(user.password, salt, function(err, hash) {
//             if (err) return next(err);
//             user.password = hash;
//             next();
//         });
//     });
// });

userSchema.methods.comparePassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

userSchema.methods.generateJWT = function() {
    const today = new Date();
    const expirationDate = new Date(today);
    expirationDate.setDate(today.getDate() + 60);

    let payload = {
        id: this._id,
        email: this.email,
        userlname: this.username,
        firstName: this.firstName,
        lastName: this.lastName,
    };

    return jwt.sign(payload, SECRET, {
        expiresIn: parseInt(expirationDate.getTime() / 1000, 10)
    });
};

userSchema.methods.generatePasswordReset = function() {
    this.resetPasswordToken = crypto.randomBytes(20).toString('hex');
    this.resetPasswordExpires = Date.now() + 3600000; //expires in an hour
};

userSchema.methods.generateVerificationToken = function() {
    let payload = {
        userId: this._id,
        token: crypto.randomBytes(20).toString('hex')
    };

    return new Token(payload);
};
userSchema.plugin(passportLocalMongoose, {usernameField:"email"})
module.exports = mongoose.model('User', userSchema)