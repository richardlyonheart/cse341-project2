const swaggerAutogen = require("swagger-autogen");

const doc = {
    info:{
        title: 'project2 API',
        description: 'project2 API',
    },
    host: 'cse341-project2-0msn.onrender.com',
    scheme: ['https'],
};

const outputFile = './swagger.json';
const endpointFiles = ['./server.js'];

swaggerAutogen(outputFile, endpointFiles, doc);

