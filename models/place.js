var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var placeSchema = new Schema({
	name : {
		type : String,
    unique : true,
		required: true
	},
  description : {
		type : String,
		required: true
	},
	total_people : {
		type : Number,
		required: true
	},
  type : {
		type : String,
		required: true
	},
  owner : {
    type : Schema.Types.ObjectId,
		ref : 'User',
    required : true
	},
	payment_method : {
		number_card : {
			type : String,
			default : "0000000000000000"
		},
		cvv : {
			type : String,
			default : "000"
		},
		date : {
			type : String,
			default : "00/00"
		}
	},
	last_payment : {
		type : Date,
		default : Date.now
	},
	type_plan : {
		type : Number,
		default : 0
	},
	create_at : {
		type: Date,
		default: Date.now
	}
});

module.exports = mongoose.model('Place', placeSchema);
