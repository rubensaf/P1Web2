
const mongoose = require("mongoose");

const UserScheme = new mongoose.Schema(
    {
        name: {
            type: String
        },
        age: {
            type: Number
        },
        email: {
            type: String,
            unique: true
        },
        password:{
            type: String,  // TODO Guardaremos el hash
        },
        role:{
            type: String,
            enum: ["user", "admin"], // es como el enum de SQL
            default: "user"
        },

        status: {
            type: String,
            default: 'active'
        },
        verificationCode: {
            type: String, // Código de 6 dígitos para verificar el email
            required: true
        },

    },
    {
        timestamps: true, // TODO createdAt, updatedAt
        versionKey: false
    }
)



module.exports = mongoose.model("users", UserScheme); 
