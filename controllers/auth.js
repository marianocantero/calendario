const { response, json } = require('express');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const Usuario = require('../models/Usuario');
const { generarJWT } = require('../helpers/jwt');

 
//REGISTRO DE USUARIO
const crearUsuario = async (req, res = response) => {

    const { email, password } = req.body;

    try {
        let usuario = await Usuario.findOne({email});
        
        if( usuario ) {
            return res.status(400).json({
                ok: false,
                msg: 'Este correo ya se encuentra registrado'
            })
        }
        
        usuario = new Usuario(req.body);

        //Encriptar la contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync( password, salt );


        await usuario.save();

        const token = await generarJWT (usuario.id, usuario.name);

        res.status(201).json({
            ok:true,
            uid: usuario.id,
            name: usuario.name,
            token
        });
    
    } catch (error) {
        console.log( error );
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        })
    }

    
}


//LOGIN DE USUARIO
const loginUsuario = async (req, res = response) => {

    const { email, password } = req.body;

    try {

        const usuario = await Usuario.findOne({email});
        
        if( !usuario ) {
            return res.status(400).json({
                ok: false,
                msg: 'Usuario o contraseña invalidos'
            })
        }

        //Confirmar los passwords
        const validPassword = bcrypt.compareSync (password, usuario.password);

        if( !validPassword ){
            return res.status(400).json({
                ok: false,
                msg: 'Usuario o contraseña invalidos'
            })
        }

        //Generar el JWT
        const token = await generarJWT (usuario.id, usuario.name);

        res.status(200).json({
            ok: true,
            id: usuario.id,
            name: usuario.name,
            token
        })
        
    } catch (error) {
        
        console.log( error );
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        })
    }

    
}

const validarToken = async (req, res = response) => {

    const {uid, name } = req;

    //Genero otro jwt
    const token = await generarJWT (uid, name);

    
    res.status(201).json({
        ok:true,
        uid, 
        name,
        token
    });

}


module.exports = {
    crearUsuario,
    loginUsuario,
    validarToken
}