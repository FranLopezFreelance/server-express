var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var hospitalSchema = new Schema({
                name: { type: String, required: [ true, 'El Nombre es requerido'] },
                img: { type: String, required: false },
				user: { type: Schema.Types.ObjectId, ref: 'User' }
},	{ collection: 'doctors' });

module.exports = mongoose.model('Hospital', hospitalSchema);