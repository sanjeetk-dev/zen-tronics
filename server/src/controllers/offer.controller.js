import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Coupon } from "../models/coupon.model.js";
import { Offer } from "../models/offer.model.js";
import { uploadOnCloudinary, deleteFromCloudinary } from '../utils/cloudinary.js'



const uploadImagesToCloudinary = async (imageFiles) => {
  return await Promise.all(
    imageFiles.map(async (file) => {
      const uploadResult = await uploadOnCloudinary(file.path);
      return { url: uploadResult.secure_url, public_id: uploadResult.public_id };
    })
  );
};

const createOffer = asyncHandler(async (req, res) => {
  const { title, description, startDate, endDate, coupons } = req.body;

  if (!title || !description || !startDate || !endDate) {
    throw new ApiError(400, "All fields (title, description, startDate, endDate) are required.");
  }

  if (new Date(startDate) >= new Date(endDate)) {
    throw new ApiError(400, "Start date must be before end date.");
  }

  // **Handle Coupon Creation in Parallel**
  let createdCoupons = [];
  if (coupons && Array.isArray(coupons) && coupons.length > 0) {
    createdCoupons = await Promise.all(
      coupons.map(async (couponData) => {
        const { code, discount, maxLimit, minOrderAmount, expiry, applicableCategories } = couponData;

        const newCoupon = await Coupon.create({
          code,
          discount,
          maxLimit,
          minOrderAmount,
          expiry,
          applicableCategories: applicableCategories || [],
        });

        return newCoupon._id; // Store only the coupon ID
      })
    );
  }

  let uploadedImages = [];
  if (req.files && Array.isArray(req.files) && req.files.length > 0) {
    uploadedImages = await uploadImagesToCloudinary(req.files);
  }


  // **Create the Offer**
  const newOffer = await Offer.create({
    title,
    description,
    startDate,
    endDate,
    couponCodes: createdCoupons, // Array of coupon IDs
    images: uploadedImages,
  });

  res.status(201).json(new ApiResponse(201, newOffer, "Offer created successfully with coupons and images."));
});


const updateOffer = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, description, startDate, endDate, couponCodes } = req.body;

  let offer = await Offer.findById(id);
  if (!offer) {
    throw new ApiError(404, "Offer not found.");
  }

  if (startDate && endDate && new Date(startDate) >= new Date(endDate)) {
    throw new ApiError(400, "Start date must be before end date.");
  }

  // **Validate and Update Coupons**
  let updatedCouponCodes = offer.couponCodes; // Default to existing
  if (couponCodes && Array.isArray(couponCodes) && couponCodes.length > 0) {
    const validCoupons = await Coupon.find({ _id: { $in: couponCodes } }).select("_id");
    if (validCoupons.length !== couponCodes.length) {
      throw new ApiError(400, "Some provided coupons are invalid.");
    }
    updatedCouponCodes = validCoupons.map((c) => c._id);
  }

  // **Handle Image Uploads**
  let uploadedImages = offer.images; // Keep old images by default
  if (req.files && req.files.length > 0) {
    uploadedImages = await uploadImagesToCloudinary(req.files);

    // **Delete Old Images from Cloudinary**
    if (offer.images && offer.images.length > 0) {
      await Promise.all(
        offer.images.map(async (img) => {
          await deleteFromCloudinary(img.public_id); // Implement deleteFromCloudinary function
        })
      );
    }
  }

  // **Efficient Update with `findByIdAndUpdate`**
  offer = await Offer.findByIdAndUpdate(
    id,
    {
      $set: {
        title: title || offer.title,
        description: description || offer.description,
        startDate: startDate || offer.startDate,
        endDate: endDate || offer.endDate,
        couponCodes: updatedCouponCodes,
        images: uploadedImages,
      },
    },
    { new: true }
  );

  res.status(200).json(new ApiResponse(200, offer, "Offer updated successfully."));
});


const deleteOffer = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const offer = await Offer.findByIdAndDelete(id);
  if (!offer) {
    throw new ApiError(404, "Offer not found.");
  }

  res.status(200).json(new ApiResponse(200, null, "Offer deleted successfully."));
});

const getOffers = asyncHandler(async (req, res) => {
  const { askedBy } = req.query;

  let filter = { endDate: { $gte: new Date() } }; // Default: Active offers only

  if (askedBy === "admin") {
    filter = { endDate: { $gte: new Date() } };
  }

  const offers = await Offer.find(filter).sort({ endDate: 1 });

  if (askedBy === "user") {
    // User gets only the closest active offer
    return res.status(200).json(new ApiResponse(200, offers[0] || null, "Closest active offer retrieved."));
  }

  // Admin gets all offers
  res.status(200).json(new ApiResponse(200, offers, "All offers retrieved successfully."));
});



export {
  createOffer,
  updateOffer,
  deleteOffer,
  getOffers
}