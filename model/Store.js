const mongoose = require("mongoose");

const StoreSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
    maxLength: 100,
  },
  iwantthis: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  happy: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  created_at: {
    type: Date,
    default: Date.now,
  },
  verficationCode: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "VerficationStore",
    },
  ],
  color: [
    {
      type: {
        type: String,
        defaut: null,
      },
      photo: {
        photoarray: {
          type: [
            {
              type: String,
              required: true,
            },
          ],
          validate: [arrayLimit, "max size is 3"],
        },
        size: [
          {
            type: String,
            required: true,
          },
        ],
      },
    },
  ],
});

function arrayLimit(val) {
  return val.length <= 3;
}
module.exports = mongoose.model("Store", StoreSchema);
