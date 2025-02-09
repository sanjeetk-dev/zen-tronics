import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import {ApiError} from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import { Address } from '../models/address.model.js'


const addAddress = asyncHandler(async (req, res) => {
  const { fullName, phoneNumber, alternatePhoneNumber, streetAddress, city, state, postalCode, country, addressType, isDefault } = req.body;

  const a = isDefault === 'true';

  if (!fullName || !phoneNumber || !streetAddress || !city || !state || !postalCode || !addressType) {
    throw new ApiError(400, "All required fields must be provided");
  }

  const userId = req.user._id;

  if (isDefault) {
    await Address.updateMany({ userId }, { isDefault: false });
  }

  const newAddress = await Address.create({
    userId,
    fullName,
    phoneNumber,
    alternatePhoneNumber,
    streetAddress,
    city,
    state,
    postalCode,
    country,
    addressType,
    isDefault: a,
  });

  res.status(201).json(new ApiResponse(201, newAddress, "Address added successfully"));
});

const getUserAddresses = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const addresses = await Address.find({ userId }).sort({ isDefault: -1, createdAt: -1 });

  res.status(200).json(new ApiResponse(200, addresses || [], "Fetched user addresses"));
});

const getAddressById = asyncHandler(async (req, res) => {
  const { addressId } = req.params;
  const address = await Address.findById(addressId);

  if (!address) throw new ApiError(404, "Address not found");

  res.status(200).json(new ApiResponse(200, address, "Address details fetched"));
});

const updateAddress = asyncHandler(async (req, res) => {
  const { addressId } = req.params;
  const updates = req.body;
  const userId = req.user._id;

  // If updating isDefault to true, reset all other addresses
  if (updates.isDefault) {
    await Address.updateMany({ userId }, { isDefault: false });
  }

  const address = await Address.findByIdAndUpdate(addressId, updates, { new: true });

  res.status(200).json(new ApiResponse(200, address, "Address updated successfully"));
});

const deleteAddress = asyncHandler(async (req, res) => {
  const { addressId } = req.params;
  const userId = req.user._id;

  const address = await Address.findOneAndDelete({ _id: addressId, userId });
  if (!address) throw new ApiError(404, "Address not found");

  res.status(200).json(new ApiResponse(200, {}, "Address deleted successfully"));
});


export { 
  addAddress, 
  getUserAddresses, 
  getAddressById, 
  updateAddress, 
  deleteAddress 
};