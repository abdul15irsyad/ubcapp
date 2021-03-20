const express = require('express')
const router = express.Router()
const Team = require('../../models/Team')
const { validationResult } = require('express-validator')
const teamValidator = require('../../validators/teamValidator')

/*
* @api {get} /api/v1/team
* @apiName getTeams
* @apiPermission public
* @apiDescription get all teams
*
* @apiParam {number} page : page number in pagination
* @apiParam {number} limit : limit data per page
* @apiParam {enum['asc','desc']} sort : sort type of data
*/
router.get('/', (req, res) => {
    try {
        let { page, limit, sort } = req.query
        sort = sort == 'asc' ? 1 : sort == 'desc' ? -1 : 1
        Team.paginate({}, {
            pagination: page == "all" ? false : true,
            populate: {
                path: 'players',
                model: 'Player',
                select: '-team',
                options: {
                    sort: 'name'
                }
            },
            page: page ? parseInt(page, 10) : 1,
            limit: limit ? parseInt(limit, 10) : 10,
            sort: {
                name: parseInt(sort)
            }
        }).then(response => {
            response.docs.forEach(doc => {
                doc.logo = req.headers.host + '/images/team/' + doc.logo
                return doc
            })
            return res.status(200).json({
                status: true,
                data: response
            })
        })
    } catch (err) {
        return res.status(500).json({
            message: 'interal server error!',
            error: err.message
        })
    }
})

/*
* @api {get} /api/v1/team/:id
* @apiName getTeam
* @apiPermission public
* @apiDescription get one team
*
* @apiParam {number} id : team unique id
*/
router.get('/:id', (req, res) => {
    try {
        let id = req.params.id
        Team.findById(id)
            .populate('players', '-team')
            .exec((err, doc) => {
                if (doc) {
                    doc.logo = req.headers.host + '/images/team/' + doc.logo
                    return res.status(200).json({
                        status: true,
                        data: doc,
                    })
                } else {
                    return res.status(200).json({
                        status: false,
                        message: "team not found!",
                    })
                }
            })
    } catch (err) {
        return res.status(500).json({
            message: 'interal server error!',
            error: err.message
        })
    }
})

/*
* @api {post} /api/v1/team
* @apiName addTeam
* @apiPermission public
* @apiDescription add team
*
* @apiParam {string} name : team's name
* @apiParam {string} logo : team's logo
*/
router.post('/', teamValidator.create, async (req, res) => {
    try {
        // if validation failed
        let errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({
                status: false,
                message: 'inputs not valid',
                errors: errors.array({ onlyFirstError: true })
            })
        }
        // if validation has been successful
        Team.create(req.body, (err, doc) => {
            if (doc) {
                doc.logo = req.headers.host + '/images/team/' + doc.logo
                return res.status(200).json({
                    status: true,
                    data: doc
                })
            } else {
                return res.status(200).json({
                    status: false,
                    message: err.message
                })
            }
        })
    } catch (err) {
        return res.status(500).json({
            message: 'interal server error!',
            error: err.message
        })
    }
})

/*
* @api {patch} /api/v1/team/:id
* @apiName editTeam
* @apiPermission public
* @apiDescription edit team
*
* @apiParam {string} name : team's name
* @apiParam {number} number : team's number
* @apiParam {Object.Id} teamId : team's team id
*/
router.patch('/:id', teamValidator.update, async (req, res) => {
    try {
        // if validation failed
        let errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({
                status: false,
                message: 'inputs not valid',
                errors: errors.array({ onlyFirstError: true })
            })
        }
        // if validation has been successful
        let id = req.params.id
        Team.findByIdAndUpdate(id, {
            $set: req.body
        }, async (err, doc) => {
            if (doc) {
                doc.logo = req.headers.host + '/images/team/' + doc.logo
                return res.status(200).json({
                    status: true,
                    data: await Team.findById(id)
                })
            } else {
                return res.status(200).json({
                    status: false,
                    message: "team not found!"
                })
            }
        })
    } catch (err) {
        return res.status(500).json({
            message: 'interal server error!',
            error: err.message
        })
    }
})

/*
* @api {delete} /api/v1/team
* @apiName deleteTeam
* @apiPermission public
* @apiDescription delete team
*
* @apiParam {number} id : team unique id
*/
router.delete('/:id', (req, res) => {
    try {
        let id = req.params.id
        Team.findById(id, async (err, doc) => {
            if (doc) {
                doc.logo = req.headers.host + '/images/team/' + doc.logo
                return res.status(200).json({
                    status: true,
                    message: "success delete team!",
                    data: await Team.findByIdAndRemove(id)
                })
            } else {
                return res.status(200).json({
                    status: false,
                    message: "team not found!",
                })
            }
        })
    } catch (err) {
        return res.status(500).json({
            message: 'interal server error!',
            error: err.message
        })
    }
})

module.exports = router