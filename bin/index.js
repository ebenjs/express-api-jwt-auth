#!/usr/bin/env node
const {createReadStream, createWriteStream, realpathSync, mkdir, writeFileSync, readFileSync} = require('fs');
const path = require('path');
const yargs = require("yargs");
const replace = require("replace");
const {exec} = require('child_process');

const options = yargs
    .usage("Usage: -t <type>")
    .option("t", {alias: "type", describe: "Api auth system type : basic | full", type: "string", demandOption: true})
    .argv;

if (options.type === 'basic') {
    createFiles();
    installDependacies();
} else if (options.type === 'full') {
    createFullFiles();
    installDependacies();
} else {
    console.log(`unknown type ${options.type}. Valid types are [basic, full]`)
}

function createFiles() {
    createReadStream(path.join(path.dirname(realpathSync(__filename)), '../dist/api.js')).pipe(createWriteStream('routes/api.js')).on('error', console.error);
    // Copying models and modules
    createModels();
    createModules();
    editApp()
    console.log('Files created.');
}

function createFullFiles() {
    createReadStream(path.join(path.dirname(realpathSync(__filename)), '../dist/api-full.js')).pipe(createWriteStream('routes/api.js')).on('error', console.error);
    // Copying .env files
    createReadStream(path.join(path.dirname(realpathSync(__filename)), '../dist/.env')).pipe(createWriteStream('.env')).on('error', console.error);
    // Copying models and modules
    createModels();
    createModules();
    editApp();
    console.log('Files created.');
}

function createModels() {
    mkdir('models', {recursive: true}, (err) => {
        if (err && err != null) {
            console.error(err)
        } else {
            createReadStream(path.join(path.dirname(realpathSync(__filename)), '../dist/user.js')).pipe(createWriteStream('models/user.js')).on('error', console.error);
        }
    });
}

function createModules() {
    mkdir('modules', {recursive: true}, (err) => {
        if (!err && err != null) {
            console.error(err)
        } else {
            createReadStream(path.join(path.dirname(realpathSync(__filename)), '../dist/consts.js')).pipe(createWriteStream('modules/consts.js')).on('error', console.error);
            createReadStream(path.join(path.dirname(realpathSync(__filename)), '../dist/utility.js')).pipe(createWriteStream('modules/utility.js')).on('error', console.error);
        }
    });
}

function editApp() {
    replace({
        regex: escapeRegExp("var indexRouter = require('./routes/index');"),
        replacement: "var indexRouter = require('./routes/index');\nvar apiRouter = require('./routes/api');",
        paths: ['app.js'],
        recursive: false,
        silent: true,
    });
    replace({
        regex: escapeRegExp("app.use('/', indexRouter);"),
        replacement: "app.use('/', indexRouter);\napp.use('/api', apiRouter);",
        paths: ['app.js'],
        recursive: false,
        silent: true,
    });

    let content = readFileSync('app.js').toString().split('\n');
    content.unshift('require(\'dotenv\').config();');
    writeFileSync('app.js', content.join('\n'));
}

function escapeRegExp(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

function installDependacies(){
    console.log('Installing dependencies...')
    exec('npm install dotenv jsonwebtoken mongoose passport passport-jwt passport-local-mongoose', (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return;
        }
        console.log(`${stdout}`);
        console.error(`${stderr}`);
        console.log('All stuffs installed. You are ready to go.');
    });
}
