const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");
const fetch = require("node-fetch");
const Truck = require("../models/Truck");
const Logs = require("../models/Logs");
const { notification, addRefresh  } = require("../utils/request");
const {pushNotificationStatic}=require("../utils/pushNotif")
const { refresh, refreshTruck } = require("../utils/refresh");
const Order = require("../models/Order");
const Group = require("../models/Group");

exports.createPerm = asyncHandler(async (req, res, next) => {
  const { data } = req.body;
  try {
    const urll = `${process.env.SERVICE_SETTING}/api/v1/setting/dev/createperm`;
    const rawResponse = await fetch(urll, {
      method: "POST",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const response = await rawResponse.json();

    if (response.success) {
      res.status(200).json({
        success: true,
        data: {},
      });
    }
  } catch (err) {
    console.log("err", err);
  }
});

exports.delAll = asyncHandler(async (req, res, next) => {
 
  await Order.remove();
  await Logs.remove();

  // await Group.remove();

  res.status(200).json({
    success: true,
    dta: {},
  });
});

exports.dell = asyncHandler(async (req, res, next) => {
  await Order.findByIdAndRemove(req.params.id);

  await Logs.findOneAndRemove({ orderId: req.params.id });

  // await Group.remove();

  res.status(200).json({
    success: true,
    dta: {},
  });
});

exports.allTruck = asyncHandler(async (req, res, next) => {
 
  const log=await Logs.findOne({orderId:req.params.id})
  
  res.status(200).json({
    success: true,
    dsta:log,
  });
});

exports.up = asyncHandler(async (req, res, next) => {
  const {
    status,
    end,
    message,
    statusTime,
    drivers,
    driver,
    driverCheck,
    closingDate,
  } = req.body;
  await Logs.findOneAndUpdate(
    { orderId: req.params.id },

    {
      status,
      end,
      message,
      statusTime,
      drivers,
      driver,
      driverCheck,
      closingDate,
    },
    { new: true, strict: false }
  );

  await Order.findByIdAndUpdate(
    req.params.id,
    {
      status,
      end,
      message,
      statusTime,
      closingDate,
      driver,
      driverCheck,
    },
    { new: true, strict: false }
  );

  res.status(200).json({
    success: true,
    dta: {},
  });
});

exports.create = asyncHandler(async (req, res, next) => {
  const {
    truckType,
    truckCapacity,
    productName,
    origin,
    addressOrigin,
    phoneNumberSender,
    lineMakerOrigin,
    destination,
    addressDestination,
    lineMakerDestination,
    phoneNumberReceiver,
    distance,
    price,
    date,
    note,
    favoriteOrogin,
    favoriteDestination,
    closingDate,
    maxPrice,
    autoPrice,
    volume,
    requster,
  } = req.body;

  const create = await Order.create({
    requster,
    truckType,
    truckCapacity,
    productName,
    origin,
    addressOrigin,
    phoneNumberSender,
    lineMakerOrigin,
    destination,
    addressDestination,
    lineMakerDestination,
    phoneNumberReceiver,
    distance,
    price,
    date,
    note,
    closingDate,
    maxPrice,
    autoPrice,
    volume,
    raisedPrice: price,
    status: 0,
  });

  const objOrder = {
    orderId: create._id,
    requster: requster,
    truckType: truckType,
    truckCapacity: truckCapacity,
    productName: productName,
    origin: origin,
    addressOrigin: addressOrigin,
    phoneNumberSender: phoneNumberSender,
    lineMakerOrigin: lineMakerOrigin,
    destination: destination,
    addressDestination: addressDestination,
    lineMakerDestination: lineMakerDestination,
    phoneNumberReceiver: phoneNumberReceiver,
    distance: distance,
    price: price,
    date: date,
    note: note,
    closingDate: closingDate,
    volume: volume,

    maxPrice: maxPrice,
    autoPrice: autoPrice,
    raisedPrice: price,
    status: 0,
  };

  const createLog = await Logs.create(objOrder);

  res.status(200).json({
    success: true,
    dta: {},
  });
});

exports.create = asyncHandler(async (req, res, next) => {
  const {} = req.body;

  const create = await Truck.create({});

  res.status(200).json({
    success: true,
    dta: {},
  });
});



exports.cancel = asyncHandler(async (req, res, next) => {
  const isAdmin = req.user.group.includes("admin");
  const isSuperAdmin = req.user.group.includes("superAdmin");
  const oredrId = req.params.id;
  console.log('admin>>>>>',req.user)
  if (isAdmin || isSuperAdmin) {
    const log = await Logs.findOneAndUpdate(
      { orderId: req.params.id },
      { cancel: true }
    );
    console.log('0000')
    const admin =  {
      admin : req.user.username,
      number : req.user.phone,
      cause : req.body.cause
    }
    console.log('11111')
    const remove = await Order.findByIdAndUpdate(req.params.id, {
      cancel: true,
      canceler : admin
    });
    console.log('2222')
    const ordered = await Order.findById(req.params.id)
    console.log('3333')
    console.log('order>>>>>>>',ordered)
    await pushNotificationStatic( ordered.requster._id , 15 )
    console.log('5555')
    if (ordered.status != 0){
      await pushNotificationStatic(ordered.driver._id , 15 )
    }
    console.log('6666')
    await addRefresh(req.user._id, "refreshOrderRequester");

    console.log('7777')
    await refresh(req.user._id, "refreshOrderRequester");
    console.log('8888')
    await refreshTruck();

    res.status(200).json({
      success: true,
      data: {},
    });
  }
});



exports.addplate = asyncHandler(async (req, res, next) => {
  const {truckPlate,truckPlatePhoto}=req.body
   await Truck.findOneAndDelete({"user._id":req.user._id},{
    truckPlate,
    truckPlatePhoto
   })
   res.status(200).json({success:true})
});


exports.test = asyncHandler(async (req, res, next) => {
  const  old_time = new Date();

  const new_time = new Date();

  const seconds_passed = new_time - old_time;
   
   res.status(200).json({success:true,data:seconds_passed})
});

exports.removeActiveOrder = asyncHandler(async (req, res, next) => {
  
 const driver=await Truck.findOne({"user._id":req.user._id})

 const newActiveOrders=driver.activeOrders.filter(item=>item.order!=req.params.id)
 
 driver.activeOrders=newActiveOrders

  await driver.save()
   
   res.status(200).json({success:true,data:driver})
});