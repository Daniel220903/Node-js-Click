// module.exports = {
//     database: {
//         host: 'localhost',
//         user: 'root',
//         password: '',
//         database: 'database_click'
//     }
// };
module.exports = {
     PORT : process.env.PORT || 3000,
     database: {
      DB_HOST : process.env.DB_HOST || 'localhost',
      DB_USER : process.env.DB_USER || 'root',
      DB_PASSWORD : process.env.DB_PASSWORD || '',
      DB_NAME : process.env.DB_NAME || 'database_click',
        
     }
}



// export const DB_HOST = process.env.DB_HOST || 'localhost'
// export const DB_USER = process.env.DB_USER || 'root'
// export const DB_PASSWORD = process.env.DB_PASSWORD || ''
// export const DB_NAME = process.env.DB_NAME || 'database_click'
// export const DB_PORT = process.env.DB_PORT || 3306
