var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var doctorSchema = new Schema({
                name: { type: String, required: [ true, 'El Nombre es requerido'] },
                img: { type: String, required: false },
				user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
                hospital: { type: Schema.Types.ObjectId, ref: 'Hospital', 
                    required: [true, 'El Id del Hospital es obligatorio'] 
                }
});

module.exports = mongoose.model('Dotor', doctorSchema);