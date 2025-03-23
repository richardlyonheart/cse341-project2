const swaggerAutogen = require("swagger-autogen");

const doc = {
    info:{
        title: 'project2 API',
        description: 'project2 API',
    },
    host: 'https://cse341-project2-0msn.onrender.com',
    scheme: ['http', 'https'],
};

const outputFile = './swagger.json';
const endpointFiles = ['./routes/index.js'];

swaggerAutogen(outputFile, endpointFiles, doc);

