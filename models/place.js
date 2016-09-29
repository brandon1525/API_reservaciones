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
	create_at : {
		type: Date,
		default: Date.now
	}
});

module.exports = mongoose.model('Place', placeSchema);
