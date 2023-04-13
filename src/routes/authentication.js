const express = require('express');
const router = express.Router();
const passport = require('passport');
const pool = require('../database.js');
const {isLoggedIn,isNotLoggedIn} = require('../lib/auth');


// AQUI EMPIEZAN LOS RENDER DE LAS SESIONES

//El .get es lo que se renderizara en la pestaña que vera el usuario
router.get('/signup',  isNotLoggedIn, (req, res) => {
    res.render('auth/signup');
});

//El .post es lo que mandara el usuario a traves del formulario
router.post('/signup', isNotLoggedIn,
        passport.authenticate('local.signup',{
        successRedirect: '/signin',
        failureRedirect: '/signup',
        //El failure flash sirve para mostrar el error, en caso de que lo haya al hacer la accion deseada
        failureFlash: true
    }));
    
router.get('/signin',isNotLoggedIn,(req, res) => {
    res.render('auth/signin');
});

router.post('/signin',isNotLoggedIn, isNotLoggedIn, (req, res, next) => {

    passport.authenticate('local.signin',{
        successRedirect:'/links',
        failureRedirect: '/signin',
        failureFlash: true
    })(req, res, next);

});

router.get('/logout', isLoggedIn, (req, res) => {
    req.logOut(function(err) {
        if (err) {
            console.log(err);
        }
        res.redirect('/signin');
    });
});

// AQUI TERMINAN

router.get('/profile/:user_id', isLoggedIn, async(req, res) => {
    // res.send('Perfil del usuario ' + req.params.user_id);
    //Aqui obtengo la id mandada mediante la url y la mando como parametro para trabar con ella
    const userId = req.params.user_id;
    const profileInfo = await pool.query('SELECT * FROM users WHERE id = ?', userId);
    const profileUser = profileInfo[0];
    const pubs = await pool.query('SELECT * FROM posts WHERE user_id = ?', userId);
    console.log(pubs)
    res.render('profile',{userId: userId, profileUser: profileUser , pubs:pubs});

});

router.get('/config/menu/:user_id', isLoggedIn, async(req, res) =>{
    const userId = req.params.user_id;
    const profileInfo = await pool.query('SELECT * FROM users WHERE id = ?', userId);
    const profileUser = profileInfo[0];
    console.log(profileUser);
    res.render('config/menu', {userId: userId, profileUser:profileUser});
});




module.exports = router;

