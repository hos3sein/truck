const mongoose = require("mongoose");

const TruckSchema = new mongoose.Schema(
  {
    user: {
      _id: { type: mongoose.Schema.ObjectId },
      username: { type: String },
      pictureProfile: { type: String },
      phone: { type: String },
    },

    group: {
      type: String,
    },

    companyName: {
      type: String,
    },

    companyLicensePhoto: {
      type: String,
    },

    companyAddress: [
      {
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
        _id: false,
      },
    ],

    idCardName: {
      type: String,
    },

    idCard: {
      type: String,
    },

    idCardPhoto: {
      type: String,
    },

    idCardBack: {
      type: String,
    },

    truckType: {
      type: Number,
    },

    truckPlate: {
      type: String,
    },

    truckPlatePhoto: {
      type: String,
    },

    transportCapacity: {
      type: Number,
      max: 32,
    },

    transportQuntity: {
      type: Number,
      max: 32,
    },

    licenseFront: {
      type: String,
    },

    licenseBack: {
      type: String,
    },

    qualificationFront: {
      type: String,
    },

    qualificationBack: {
      type: String,
    },

    driverCertificateFront: {
      type: String,
    },

    driverCertificateBack: {
      type: String,
    },

    roadTransportLicense: {
      type: String,
    },

    roadTransportLicenseFront: {
      type: String,
    },

    registrationData: {
      type: String,
    },

    bankingDetails: {
      accountNumber: { type: Number },
      phone: { type: String },
      homeAddress: {
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
    },

    profileCompany: {
      type: String,
    },

    deposit: {
      type: Boolean,
      default: false,
    },

    depositAmount: {
      type: Number,
    },

    orderRadius: {
      type: Number,
    },

    transportIncome: {
      type: Number,
    },

    active: {
      type: Boolean,
      default: true,
    },
    // orders : [{
    //   order:mongoose.Schema.ObjectId,
    //   start :String,
    //   end : String
    //    }]

   activeOrders:[{
      order:mongoose.Schema.ObjectId,
      date :{
        day: { type: Number },
        month: { type: Number },
        year: { type: Number },
        _id:false
      },
    }],
    default:[],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Truck", TruckSchema);
