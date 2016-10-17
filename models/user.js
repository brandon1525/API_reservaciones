var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');

var userSchema = new Schema({
	name : {
		type : String,
		required: true
	},
	last_name_p : {
		type : String,
		required: true
	},
	last_name_m : {
		type : String,
		required: true
	},
	phone : {
		type : String,
		required: true
	},
	sex : {
		type : String,
		required: true
	},
	date_b : {
		type : Date,
		required: true
	},
	type_user : {
		type : Number,
		required: true
	},
	user : {
		type : String,
		unique : true,
		index : true,
		required: true
	},
	password : {
		type : String,
		required: true
	},
	create_at : {
		type: Date,
		default: Date.now
	}
});

userSchema.pre('save', function (next) {
	var user = this;
	if (this.isModified('password') || this.isNew) {
		bcrypt.genSalt(10, function (err, salt) {
			if (err) {
				return next(err);
			}
			bcrypt.hash(user.password, salt, function (err, hash) {
				if (err) {
					return next(err);
				}
				user.password = hash;
				next();
			});
		});
	} else {
		return next();
	}
});

userSchema.methods.comparePassword = function (passw, cb) {
	bcrypt.compare(passw, this.password, function (err, isMatch) {
		if (err) {
			return cb(err);
		}
		cb(null, isMatch);
	});
};

userSchema.methods.toJSON = function() {
  var obj = this.toObject();
  delete obj.password;
  return obj;
}
module.exports = mongoose.model('User', userSchema);
