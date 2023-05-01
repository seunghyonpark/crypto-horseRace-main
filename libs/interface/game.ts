import mongoose from "mongoose";

export interface IGame {
  _id: mongoose.Types.ObjectId;
  userToken: string;
  username: string;
  img: string;
  referral: string;
  betAmount: number;
  selectedSide: string;
  basePrice: number;
}
