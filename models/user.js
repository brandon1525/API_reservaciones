var mongoose = require('mongoose'),
Schema = mongoose.Schema;
var usuarioSchema = new Schema({
	nombre: 		{ type: String },
	apellido_p: 		{ type: Number },
	apellido_m: 	{ type: String },
	sexo:  	{ type: String },
	edad: 	{ type: Number }
});
module.exports = mongoose.model('User', usuarioSchema);
