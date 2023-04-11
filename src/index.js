//Llamada de modulos
const express = require('express');
//Modulo para manipular las peticiones http
const morgan = require('morgan');
//Modulo para trabajar con plantillas
const exphbs = require('express-handlebars');
//Modulo para trabajar con rutas
const path = require('path');
//Mostrar mensajes en pantalla, cada que el usuario interacciona con el backend
const flash = require('connect-flash');
// Para el uso de sesiones y cookies
const session = require('express-session');
// Inserciones a la base
const MySQLStore = require('express-mysql-session')(session);
//Es el metodo de autenticacion con la base al iniciar sesion
const passport = require('passport');
const helper = require('./lib/helper');

const {database} = require('./keys');

//inicializo las variables
const app = express();
require('./lib/passport');

//configuraciones
app.set('port', process.env.PORT || 4000);
//Defino la ruta de la carpeta views
app.set('views', path.join(__dirname, 'views'));
  
app.engine('.hbs', exphbs.engine ({
    defaultLayout: 'main',
    //concateno layouts a la ruta previamente establecida de views
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs', //la extension a utilizar en las carpetas definidas
    helpers: require('./lib/handlebars'),
    
}));
app.set('view engine', 'hbs');
 
 
//Funciones de usuarios(MIDDLEWARES)
app.use(session({
    secret: "DanielVillalobos",
    resave: false,
    saveUninitialized: false,
    store: new MySQLStore(database),
}));
app.use(flash());
app.use(morgan('dev'));
//Esto sirve para recibir datos del usuario mediante url
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
//Inicializo passport 
app.use(passport.initialize());
app.use(passport.session());
 
//Variables Globales
app.use((req, res, next) => {
    app.locals.success = req.flash('success');
    app.locals.message = req.flash('message');
    app.locals.user = req.user;
    next();
});
 
//Rutas
app.use(require('./routes/'));
app.use(require('./routes/authentication'));
app.use('/links', require('./routes/links'));
 
//Public Files
app.use(express.static(path.join(__dirname, 'public')));
 
//Inicializo el servidor
app.listen(app.get('port'), () => {
    console.log('Server on Port:' + app.get('port'));
});

