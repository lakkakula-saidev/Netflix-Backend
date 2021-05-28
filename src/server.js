import express from 'express'
import listEndpoints from 'express-list-endpoints'
import cors from 'cors'
import fs from 'fs-extra'
import uniqid from "uniqid"
import { fileURLToPath } from "url"
import { dirname, join } from "path"
import {
    badRequestErrorHandler,
    notFoundErrorHandler,
    forbiddenErrorHandler,
    catchAllErrorHandler,
} from "./errorHandlers.js";
import mediaRouter from './Media/index.js'
import userMail from "./Users/index.js";

const server = express()
const port = process.env.PORT || 3001;
const whiteList = [process.env.FRONTEND_DEV_URL, process.env.FRONTEND_CLOUD_URL]
console.log(whiteList)

const publicFolder = join(dirname(fileURLToPath(import.meta.url)), '../public/')


server.use(express.static(publicFolder))

const corsOptions = {
    origin: function (origin, next) {
        console.log('This is the origin', origin)
        if (whiteList.indexOf(origin) !== -1) {
            //origin allowed
            next(null, true)
        } else {
            next(new Error('CORS PROBLEM: ORIGIN NOT SUPPORTED'))
        }
        //origin notallowed  
    }
}

server.use(cors(corsOptions));

server.use(express.json())
const logger = async (req, res, next) => {
    const content = await fs.readJSON(join(dirname(fileURLToPath(import.meta.url)), "log.json"))
    content.push({
        _timeStamp: new Date(),
        method: req.method,
        resource: req.url,
        query: req.query,
        body: req.body,
        _id: uniqid()
    })

    await fs.writeJSON(join(dirname(fileURLToPath(import.meta.url)), "log.json"), content)
    next()
}
server.use(logger)

server.use('/media', mediaRouter)
server.use('/mail', userMail)
server.use(badRequestErrorHandler);
server.use(notFoundErrorHandler);
server.use(forbiddenErrorHandler);
server.use(catchAllErrorHandler);


console.table(listEndpoints(server));
server.listen(port, () => {
    console.log("server listening on port", port);
});
