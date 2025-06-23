const { required } = require("joi");
const mongoose = require("mongoose");

const advertSchema = new mongoose.Schema({

  title: {
    type:String,
    required:true
  },
  description: String,
  price:{
    type: Number,
    required: true
  },
  category:{
 type: String,
  required: true
  },
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
