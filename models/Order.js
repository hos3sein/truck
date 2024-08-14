const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
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

    cancel: {
      type: Boolean,
      default: false,
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

    phoneNumberReceiver: {
      type: String,
    },

    distance: {
      type: Number,
    },

    // pick up
    date: {
      day: { type: Number },
      month: { type: Number },
      year: { type: Number },
    },

    // Closing Date
    closingDate: {
      type: Number,
    },

    price: { type: Number },

    // gheymat avaz shode
    raisedPrice: { type: Number },

    maxPrice: { type: Number },

    autoPrice: { type: Boolean, default: false },

    note: { type: String },

    // ! in baraye khodame baraye resubmit kardan
    pending: {
      type: Boolean,
      default: true,
    },

    
    // 0 == Init
    // 1 == pishnahad shode
    // 2 == raise one
    // 3 == raise two
    // 5<status<8 == Booked
    // 7<status<10 == Picked Up
    // 10 == Deliverd
    
    


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

    requster: {
      _id: { type: mongoose.Schema.ObjectId },
      username: { type: String },
      pictureProfile: { type: String },
    },

    // gheymati ke driver mige
    bid: { type: Number, default: 0 },

    // agar in false bashe yani driveri kasi ghabol nakarde
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
    userFavorites: [{ userId: mongoose.Schema.ObjectId, _id: false,default:[] }],

    requsterPaymentInvoiceNumber:String,

    driverPaymentInvoiceNumber:String,
    
    canceler : {
      admin : {type : String},
      number : {type : String},
      cause : {type : String}
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);
