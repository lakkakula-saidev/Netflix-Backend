import express from "express";
import fs from "fs";
import { dirname, join, extname } from "path";
import { fileURLToPath } from "url";
import uniqid from "uniqid";
import { setPosterUrl, writeMediaPoster, editedMedia, getSingleMediaQuery, getSingleMediaId, getAllMedia } from '../lib/fs-tools.js'
import getQuery from '../OMDB/getQuery.js'
import {
    checkMediaSchema,
    checkValidatonResult,
    checkSearchSchema,
} from "./validation.js";
import multer from "multer";
import { pipeline } from "stream"
/* import { generatePDFStream } from "../lib/generatePDFStream.js" */

const mediaRouter = express.Router();

mediaRouter.get('/', async (req, res) => {
    console.log('I am hereee')
    let mediaContent = await getAllMedia();
    res.send(mediaContent);

})

mediaRouter.get('/search', async (req, res, next) => {
    const key = Object.keys(req.query)[0];
    const value = Object.values(req.query)[0];
    try {
        const queryContent = await getSingleMediaQuery(key, value)
        console.log(queryContent)
        if (queryContent.length > 0) {
            res.status(200).send(queryContent)
        } else if (queryContent.length == 0) {
            console.log('I am fetching from OMDb')
            const newContent = await getQuery(value)
            res.status(200).send(newContent)
        }
        else {
            const error = new Error("No content Found here");
            error.status = 204;
            next(error);
        }
    } catch (error) {
        next(error)
    }


})

mediaRouter.get('/:id', async (req, res, next) => {
    try {
        const singleContent = await getSingleMediaId(req.params.id)
        console.log(singleContent)
        if (singleContent) {
            res.status(200).send(singleContent)
        } else {
            const error = new Error("No content Found here");
            error.status = 204;
            next(error);
        }
    } catch (error) {
        next(error)
    }
})

mediaRouter.post("/", checkMediaSchema, checkValidatonResult, async (req, res, next) => {
    try {
        const newMedia = { ...req.body, imdbID: uniqid() };
        const content = await getAllMedia(); // 1. read the requested JSON file as the as human readable by converting the BUFFER into human readable
        content.push(newMedia);
        await editedMedia(content);
        res.status(201).send({ _id: newMedia.imdbID });
    } catch (error) {
        next(error);
    }
})

mediaRouter.put("/:id", checkMediaSchema, checkValidatonResult, async (req, res, next) => {
    try {
        const content = await getAllMedia();

        const remainingContent = content.filter(
            (item) => item.imdbID !== req.params.id
        );
        const updatedMedia = { ...req.body, imdbID: req.params.id };
        remainingContent.push(updatedMedia);
        await editedMedia(remainingContent);
        res.send(updatedMedia);
    } catch (error) {
        next(error);
    }
}
);
mediaRouter.delete('/:id', async (req, res, next) => {
    try {
        const Content = await getAllMedia()
        const remainingContent = Content.filter(
            (item) => item.imdbID !== req.params.id);
        await editedMedia(remainingContent);
        res.status(204).send();
    } catch (error) {
        next(error)
    }
})


mediaRouter.post("/:id/uploadPoster", multer().single("poster"), async (req, res, next) => {

    try {
        const mediaId = req.params.id;
        await writeMediaPoster(`${mediaId}${extname(req.file.originalname)}`, req.file.buffer)
        console.log('i am changing picture from front')
        const posterPath = `${req.protocol}://${req.get("host")}/img/moviePoster/${req.params.id}${extname(req.file.originalname)}`
        await setPosterUrl(posterPath, req.params.id)
        res.send()
    } catch (error) {
        next(error)
    }
})

export default mediaRouter
