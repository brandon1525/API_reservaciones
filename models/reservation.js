var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var reservationSchema = new Schema({
	user_responsible: {
		type : Schema.Types.ObjectId,
		ref : 'User',
    required : true
	},
	place : {
		type : Schema.Types.ObjectId,
		ref : 'Place',
    required : true
	},
	date_reservation : {
		type : Date,
		required: true
	},
	no_people : {
		type : Date,
		required: true
	},
	qr_code : {
		type : String,
		unique: true,
		required: true
	},
	create_at : {
		type: Date,
		default: Date.now
	}
});

module.exports = mongoose.model('Reservation', reservationSchema);
