const swaggerAutogen = require("swagger-autogen") ();

const doc ={
  info: {
    title: 'Advertisement-Management-API',
    description: 'Description'
  },
  host: 'localhost:8008',
//   host: 'library-api-k879.onrender.com',
  schemes: ['http']
}

const outputFile = './swagger-output.json';
const routes = ['./app.js'];

swaggerAutogen(outputFile, routes, doc);