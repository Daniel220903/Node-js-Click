const bcrypt = require('bcryptjs');

const helpers = {};

helpers.encryptPassword = async (password) => {
    /*
    genSalt es la cantidad de veces que se ejecutara el algoritmo de encriptacion, lo que le mandes
    por parametro sera la cantidad de veces que se encriptara(entre mas se encripte mas lento es, pero mas seguro). 
*/
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
   //Aqui cifro la contraseña una vez ya encriptada
  return hash;
};

helpers.matchPassword = async (password, savedPassword) => {
  try {
    const finalPass = await bcrypt.compare(password, savedPassword);
    return finalPass;
  } catch (e) {
    console.log(e)
  }
};

module.exports = helpers;


