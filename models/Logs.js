const { Number } = require("mongoose");
const mongoose = require("mongoose");

const LogsSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.ObjectId,
    },

    truckType: {
      type: Number,
    },

    truckCapacity: {
      type: Number,
    },

    volume: {
      type: Number,
    },

    productName: {
      type: String,
    },

    origin: {
      address: { type: String },
      nameAddress: { type: String },
      latitude: { type: Number },
      longitude: { type: Number },
      target: { type: Number },
      city: { type: String },
      province: { type: String },
      district: { type: String },
      street: { type: String },
      country: { type: String },
      streetNumber: { type: String },
    },

    addressOrigin: {
      type: String,
    },

    phoneNumberSender: {
      type: String,
    },

    lineMakerOrigin: { type: Boolean, default: false },
    // addToFavorite: { type: Boolean, default: false },

    destination: {
      address: { type: String },
      nameAddress: { type: String },
      latitude: { type: Number },
      longitude: { type: Number },
      target: { type: Number },
      city: { type: String },
      province: { type: String },
      district: { type: String },
      street: { type: String },
      country: { type: String },
      streetNumber: { type: String },
    },

    addressDestination: {
      type: String,
    },

    lineMakerDestination: { type: Boolean, default: false },
    // addToFavorite: { type: Boolean, default: false },

    phoneNumberReceiver: {
      type: String,
    },

    distance: {
      type: Number,
    },

    date: {
      day: { type: Number },
      month: { type: Number },
      year: { type: Number },
    },

    // Closing Date
    // min or sicond
    closingDate: {
      type: Number,
    },

    // gheymat avaz shode
    raisedPrice: { type: Number, default: 0 },

    maxPrice: { type: Number },

    autoPrice: { type: Boolean, default: false },

    price: { type: Number },

    note: { type: String },

    pending: {
      type: Boolean,
      default: true,
    },

    // 0 == Init
    // 1 == pishnahad shode
    // 2 == raise one
    // 3 == raise two
    // 4 == Booked
    // 5 == Picked Up
    // 6 == Deliverd
    status: {
      type: Number,
    },

    end: {
      type: Boolean,
      default: false,
    },

    message: [
      {
        text: String,
        image: String,
        user: mongoose.Schema.ObjectId,
        username: String,
        phone: String,
        pictureProfile: String,
        at: String,
        _id: false,
      },
    ],

    statusTime: [
      {
        action: Number,
        text: String,
        image: String,
        user: mongoose.Schema.ObjectId,
        username: String,
        phone: String,
        pictureProfile: String,
        status: Number,
        at: String,
        _id: false,
      },
    ],

    cancel: {
      type: Boolean,
      default: false,
    },

    requster: {
      _id: { type: mongoose.Schema.ObjectId },
      username: { type: String },
      pictureProfile: { type: String },
    },
    driverCheck: { type: Boolean, default: false },

    driver: {
      _id: { type: mongoose.Schema.ObjectId },
      username: { type: String },
      phone: { type: String },
      pictureProfile: { type: String },
      companyName: { type: String },
      truckPlate: { type: String },
      truckType: { type: Number },
      transportCapacity: { type: Number },
    },

    drivers: [
      {
        driverId: mongoose.Schema.ObjectId,
        userId: mongoose.Schema.ObjectId,
        status: String,
        paymnetInvoiceNumber:String,
        bid:Number,
        at: Date,
        _id: false,
      },
    ],

    // gheymati ke driver mige
    bid: { type: Number, default: 0 },

    userFavorites: [{ userId: mongoose.Schema.ObjectId, _id: false,default:[] }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Logs", LogsSchema);
