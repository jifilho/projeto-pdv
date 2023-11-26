const aws = require('aws-sdk')

const endpoint = new aws.Endpoint(process.env.ENDPOINT_BACKBLAZE)

const s3 = new aws.S3({
    endpoint,
    credentials: {
        accessKeyId: process.env.KEY_ID,
        secretAccessKey: process.env.APP_KEY
    }
})


const uploadFile = async (path, buffer, mimetype) => {

    console.log(path, buffer, mimetype)
    const imagem = await s3.upload({
        Bucket: process.env.BACKBLAZE_BUCKET,
        Key: path,
        Body: buffer,
        ContentType: mimetype
    }).promise()

    
    return {
        path: imagem.Key,
        url: `https://${process.env.BACKBLAZE_BUCKET}.${process.env.ENDPOINT_BACKBLAZE}/${imagem.Key}`
    }
}

const excluirImagem = async (path) => {

        await s3.deleteObject({
            Bucket: process.env.BACKBLAZE_BUCKET,
            Key: path
        }).promise()
    
}

module.exports = {
    excluirImagem,
    uploadFile
}