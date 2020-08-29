const { response } = require('express');
const  Evento  = require('../models/Evento');
const { compareSync } = require('bcryptjs');


const getEventos = async (req, res = response) => {

    const eventos = await Evento.find()
                                .populate('user', 'name');

    res.json({
        ok: true,
        eventos
    })
}

const crearEvento = async (req, res = response) => {
    
    const evento = new Evento(req.body); 
    console.log(evento);

   try {
     evento.user = req.uid;
     
     const eventoGuardado = await evento.save();

     res.status(200).json({
         ok:true,
         evento: eventoGuardado
     })
   } catch (error) {
       console.log(error);
       res.status(400).json({
           ok: false,
           msg: 'Por favor habla con el administrador'
       })
   };
    
}

const actualizarEvento = async (req, res = response) => {

    const eventoId = req.params.id;
    const uid = req.uid;
    
    
    try {

        const evento = await Evento.findById ( eventoId );

        if( !evento ){
            return res.status(404).json({
                ok: false,
                msg:'Evento no encontrado'
            });
        }

        if(evento.user.toString() !== uid){
            return res.status(401).json({
                ok: false,
                msg:'No cuenta con los privilegios necesarios'
            })
        }

        const nuevoEvento = {
            ...req.body,
            user: uid
        }

        const eventoActualizado = await Evento.findByIdAndUpdate( eventoId, nuevoEvento, {new: true} );

        res.json({
            ok: true,
            evento: eventoActualizado
        })

        
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Por favor habla con el administrador'
        })
    }
}

const eliminarEvento = async (req, res = response) => {

    const eventoId = req.params.id;
    const uid = req.uid;

    try {

        const evento = await Evento.findById ( eventoId );
        
        if( !eventoId ){
            return res.status(404).json({
                ok: false,
                msg: 'El evento no se ha encontrado'
            })
        }

        if(evento.user.toString() !== uid){
            return res.status(401).json({
                ok: false,
                msg:'No cuenta con los privilegios necesarios'
            })
        }

        await Evento.findByIdAndRemove( eventoId )
        res.json({
            ok: true,
            msg: 'Evento borrado'
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }

    
}

module.exports = {
    getEventos,
    crearEvento, 
    actualizarEvento, 
    eliminarEvento
}