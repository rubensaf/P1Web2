const UsersModel = require("../models/nosql/users");

exports.getUserCtrl = async (req, res) => {
    try {
        // Buscar el usuario en la base de datos usando el _id que hemos extraído del token JWT
        const user = await UsersModel.findById(req.user._id);


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
 
        res.status(500).json({ message: 'Error al obtener los datos del usuario' });
    }
};


exports.deleteUser = async (req, res) => {
    const { soft } = req.query; // Extraer el parámetro query ?soft=false

    try {
        const user = await UsersModel.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        if (soft === 'false') {
            // Hard delete (eliminar de la base de datos permanentemente)
            await user.deleteOne();
            return res.status(200).json({ message: 'Usuario eliminado permanentemente' });
        } else {
            // Soft delete (solo desactivarlo cambiando el estado)
            user.status = 'inactive';
            await user.save();
            return res.status(200).json({ message: 'Usuario desactivado' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al eliminar el usuario' });
    }
};