const storageModel = require("../models/nosql/storage");
const { handleHttpError } = require('../utils/handleError')
const fs = require("fs")


const PUBLIC_URL = process.env.PUBLIC_URL
const MEDIA_PATH = __dirname + "/../storage"




const createItem = async (req, res) => {
    try {
        const { body, file } = req
        console.log("1")
        const fileData = { 
            filename: file.filename,
            url: process.env.PUBLIC_URL+"/"+file.filename
        }
        console.log("2")
        const data = await storageModel.create(fileData)
        res.send(data)
    }catch(err) {
        handleHttpError(res, "ERROR_DETAIL_ITEM")
    }
}





module.exports = { createItem}