//AQUI CONFIGURO LAS RUTAS PRINCIPALES DE LA APLICACION

const express = require('express');
const router = express.Router();
const {isLoggedIn,isNotLoggedIn} = require('../lib/auth');

router.get('/', isNotLoggedIn, (req,res) => {
    res.render('index');
});

module.exports = router;

