const Order = require("../models/Order");
const Logs = require("../models/Logs");
const Truck = require("../models/Truck");
const moment = require("moment");
const {walletUpdater,walletUpdaterApp}=require("../utils/wallet")
const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");
const { addLoc } = require("../utils/request");
const { refresh, refreshTruck,SingleCommerceT } = require("../utils/refresh");
const {
  notification,
  addRefresh,
  pushNotification,
  getAllVarible
} = require("../utils/request");

const fetch = require("node-fetch");
const { pushNotificationStatic } = require("../utils/pushNotif");

exports.orderTruck = asyncHandler(async (req, res, next) => {
  
  const me = await Order.find({ "requster._id": req.user._id });
  console.log('profile>>>>>>>>>>' , req.user)
  if (me.length) {
    console.log("hi");
    const last = me[me.length - 1];
    const alan = moment();
    const createTime = moment(`${last.createdAt}`).format("YYYY/MM/DD HH:mm");
    const returnDate = moment(createTime);

    const now = alan.diff(returnDate, "seconds");
    if (now < 30) {
      return res.status(200).json({
        success: false,
        data: {},
      });
    }
  }
 
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
  } = req.body;

  if (autoPrice) {
    if (maxPrice <= price) {
      return next(new ErrorResponse("The maximum price is not correct", 401));
    }
  }

  const requster = {
    _id: req.user._id,
    username: req.user.username,
    pictureProfile: req.user.pictureProfile,
  };
  console.log(requster)

  if (favoriteOrogin) {
    const org = { ...origin, nameAddress: origin.address };

    await addLoc(org, req.user._id);
  }

  if (favoriteDestination) {
    const des = { ...destination, nameAddress: destination.address };

    await addLoc(des, req.user._id);
  }

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

  const sender = {
    _id: req.user._id,
    username: req.user.username,
    pictureProfile: req.user.pictureProfile,
  };
  const recipient = {
    _id: req.user._id,
    username: req.user.username,
    pictureProfile: req.user.pictureProfile,
  };
  await pushNotification(
    "create order",
    "Order posted successfully",
    "Order posted successfully",
    recipient,
    sender,
    "truckStack",
    "Order"
  );
  await notification(
    "create order",
    recipient,
    sender,
    create._id,
    "Order",
    "Order posted successfully",
    "Order posted successfully"
  );
  await refreshTruck();
  res.status(200).json({
    success: true,
    data: create,
  });
});

// OK
exports.allOrderMe = asyncHandler(async (req, res, next) => {
  const all = await Order.find({
    "requster._id": req.user._id,
  }).sort({ createdAt: -1 });
  // let pending = [];
  // let expired = [];
  // let history = [];

  // all.forEach((elem) => {
  //   if (elem.status === 0) {
  //     pending.push(elem);
  //   }

  //   if (elem.status === 1) {
  //     expired.push(elem);
  //   }

  //   if (elem.status === 2) {
  //     history.push(elem);
  //   }
  // });
    console.log('all orders>>>>>>>>>>>>>>',all[0] , all[1])
  res.status(200).json({
    success: true,
    data: all,
  });
});

exports.toPennding = asyncHandler(async (req, res, next) => {
  const findOrder = await Order.findById(req.params.id);

  await findOrder.updateOne(
    {
      pending: true,
    },

    { new: true }
  );

  res.status(200).json({
    success: true,
    data: {},
  });
});

exports.cancelOrderMe = asyncHandler(async (req, res, next) => {
  const findOrder = await Order.findByIdAndUpdate(req.params.id,{
    cancel:true,
    end:true
  });
  
  const findLog=await Logs.findOneAndUpdate({orderId:req.params.id},{
    cancel:true,
    end:true
  })
  
  await refreshTruck();

  res.status(200).json({
    success: true,
    data: {},
  });
});

exports.cancelDriver = asyncHandler(async (req, res, next) => {
  const order=await Order.findById(req.params.id)
  const log=await Logs.findOne({orderId:req.params.id})

  

  if(order.status>4&&order.requster!=req.user._id){
    return next(new ErrorResponse("Bad request",400))
  }
  if(order.status>6&&order.requster==req.user._id){
    return next(new ErrorResponse("Bad request",400))
  }

  //! cancel Driver
const allV=await getAllVarible()
const bidamount=allV.truckBidAmount*100
if(order.status==5){
  const cancelTransAction=await walletUpdater(1,order.driver._id,bidamount,"Cancel penalty cost","Truck")
  const cancelTransActionApp=await walletUpdaterApp(0,order.driver._id,bidamount,"Cancel penalty cost","Truck")  
if(!cancelTransAction.success){
  return next(new ErrorResponse("Wallet transaction failed",500))
}
if(!cancelTransActionApp.success){
  return next(new ErrorResponse("Wallet transaction failed",500))
}
}


    order.end=true
    order.cancel=true
    log.cancel=true
    log.end=true
    await order.save()
    await order.save()
    
  await pushNotificationStatic(order.requster._id,10)
  await pushNotificationStatic(order.driver._id,10)
  await refreshTruck();
  res.status(200).json({
    success: true,
    data: {},
  });
});

exports.updateOrder = asyncHandler(async (req, res, next) => {
  const findOrder = await Order.findByIdAndUpdate(req.params.id,{
      price: req.params.price, 
  });
  const finfLog=await Logs.findOneAndUpdate({orderId:req.params.id},{
      price: req.params.price,    
  })
  await refreshTruck()
  res.status(200).json({
    success: true,
    data: {},
  });
});

// kasi ke gheymat dade ro ghabol kone ke hammishe yek nafar gheymat dade
exports.acceptDriver = asyncHandler(async (req, res, next) => {
  //
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(new ErrorResponse("order not found", 404));
  }
  const logMe = await Logs.findOne({ orderId: req.params.id });

  let truckId;
  logMe.drivers.forEach((elm) => {
    if (elm.status == "waiting") {
      truckId = elm.driverId;
    }
  });

  // console.log(">>truck", truck);

  if (!logMe) {
    return next(new ErrorResponse("order not found", 404));
  }
  const truck = await Truck.findByIdAndUpdate(truckId, {
    $push: { activeOrders: { order: req.params.id, date: order.date } },
  });

  const objDriver = {
    _id: truck.user._id,
    username: truck.user.username,
    phone: truck.user.phone,
    pictureProfile: truck.user.pictureProfile,
    companyName: truck.companyName,
    truckPlate: truck.truckPlate,
    truckType: truck.truckType,
    transportCapacity: truck.transportCapacity,
  };

  const time = {
    status: 4,
    action: 0,
    at: Date.now(),
  };

  await Logs.findOneAndUpdate(
    {
      orderId: req.params.id,
      "drivers.driverId": truckId,
    },
    {
      $set: {
        "drivers.$.status": "accept",
      },
      $addToSet: { statusTime: time },
      status: 4,
      raisedPrice: logMe.bid,
      driver: objDriver,
    }
  );

  // ! inja status
 const order2= await Order.findByIdAndUpdate(logMe.orderId, {
    $addToSet: { statusTime: time },

    driverCheck: true,
    driver: objDriver,
    status: 4,
    raisedPrice: logMe.bid,
  });

  await SingleCommerceT(order2.requster._id)
  await refreshTruck();

  res.status(200).json({
    success: true,
    data: {},
  });
});

exports.msg = asyncHandler(async (req, res, next) => {
  const { text, image } = req.body;
  let sender;
  let recipient;

  const message = {
    text: text,
    image: image,
    user: req.user._id,
    username: req.user.username,
    phone: req.user.phone,
    pictureProfile: req.user.pictureProfile,
    at: Date.now(),
  };

  const updateOrder = await Order.findByIdAndUpdate(req.params.id, {
    $addToSet: { message },
  });

  if (updateOrder.requster._id === req.user._id) {
    sender = {
      _id: req.user._id,
      username: req.user.username,
      pictureProfile: req.user.pictureProfile,
    };

    recipient = {
      _id: updateOrder.driver._id,
      username: updateOrder.driver.username,
      pictureProfile: updateOrder.driver.pictureProfile,
    };
  } else {
    sender = {
      _id: req.user._id,
      username: req.user.username,
      pictureProfile: req.user.pictureProfile,
    };

    recipient = {
      _id: updateOrder.requster._id,
      username: updateOrder.requster.username,
      pictureProfile: updateOrder.requster.pictureProfile,
    };
  }

  await pushNotification(
    "message",
    `You have message from ${sender.username}`,
    "information",
    recipient,
    sender,
    "truckStack",
    "Order"
  );
  await notification(
    "message",
    sender,
    recipient,
    updateOrder._id,
    "Order",
    "You have message",
    "information"
  );

  await refresh(updateOrder.requster._id, "refreshOrderRequester");
  await refresh(updateOrder.driver._id, "refreshTruck");
  await refreshTruck();

  res.status(200).json({
    success: true,
    data: {},
  });
});

exports.getAllOredr = asyncHandler(async (req, res, next) => {
  console.log(req.user);
  const isAdmin = req.user.group.includes("admin");
  const isSuperAdmin = req.user.group.includes("superAdmin");
  
  console.log(isAdmin || isSuperAdmin);

  if (isAdmin || isSuperAdmin) {
    const allorders = await Order.find();

    return res.status(200).json({
      success: true,
      data: allorders,
    });
  }
  return res
    .status(401)
    .json({ success: false, message: "Not authorized to access this route" });
});

exports.deleteOrder = asyncHandler(async (req, res, next) => {
  const isAdmin = req.user.group.includes("admin");
  const isSuperAdmin = req.user.group.includes("superAdmin");
  if (isAdmin || isSuperAdmin) {
    const findOrder = await Order.findByIdAndRemove(req.params.id);

    return res.status(200).json({
      success: true,
      data: {},
    });
  } else {
    return res.status(401).json({
      success: true,
      err: "you cant acces this route",
    });
  }
});

exports.updatePriceManualy = asyncHandler(async (req, res, next) => {
 const log=await Logs.findOne({orderId:req.params.id})
 const order=await Order.findById(req.params.id)
 const driver=await Truck.findOne({"user._id":req.user._id})
 const newPrice=req.params.price
 if(!log||!order||driver){
  return next(new ErrorResponse("resourse not found",404))
 }

 if(log.status!=0||order.status!=0){
  return next(new ErrorResponse("Bad request"),400)
}

 log.price=newPrice
 
 order.price=newPrice
 
 await log.save()
 await order.save()

 res.status(201).json({success:true,data:order})

});
