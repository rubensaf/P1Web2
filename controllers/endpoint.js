const UsersModel = require("../models/nosql/users");

exports.getUserCtrl = async (req, res) => {
    try {
        // Buscar el usuario en la base de datos usando el _id que hemos extraído del token JWT
        const user = await UsersModel.findById(req.user._id);

        // Si no encontramos al usuario, devolvemos un error 404
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

      
        res.status(200).json({
            email: user.email,
            name: user.name,  
            role: user.role,
            status: user.status,
            _id: user._id
        });
    } catch (error) {
        console.error(error);
        // Si ocurre algún error en la consulta o en el servidor, devolvemos un error 500
        res.status(500).json({ message: 'Error al obtener los datos del usuario' });
    }
};
