// eslint-disable-next-line import/no-extraneous-dependencies, import/newline-after-import
const mongoose = require('mongoose');
const { Schema } = mongoose;

const cardSchema = new Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  link: {
    type: String,
    required: true,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  likes: [{
    type: [Schema.Types.ObjectId],
    ref: 'user',
    default: [],
  }],
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
},
{ versionKey: false },
);

module.exports = mongoose.model('card', cardSchema);
