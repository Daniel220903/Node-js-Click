//Metodo para autenticacion(Sesiones)
const passport  = require('passport');
const LocalStrategy  = require('passport-local').Strategy;
const pool = require('../database');
const helpers = require ('./helpers'); 

passport.use('local.signin' , new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, username, password, done) => {
    //console.log(req.body);
    const special = /[!@#$%^&*(),.?":{}|<>]/;
    if((special.test(username)) || (special.test(password))){
        done(null, false, req.flash('message','NO SPECIAL CHARACTERS ACCEPTED'));
    }else{
        const rows = await pool.query('SELECT * FROM users WHERE username = ?' ,[username]);
        if(rows.length > 0) {
            const user = rows[0];
            const validPassword = await helpers.matchPassword(password, user.password);
            
            if(validPassword){
                // console.log("VALIDA");
                done(null , user, req.flash('sucess','WELCOME' + user.id));
                console.log(user.id);
            }else{
                // console.log("INVALIDA");
                done(null, false, req.flash('message','PASSWORD DOES NOT MATCH'));
            }
        }else{
           return done(null, false, req.flash('message','USER DOES NOT MATCH'));
        }
    }
  
    
}));


passport.use('local.signup', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}/*Esta funcion es un callback,se ejecuta hasta que se acabe el local strategy*/ 
    ,async (req, username, password, done) => {
        const{fullname} = req.body;
        const newUser= {
            username: username,
            password: password,
            fullname: fullname
        };
        const special = /[!@#$%^&*(),.?":{}|<>]/;
        if((special.test(newUser.fullname)) || (special.test(newUser.password)) || (special.test(newUser.username))){
            done(null, false, req.flash('message','NO SPECIAL CHARACTERS ACCEPTED'));
        }else{
            const poolUsername = await pool.query('SELECT username FROM users WHERE username = ?',  newUser.username);
            if(poolUsername[0]){
                done(null, false, req.flash('message','USERNAME ALREADY EXISTS'));
            }else{
                const Capittal = /[A-Z]/;
                const Lower = /[a-z]/;
                const Number = /\d/;
               
              
                    if ( (!Capittal.test(newUser.password)) || (!Number.test(newUser.password)) || (!Lower.test(newUser.password)) ) {
                        done(null, false, req.flash('message','PASSWORD MUST HAVE AT LEAST ONE UPPERCASE AND LOWERCASE LETTER, AND ONE NUMBER'));
                    }else{       
                                newUser.password = await helpers.encryptPassword(password);
                                const result = await pool.query('INSERT INTO users SET ?', [newUser]);
                                newUser.id = result.insertId;
                                // console.log(result);
                                return done(null, newUser);
                    }   
            }
        }
}));


 
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
   const rows = await pool.query('SELECT * FROM users WHERE id = ? ', [id]);
   done(null, rows[0]);
});