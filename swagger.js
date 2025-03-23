const swaggerAutogen = require("swagger-autogen");

const doc = {
    info:{
        title: 'Cars API',
        description: 'Cars API',
    },
    host: 'https://cse341-project2-0msn.onrender.com',
    scheme: ['http', 'https'],
};

const outputFile = './swagger.json';
const endpointFiles = ['./routes/index.js'];

swaggerAutogen(outputFile, endpointFiles, doc);

