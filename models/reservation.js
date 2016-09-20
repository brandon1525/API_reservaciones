var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var reservationSchema = new Schema({
	user_responsable : {
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
	telefono : {
		type : String,
		required: true
	},
	sexo : {
		type : String,
		required: true
	},
	edad : {
		type : Date,
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
	},
	creado : {
		type: Date,
		default: Date.now
	}
});

module.exports = mongoose.model('Reservation', reservationSchema);
