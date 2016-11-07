var mongoose	= require('mongoose');
var Schema		= mongoose.Schema;

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
		type : Number,
		required: true
	},
	registry: {
		type: Boolean,
		default: false
	},
	cancel: {
		type: Boolean,
		required: true,
		default: false
	},
	create_at : {
		type: Date,
		default: Date.now
	}
});

module.exports = mongoose.model('Reservation', reservationSchema);
