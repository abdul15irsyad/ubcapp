const mongoose = require('mongoose')
const Schema = mongoose.Schema
const mongoosePaginate = require('mongoose-paginate-v2')

const playerSchema = new Schema({
    name: { type: String, required: true },
    number: { type: Number, required: true },
    position: { type: String, required: true },
    team: { type: Schema.Types.ObjectId, required: true, ref: 'Team' }
}, { timestamps: true, versionKey: false })

playerSchema.plugin(mongoosePaginate)

module.exports = mongoose.model("Player", playerSchema)