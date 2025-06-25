const Advert = require("../models/advertModel");
require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/userModel");

// const cloudinary = require("cloudinary").v2;
const cloudinary = require("../config/cloudinaryConfig");
const fs = require("fs/promises");
// const path = require("path");
const advertValidation = require("../utils/advertValidate");


// creating adverts
const createAdvert = async (req, res) => {
  try {
    const { title, description, category, price } = req.body;


    const { error, value } = advertValidation.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: error.details[0].message,
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image file uploaded",
      });
    }

    const result = await cloudinary.uploader.upload(req.file.path);
    await fs.unlink(req.file.path);
    console.log(req.file);
    // console.log(result); // delete from disk

    const advert = await Advert.create({
      title: value.title,
      description: value.description,
      price: value.price,
      category: value.category,
      image: {
        public_id: result.public_id,
        url: result.secure_url,
      },
      vendor: req.user.id,
    });
    await advert.save();
    // console.log(advert.image)
    // console.log(advert.vendor)

    res.status(201).json({ success: true, advert });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
    console.log(err.message);
  }
};

// Getting all adverts
const getAllAdverts = async (req, res) => {
  try {
    const allAdverts = await Advert.find({});

    if (!allAdverts || allAdverts.length === 0) {
      return res.status(404).json({
        success: false,
        items: [],
        message: "No adverts found",
      });
    }

    return res.status(200).json({
      success: true,
      items: allAdverts,
      message: "Adverts retrieved successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
      message: "Failed to retrieve adverts. An expected error occured",
    });
  }
};

// Get one advert

const oneAdvert = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid advert ID fromat",
      });
    }

    const singleAdvert = await Advert.findById(id);
    if (singleAdvert.vendor.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to see this advert.",
      });
    }
    if (!singleAdvert) {
      return res.status(404).json({
        success: false,
        message: "Advert not found",
      });
    }
    return res.status(200).json({
      sucess: true,
      item: singleAdvert,
      message: "Advert retrieved successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to retrive book. An unexpected error occurred.",
      error: error.message,
    });
  }
};

const userOnlyViewAdvertById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid advert ID fromat",
      });
    }
    console.log("userOnlyViewAdvert called");

    const singleAdvert = await Advert.findById(id);

    if (!singleAdvert) {
      return res.status(404).json({
        success: false,
        message: "Advert not found",
      });
    }
    return res.status(200).json({
      success: true,
      item: singleAdvert,
      message: "Advert retrieved successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to retrive book. An unexpected error occurred.",
      error: error.message,
    });
  }
};

// const searchAdvert = async (req, res) => {
//   try {
//     const { title, price, category } = req.query;
//     let searchByDetail = {};

//     // Search by title (case-insensitive)
//     if (title?.trim()) {
//       searchByDetail.title = { $regex: title.trim(), $options: "i" };
//     }

//     // Search by category (case-insensitive)
//     if (category?.trim()) {
//       searchByDetail.category = { $regex: category.trim(), $options: "i" };
//     }

//     // Search by price (exact match, parsed to float)
//     if (price?.trim()) {
//       const parsedPrice = parseFloat(price);
//       if (!isNaN(parsedPrice)) {
//         searchByDetail.price = parsedPrice;
//       }
//     }

//     const theResult = await Advert.find(searchByDetail);

//     if (!theResult || theResult.length === 0) {
//       return res.status(404).json({
//         success: false,
//         items: [],
//         message: "No adverts found",
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       items: theResult,
//       message: "Adverts retrieved successfully",
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       error: error.message,
//       message: "Failed to retrieve adverts. An unexpected error occurred",
//     });
//   }
// };


// searching for adverts using title, price, category
const searchAdvert = async (req, res) => {
  try {
    const { title, price, category } = req.query;
    let searchByDetail = {};
    // Searching by title
    if (title !== undefined) {
      searchByDetail.title = { $regex: title, $options: "i" };
    }
    // searching by category
    if (category !== undefined) {
      searchByDetail.category = { $regex: category, $options: "i" };
    }
    // searching by price
    if (price !== undefined) {
      searchByDetail.price = parseFloat(price);
    }

    const theResult = await Advert.find(searchByDetail);

    if (!theResult) {
      return res.status(404).json({
        success: false,
        items: null,
        message: "No adverts found",
      });
    }
    return res.status(200).json({
      success: true,
      items: theResult,
      message: "Adverts retrieved successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
      message: "Failed to retrieve adverts. An unexpected error occured",
    });
  }
};

// const updateAdvert = async (req, res) => {
//   try {
//     const id = req.params.id;
//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid advert ID format",
//       });
//     }

//     // Validate the incoming data
//     const { error, value } = advertValidation.validate(req.body);
//     if (error) {
//       return res.status(400).json({
//         success: false,
//         message: error.details[0].message,
//         data: null,
//         error,
//       });
//     }

//     // Find the advert first
//     const advert = await Advert.findById(id);
//     if (!advert) {
//       return res.status(404).json({
//         success: false,
//         message: "Advert not found",
//       });
//     }

//     // Perform update
//     const updatedAdvert = await Advert.findByIdAndUpdate(
//       id,
//       { $set: value },
//       { new: true, runValidators: true }
//     );

//     return res.status(200).json({
//       success: true,
//       item: updatedAdvert,
//       message: "Advert updated successfully",
//     });

//   } catch (error) {
//     console.error("Update Error:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Server Error. Please try again later.",
//       error: error.message,
//     });
//   }
// };
const deleteAdvert = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid advert ID format",
      });
    }

    const advert = await Advert.findById(id);
    // checkig to make sure  that only the vendor who owns it can update it
    // if (advert.vendor.toString() !== req.user.id) {
    //   return res.status(403).json({
    //     success: false,
    //     message: "You are not allowed to update  this advert.",
    //   });
    // }
    const delAdvert = await Advert.findByIdAndDelete(id);

    if (!delAdvert) {
      return res.status(404).json({
        success: false,
        message: "Advert not found",
      });
    }
    // Delete image from Cloudinary
    await cloudinary.uploader.destroy(delAdvert.image.public_id);
    return res.status(200).json({
      success: true,
      message: "Advert deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete an advert. An unexpected error occurred",
    });
  }
};
// original one
//  const updateAdvert = async (req, res) => {
//   try {
//     const id = req.params.id;
//     const { title, description, price, image, category } = req.body;

//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid advert ID format",
//       });
//     }

//     const { error, value } = advertValidation.validate(req.body);
//     if (error) {
//       return res.status(400).json({
//         success: false,
//         message: error.details[0].message,
//       });
//     }

//     const advert = await Advert.findById(id);
//     if (!advert) {
//       return res.status(404).json({
//         success: false,
//         message: "Advert not found",
//       });
//     }

//     if (advert.vendor.toString() !== req.user.id) {
//       return res.status(403).json({
//         success: false,
//         message: "You are not allowed to update this advert.",
//       });
//     }
//     if (req.file) {
//       // deleting old image
//       if (advert.image && advert.image.public_id) {
//         await cloudinary.uploader.destroy(advert.image.public_id);
//       }

//       // Uploading  new image to Cloudinary
//       const result = await cloudinary.uploader.upload(req.file.path);
//       await fs.unlink(req.file.path); // delete from disk

//       // Update image field in value
//       value.image = {
//         public_id: result.public_id,
//         url: result.secure_url,
//       };
//     }

//     const updatedAdvert = await Advert.findByIdAndUpdate(id, value, {
//       new: true,
//       runValidators: true,
//     });

//     return res.status(200).json({
//       success: true,
//       item: updatedAdvert,
//       message: "Advert updated successfully",
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       error: error.message,

//       message: "Failed to update advert. An unexpected error occurred.",
//     });
//   }
// };

const updateAdvert = async (req, res) => {
  const { title, description, category, price } = req.body;

  try {
    const id = req.params.id;

    // Check if advert ID is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid advert ID format",
      });
    }

    // Find existing advert
    const advert = await Advert.findById(id);
    if (!advert) {
      return res.status(404).json({
        success: false,
        message: "Advert not found",
      });
    }

    // Check permission
    if (advert.vendor.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to update this advert.",
      });
    }

    // Validate input excluding image, which comes from req.file
    const { error, value } = advertValidation.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        error: error.details.map((err) => err.message),
      });
    }

    // Handle image if one is uploaded
    if (req.file) {
      if (advert.image && advert.image.public_id) {
        await cloudinary.uploader.destroy(advert.image.public_id);
      }

      const result = await cloudinary.uploader.upload(req.file.path);
      await fs.unlink(req.file.path); // Clean up temp file

      value.image = {
        public_id: result.public_id,
        url: result.secure_url,
      };
    }
    const updatedAdvert = await Advert.findByIdAndUpdate(id, value, {
      new: true,
      runValidators: true,
    });
    await updatedAdvert.save();
    // Update only the provided fields
    // advert.title = value.title !== undefined ? value.title : advert.title;
    // advert.description = value.description !== undefined ? value.description : advert.description;
    // advert.category = value.category !== undefined ? value.category : advert.category;
    // advert.price = value.price !== undefined ? value.price : advert.price;
    // if (value.image) advert.image = value.image;

    // // Save the updated advert
    // const updatedAdvert = await advert.save();

    return res.status(200).json({
      success: true,
      message: "Advert updated successfully",
      item: updatedAdvert,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update advert. An unexpected error occurred.",
      error: error.message,
    });
  }
};

// Getting all advertsbyVendor
const getAllAdvertsByVendor = async (req, res) => {
  try {
    // const allAdverts = await Advert.find();
    // Get only the adverts belonging to the logged-in vendor
    const allAdverts = await Advert.find({ vendor: req.user.id });
    if (!allAdverts || allAdverts.length === 0) {
      return res.status(404).json({
        success: false,
        items: [],
        message: "No adverts found",
      });
    }
    return res.status(200).json({
      success: true,
      items: allAdverts,
      message: "Adverts retrieved successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
      message: "Failed to retrieve adverts. An expected error occured",
    });
  }
};
module.exports = {
  createAdvert,
  searchAdvert,
  getAllAdverts,
  deleteAdvert,
  updateAdvert,
  oneAdvert,
  userOnlyViewAdvertById,
  getAllAdvertsByVendor,
};
