var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

var validRoles = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un Rol permitido'
}

var userSchema = new Schema({
    name: { type: String, required: [true, 'El Nombre es requerido'] },
    email: { type: String, unique: true, required: [true, 'El E-Mail es requerido'] },
    password: { type: String, required: [true, 'La Contraseña es requerida'] },
    img: { type: String, required: false },
    role: { type: String, required: true, default: 'USER_ROLE', enum: validRoles }
});

userSchema.plugin( uniqueValidator, { message: '{PATH} debe ser único' } );

module.exports = mongoose.model('User', userSchema);