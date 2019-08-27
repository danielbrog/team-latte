const express = require('express')
const router = new express.Router()
const AWS = require('aws-sdk')
const multer = require('multer')
const auth = require('../middleware/auth')
const Project = require('../models/project')
const User = require('../models/user')

//set up image upload paramaters
const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {

        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('File must be an image (jpg,jpeg,png).'))
        };

        cb(undefined, true)
    }
})

router.post('/project', auth, upload.array('images', 5), async (req, res) => {
    const s3 = new AWS.S3();

    //create new project to push to db
    const project = new Project({
        ...req.body,
        photos: [],
        author: req.user._id
    })

    //upload photos to aws s3
    const promises = req.files.map(file => {
        const params = {
            Bucket: process.env.aws_bucket,
            Key: req.body.title.replace(/[^a-zA-Z0-9]/g, '') + file.originalname,
            Body: file.buffer,
            ACL: 'public-read'
        }

        return s3.upload(params).promise()

    })

    //push photos onto project object
    Promise.all(promises).then(results => {
        results.forEach(result => {
            project.photos.push({
                photo: {
                    link: result.Location,
                    key: result.key
                }
            })
        });

        //save and send project to db and client
        project.save()
        res.send(project)
    }).catch(e => {
        res.status(503).send(e)
    })
})


router.put('/project/:id', auth, upload.array('images', 5), async (req, res) => {

    const s3 = new AWS.S3()

    //find project to update
    const project = await Project.findById(req.params.id)
    if (!project) res.status(404).send("Project not found.")

    //setting the updated project data sans images
    const { title, funding_goal, location, industry, subtitle } = req.body
    if (title) project.title = title
    if (funding_goal) project.funding_goal = funding_goal
    if (location) project.location = location
    if (industry) project.industry = industry
    if (subtitle) project.subtitle = subtitle

    //removing photos if needed
    if (req.body.removals) {

        //remove photos from mongo
        project.photos = project.photos.filter(photo => {
            return (!(req.body.removals.includes(photo.photo.key)))
        })

        //delete photos from aws s3 that need to be removed
        const deletePhoto = req.body.removals.map(removal => ({ Key: removal }))
        const params = {
            Bucket: process.env.aws_bucket,
            Delete: {
                Objects: deletePhoto,
                Quiet: true
            },
        }
        s3.deleteObjects(params, (err, data) => {
            if (err) res.status(503).send(err)
        })
    }
    
        //add new photos to aws s3
        const promises = req.files.map(file => {
            const params = {
                Bucket: process.env.aws_bucket,
                Key: project.title.replace(/[^a-zA-Z0-9]/g, '') + file.originalname,
                Body: file.buffer,
                ACL: 'public-read'
            }

            return s3.upload(params).promise()
        })

        //add new photos to project object for mongo
        Promise.all(promises).then(results => {
            results.forEach(result => {
                project.photos.push({
                    photo: {
                        link: result.Location,
                        key: result.key
                    }
                })
            });
            project.save()
            res.status(200).send(project)
        }).catch(e => {
            res.status(503).send(e)
        })



})


module.exports = router