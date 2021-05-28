import fs from "fs-extra";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const { readJSON, writeJSON, writeFile } = fs

const mediaJSONPath = join(dirname(fileURLToPath(import.meta.url)), "../Media")

const moviePosterPath = join(dirname(fileURLToPath(import.meta.url)), "../../public/img/moviePoster");
const mailAttachmentPath = join(dirname(fileURLToPath(import.meta.url)), "../")

export const getAllMedia = async () => {
    const content = await readJSON(join(mediaJSONPath, 'media.json'))
    return content
}

export const getSingleMediaId = async (id) => {
    const content = await readJSON(join(mediaJSONPath, 'media.json'))
    const singleContent = content.find(item => item.imdbID === id)
    return singleContent
}
export const getSingleMediaQuery = async (key, value) => {

    const content = await readJSON(join(mediaJSONPath, 'media.json'))
    const queryContent = content.filter(item => item[key].toLowerCase().includes(value.toLowerCase()))
    return queryContent
}

export const moviePosterPATH = () => moviePosterPath

//******write covers or posters */
export const writeMediaCover = async (fileName, data) => {

    await writeFile(join(moviePosterPath, fileName), data);
}

export const editedMedia = (newContent) => {
    console.log('I am here to edit')
    fs.writeFile(join(mediaJSONPath, 'media.json'), JSON.stringify(newContent));
};

export const writeMediaPoster = async (fileName, data) => {

    await writeFile(join(moviePosterPath, fileName), data);
}

// *********export paths*******

export const getCurrrentFolderPath = (currentFile) =>
    dirname(fileURLToPath(currentFile));


//********* setPosterUrl********* */

export const setPosterUrl = async (posterURL, id) => {

    const coverImgPost = await getAllMedia()
    const singlePost = coverImgPost.map(post => {

        if (post.imdbID === id) {
            console.log('I am here...')
            post.Poster = posterURL
        }

        return post
    })

    await writeJSON(join(mediaJSONPath, 'media.json'), singlePost);
}

// ************** Set Images Urls *************************

export const emailAttachment = () => {
    const content = readFile(join(mailAttachmentPath, 'authors.csv'))

    return content
}