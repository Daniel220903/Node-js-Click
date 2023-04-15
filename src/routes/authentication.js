const express = require('express');
const router = express.Router();
const passport = require('passport');
const pool = require('../database.js');
const helpers = require ('../lib/helpers');
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

router.post('/signin',isNotLoggedIn, (req, res, next) => {

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
    // console.log(profileUser);
    res.render('config/menu', {userId: userId, profileUser:profileUser});
});

router.post('/config/menu/:user_id', isLoggedIn, async(req, res) =>{
    const user_id = req.user.id;
    const profileInfo = await pool.query('SELECT * FROM users WHERE id = ?', user_id);
    const profileUser = profileInfo[0];
    const newUsername =req.body.username;
    // console.log(profileUser.username);
    // console.log(newUsername);
    const compareUser = await pool.query('SELECT * FROM users WHERE username = ?', newUsername);
    const resultUser = compareUser[0];
    // console.log(resultUser);

    if(resultUser){
        req.flash('message', 'THAT USER ALREADY EXIST');
        res.redirect(`./${user_id}`);
    }else{
        if(profileUser.username == newUsername){  
            req.flash('message', 'THE USERNAME IS STILL THE SAME');
            res.redirect(`./${user_id}`);//ESTUDIA BIEN ESTA PARTE QUE TE LA RESOLVIO CHATGPT
        }else{
            // const insertion = await pool.query("INSERT username INTO users WHERE id =?",req.user.id );
            const insertion = await pool.query("UPDATE users SET username = ? WHERE id = ?", [newUsername, req.user.id]);
            if(insertion){
                req.flash('success', 'USERNAME SUCCESFULLY CHANGED');
                res.redirect(`./${user_id}`);//ESTUDIA BIEN ESTA PARTE QUE TE LA RESOLVIO CHATGPT
            }
        }
    }
  
});

router.get('/config/changePass/:user_id' ,isLoggedIn, async(req, res) =>{
    const userId = req.params.user_id;
    const profileInfo = await pool.query('SELECT * FROM users WHERE id = ?', userId);
    const profileUser = profileInfo[0];
    
    res.render('config/changePass', {userId: userId, profileUser:profileUser});
});

router.post('/config/changePass/:user_id', isLoggedIn, async(req, res) =>{
    const user_id = req.params.user_id;
    const profileInfo = await pool.query('SELECT * FROM users WHERE id = ?', user_id);
    const profileUser = profileInfo[0];
    const actualPass = req.body.actual;
    const newPass = req.body.new;
    const validActual = await helpers.matchPassword(actualPass, profileUser.password);
    // console.log(validActual);
    if(validActual){
        const special = /[!@#$%^&*(),.?":{}|<>]/;
        const Capittal = /[A-Z]/;
        const Lower = /[a-z]/;
        const Number = /\d/;
        // console.log(profileUser.password);
        const compareBoth = actualPass == newPass;
        if(compareBoth){
            req.flash('message', 'NO CHANGES ON YOUR NEW PASSWORD');
            res.redirect(`./${user_id}`);//ESTUDIA BIEN ESTA PARTE QUE TE LA RESOLVIO CHATGPT 
        }else{
            if(special.test(newPass)){
                req.flash('message', 'NO SPECIAL CHARACTERS ACCEPTED');
                res.redirect(`./${user_id}`);//ESTUDIA BIEN ESTA PARTE QUE TE LA RESOLVIO CHATGPT 
            }else{
                if((!Capittal.test(newPass)) || (!Lower.test(newPass)) || (!Number.test(newPass))){
                    req.flash('message', 'PASSWORD MUST HAVE AT LEAST ONE UPPERCASE AND LOWERCASE LETTER, AND ONE NUMBER');
                    res.redirect(`./${user_id}`);//ESTUDIA BIEN ESTA PARTE QUE TE LA RESOLVIO CHATGPT 
                }else{
                    finalPass = await helpers.encryptPassword(newPass);
                    const insertion = await pool.query("UPDATE users SET password = ? WHERE id = ?", [finalPass, user_id]);
                   if(insertion){
                        req.flash('success', 'PASSWORD UPDATE SUCCESSFULLY');
                        res.redirect(`./${user_id}`);//ESTUDIA BIEN ESTA PARTE QUE TE LA RESOLVIO CHATGPT 
                   }else{
                        req.flash('message', 'THERE WAS A MISTAKE, TRY TO UPDATE LATER');
                        res.redirect(`./${user_id}`);
                   }
                }
            }
        }
    }else{
        req.flash('message', 'ACTUAL PASSWORD DOESNT MATCH');
        res.redirect(`./${user_id}`);//ESTUDIA BIEN ESTA PARTE QUE TE LA RESOLVIO CHATGPT 
    }
});


module.exports = router;

