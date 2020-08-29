const { Router } = require ('express');
const { check } = require('express-validator');
const { validar } = require('../middlewares/validar-campos');
const { validarJWT } = require ('../middlewares/validar-jwt')
const { getEventos, crearEvento, actualizarEvento, eliminarEvento } = require('../controllers/events');
const { validarCampos } = require('../middlewares/validar-campos');
const { isDate } = require('../helpers/is-date');


const router = Router();

//Todas las rutas de aca abajo tienen que pasar por JWT,
//para no pegar el middleware en cada ruta

router.use( validarJWT );

router.get('/', getEventos);

router.post('/',
    [
       check('title', 'El titulo es obligatorio').not().isEmpty(),
       check('start', 'La fecha de inicio es obligatoria').custom(isDate),
       check('end', 'La fecha de fin es obligatoria').custom(isDate),
       validarCampos 
    ],
    crearEvento);

router.put('/:id',
    [
       check('title', 'El titulo es obligatorio').not().isEmpty(),
       check('start', 'La fecha de inicio es obligatoria').custom(isDate),
       check('end', 'La fecha de fin es obligatoria').custom(isDate),
       validarCampos 
    ],
    actualizarEvento);

router.delete('/:id', eliminarEvento);


module.exports = router;
