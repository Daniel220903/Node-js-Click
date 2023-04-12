const express = require('express');
const router = express.Router();
const passport = require('passport');
const pool = require('../database.js');
const {isLoggedIn} = require('../lib/auth');

router.get('/add', isLoggedIn, (req , res) => {
    res.render('links/add');
});

/*
    Lo que hace la palabra async es que hace las peticiones asincronas,
    significa que, mientras se procesa esta peticion, se ejecutara el resto de codigo
*/



router.post('/add',isLoggedIn, async(req , res) => {
    //Esto es destructuring
    const user_id = req.user.id;
    const { tittle, description} = req.body;
    const newLink = {
        tittle,
        description,
        user_id,
    };
    /* await lo que hace es parecido al async, establece que la peticion dada
        tomara su tiempo, por lo cual en lo que se procesa, el codigo debe seguir con las demas lineas*/
    await pool.query('INSERT INTO posts set ?', [newLink]);
    req.flash('success', 'Post creado correctamente');
    res.redirect('/links');
});

//Aqui estoy mandando la variable links a la plantilla, list, que es donde voy a tener las publicaciones
router.get('/', isLoggedIn,  async (req, res) => {
    const links = await pool.query('SELECT * FROM posts');
    const userIds = links.map(link => link.user_id);

    if (userIds.length === 0) {
      // Si el array userIds está vacío, puedes manejar el error o devolver una respuesta adecuada
      // Aquí se muestra un ejemplo de cómo manejar el error
      return res.status(400).json({ error: 'No se encontraron IDs de usuario válidas.' });
    }

    const users = await pool.query('SELECT id, username, fullname FROM users WHERE id IN (?)', [userIds]);
    const userMap = {};
    users.forEach(user => {
      userMap[user.id] = user.username;
    });

    const linksWithUsers = links.map(link => ({
        ...link,
        username: userMap[link.user_id],
        id: link.user_id,
        sessionId: req.user.id
      }));
    res.render('links/list', { links: linksWithUsers});
});

router.get('/delete/:id_post',isLoggedIn, async (req, res) =>{
    const {id_post} = req.params;
    const user_id = await pool.query('SELECT user_id FROM posts where id_post = ?', id_post);
    //Aqui entro al objeto, en la posicion 0 y luego al atributo del id
    const user_idValue = user_id[0].user_id;
    //Validacion de ids
    const validation = req.user.id === user_idValue;
    if(validation){
        await pool.query('DELETE FROM posts WHERE id_post = ?', [id_post]);
        req.flash('success', 'Post borrado exitosamente');
        res.redirect('/links');
    } else{
        req.flash('message', 'No puedes borras publicaciones ajenas');
        res.redirect('/links');
    }
});    
        



router.get('/edit/:id_post',isLoggedIn, async (req, res) =>{
    const{id_post} = req.params;
    const user_id = await pool.query('SELECT user_id FROM posts where id_post = ?', id_post);
    //Aqui entro al objeto, en la posicion 0 y luego al atributo del id
    const user_idValue = user_id[0].user_id;
     //Validacion de ids
    const validation = req.user.id === user_idValue;
    if(validation){
        const link = await pool.query ('SELECT * FROM posts WHERE id_post = ?', [id_post]);
        
        /*Aqui mando el arreglo en la posicion 0, porque se manda un objeto mas grande
        pero en la posicion 0 estan los datos del id requerido de la tabla*/
        res.render('links/edit', {link: link[0]});
        router.post('/edit/:id_post', async (req, res) =>{
            const{id_post} = req.params;
            const edited = '1';
            const {tittle, description,created_at} = req.body;
            const newPub = {
                tittle,
                description,
                created_at,
                edited 
            };
            
            await pool.query('UPDATE posts set ? WHERE id_post = ?', [newPub, id_post]);
            req.flash('success', 'Publicacion editada correctamente');
            res.redirect('/links');
            
        });
    }else{
        req.flash('message', 'No puedes editar publicaciones ajenas');
        res.redirect('/links');
    }
});



module.exports = router;
