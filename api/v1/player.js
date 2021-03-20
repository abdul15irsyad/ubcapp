const express = require('express')
const router = express.Router()
const Player = require('../../models/Player')
const Team = require('../../models/Team')
const { validationResult } = require('express-validator')
const playerValidator = require('../../validators/playerValidator')

/*
* @api {get} /api/v1/player
* @apiName getPlayers
* @apiPermission public
* @apiDescription get all players
*
* @apiParam {number} page : page number in pagination
* @apiParam {number} limit : limit data per page
* @apiParam {enum['asc','desc']} sort : sort type of data
*/
router.get('/', (req, res) => {
    try {
        let { page, limit, sort } = req.query
        sort = sort == 'asc' ? 1 : sort == 'desc' ? -1 : sort
        Player.paginate({}, {
            pagination: page == "all" ? false : true,
            populate: {
                path: 'team',
                model: 'Team',
                select: '-players'
            },
            page: page ? parseInt(page, 10) : 1,
            limit: limit ? parseInt(limit, 10) : 10,
            sort: {
                name: parseInt(sort)
            }
        }).then(response => {
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
* @api {get} /api/v1/player/:id
* @apiName getPlayer
* @apiPermission public
* @apiDescription get one player
*
* @apiParam {number} id : player unique id
*/
router.get('/:id', (req, res) => {
    try {
        let id = req.params.id
        Player.findById(id)
            .populate('team')
            .exec((err, doc) => {
                if (doc) {
                    return res.status(200).json({
                        status: true,
                        data: doc
                    })
                } else {
                    return res.status(200).json({
                        status: false,
                        message: "player not found!",
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
* @api {post} /api/v1/player
* @apiName addPlayer
* @apiPermission public
* @apiDescription add player
*
* @apiParam {string} name : player's name
* @apiParam {number} number : player's number
* @apiParam {Object.Id} teamId : player's team id
*/
router.post('/', playerValidator.create, async (req, res) => {
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
        Player.create({
            name: req.body.name,
            number: req.body.number,
            position: req.body.position,
            team: req.body.teamId,
        }, async (err, doc) => {
            if (doc) {
                let team = await Team.findById(doc.team)
                team.players.push(doc._id)
                team.save()
                let player = await Player.findById(doc._id).populate('team', '-players')
                player.team.logo = req.headers.host + '/images/team/' + player.team.logo
                return res.status(200).json({
                    status: true,
                    data: player
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
* @api {patch} /api/v1/player/:id
* @apiName editPlayer
* @apiPermission public
* @apiDescription edit player
*
* @apiParam {string} name : player's name
* @apiParam {number} number : player's number
* @apiParam {Object.Id} teamId : player's team id
*/
router.patch('/:id', playerValidator.update, async (req, res) => {
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
        Player.findByIdAndUpdate(id, {
            $set: req.body
        }, async (err, doc) => {
            if (doc) {
                return res.status(200).json({
                    status: true,
                    data: await Player.findById(id).populate('team', '-players')
                })
            } else {
                return res.status(200).json({
                    status: false,
                    message: "player not found!"
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
* @api {delete} /api/v1/player
* @apiName deletePlayer
* @apiPermission public
* @apiDescription delete player
*
* @apiParam {number} id : player unique id
*/
router.delete('/:id', (req, res) => {
    try {
        let id = req.params.id
        Player.findById(id, async (err, doc) => {
            if (doc) {
                let team = await Team.findById(doc.team)
                team.players.filter(player => player._id != doc._id)
                team.save()
                return res.status(200).json({
                    status: true,
                    message: "success delete player!",
                    data: await Player.findByIdAndRemove(id).populate('team')
                })
            } else {
                return res.status(200).json({
                    status: false,
                    message: "player not found!",
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