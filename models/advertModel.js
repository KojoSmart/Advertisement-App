const mongoose = require("mongoose");

const advertSchema = new mongoose.Schema({

  title: String,
  description: String,
  price: Number,
  category: String,
  image: {
    public_id: String,
    url: String
  },
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }

}, {timestamps: true})

module.exports = mongoose.model("Advert", advertSchema);
