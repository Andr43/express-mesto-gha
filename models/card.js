const mongoose = require('mongoose');

const { Schema } = mongoose;

const cardSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 30,
    },
    link: {
      type: String,
      required: true,
      validate: {
        validator(v) {
          return /https?:\/\/(w{1,3}\.)?[\w+\-._~:/?#[\]@!$&'()*+,;=]+/.test(v);
        },
        message: (props) => `${props.value} не является ссылкой!`,
      },
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'user',
    },
    likes: [{
      type: Schema.Types.ObjectId,
      ref: 'user',
      default: [],
    }],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false },
);

module.exports = mongoose.model('card', cardSchema);
