var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');

var usuarioSchema = new Schema({
	nombre : {
		type : String,
		required: true
	},
	apellido_p : {
		type : String,
		required: true
	},
	apellido_m : {
		type : String,
		required: true
	},
	sexo : {
		type : String,
		required: true
	},
	edad : {
		type : Number,
		required: true
	},
	usuario : {
		type : String,
		unique: true,
		required: true
	},
	password : {
		type : String,
		required: true
	}
});

usuarioSchema.pre('save', function (next) {
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

usuarioSchema.methods.comparePassword = function (passw, cb) {
	bcrypt.compare(passw, this.password, function (err, isMatch) {
		if (err) {
			return cb(err);
		}
		cb(null, isMatch);
	});
};

module.exports = mongoose.model('User', usuarioSchema);
