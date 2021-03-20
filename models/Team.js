const mongoose = require('mongoose')
const Schema = mongoose.Schema
const mongoosePaginate = require('mongoose-paginate-v2')

const teamSchema = new Schema({
    name: { type: String, required: true },
    logo: { type: String, required: false },
    players: [{ type: Schema.Types.ObjectId, ref: 'Player' }]
}, { timestamps: true, versionKey: false })

teamSchema.plugin(mongoosePaginate)

module.exports = mongoose.model("Team", teamSchema)