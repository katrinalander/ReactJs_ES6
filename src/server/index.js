'use strict';

const express = require('express');
const fs = require('fs');
const glob = require('glob');

const port = process.env.port || 3001;
const ipAddress = process.env.IP_ADDRESS || '127.0.0.1';

const APPLICATION_ROOT = __dirname.replace(/\\/g, '/');
const MOCK_ROOT = APPLICATION_ROOT + '/data';
const MOCK_FILE_EXTENSION = '.json';
const MOCK_ROOT_PATTERN = MOCK_ROOT + '/**/*' + MOCK_FILE_EXTENSION;

let serverRouter = express.Router();

const app = express();
console.log('STARTING...');

const files = glob.sync(MOCK_ROOT_PATTERN);
const routes = {};

const generateResponse = function(req,res) {
    const mockData = `${MOCK_ROOT}${req.url.split('?')[0]}${MOCK_FILE_EXTENSION}`;

    console.log('Reading file: '+mockData);
    const result = fs.readFileSync(mockData, 'utf8');
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.write(result);
    res.end();
}

function generateResponseAsync(req,res) {
    setTimeout(() => {
        generateResponse(req,res);
    },0);
}

if(files && files.length) {
    files.forEach(function (fileName) {
        const path = fileName.replace(MOCK_ROOT, '').replace(MOCK_FILE_EXTENSION, '');
        const parts = path.slice(1).split('/');
        const route = parts.length ? '/' + parts.join('/') : path;

        if (!routes[route]) {
            routes[route] = true;

            serverRouter.get(route, generateResponseAsync);
            serverRouter.put(route, generateResponseAsync);
            serverRouter.post(route, generateResponseAsync);
            serverRouter.delete(route,generateResponseAsync);

            console.log('Registered route '+route);
        }
    });
}

console.log('Mock API Server listening: [http://${ipAddress}:${port}]');
app.use('',serverRouter);
app.listen(port,ipAddress);