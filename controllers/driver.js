const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");
const Order = require("../models/Order");
const Truck = require("../models/Truck");
const Logs = require("../models/Logs");
const {walletUpdater,walletUpdaterApp}=require("../utils/wallet")
const {pushNotificationStatic}=require("../utils/pushNotif")
const { notification, addRefresh,pushNotification,getAllVarible } = require("../utils/request");
const { refresh, refreshTruck ,SingleCommerceT} = require("../utils/refresh");
const moment = require("moment");

exports.orderForMe = asyncHandler(async (req, res, next) => {
  const truck = await Truck.findOne({ "user._id": req.user._id })
  const logsMe = await Logs.find({

    $and: [
      { drivers: { $elemMatch: { driverId: truck._id } } },
      {
        drivers: { $elemMatch: { status: "waiting" } },
      },
      { end: false },
    ],
  }).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    data: logsMe,
  });
});

exports.order = asyncHandler(async (req, res, next) => {
  const istruck = req.user.group.includes("truck")
  console.log("istruck",istruck);
  if(!istruck){
    return next(new ErrorResponse("User must be truck", 400)); 
  }
  const truck = await Truck.findOne({ "user._id": req.user._id}) 
  console.log("type",truck.truckType,"capacity",truck.transportCapacity);
  const logsMe = await Logs.find({
      $and: [
        {
          $or: [{ status: 0 }, { status: 1 }, { status: 2 }, { status: 3 }],
        },
        { 
           truckType:truck.truckType,
        },
        // {
        //   truckCapacity:{$lt:truck.transportCapacity}
        // },
        { "requster._id": { $ne: req.user._id } },                       
        { end: false },
        { cancel: false },
      ],
    }).sort({ createdAt: -1 });
  
   
    console.log("logs",logsMe);

    res.status(200).json({
    success: true,
    data: logsMe,
  });

});

exports.rejectOrder = asyncHandler(async (req, res, next) => {
  const truck = await Truck.findOne({ "user._id": req.user._id });

  const logMe = await Logs.findById(req.params.id);

  // console.log(logMe);

  if (!logMe) {
    return next(new ErrorResponse("order not found", 404));
  }

  await Logs.findOneAndUpdate(
    {
      _id: req.params.id,
      "drivers.driverId": truck._id,
    },
    {
      $set: {
        "drivers.$.status": "reject",
      },
    }
  );

  res.status(200).json({
    success: true,
    data: {},
  });
});

exports.acceptOrder = asyncHandler(async (req, res, next) => {
  const truck = await Truck.findOne({ "user._id": req.user._id });
  const logMe = await Logs.findById(req.params.id);

  if (!logMe) {
    return next(new ErrorResponse("order not found", 404));
  }

  const objDriver = {
    _id: req.user._id,
    username: req.user.username,
    phone: req.user.phone,
    pictureProfile: req.user.pictureProfile,
    companyName: truck.companyName,
    truckPlate: truck.truckPlate,
    truckType: truck.truckType,
    transportCapacity: truck.transportCapacity,
  };

  await Logs.findOneAndUpdate(
    {
      _id: req.params.id,
      "drivers.driverId": truck._id,
    },
    {
      $set: {
        "drivers.$.status": "accept",
      },

      driver: objDriver,
    }
  );

  // ! inja status
  await Order.findByIdAndUpdate(logMe.orderId, {
    driverCheck: true,
    driver: objDriver,
    status: 4,
  });

  const sender = {
    _id: req.user._id,
    username: req.user.username,
    pictureProfile: req.user.pictureProfile,
  };

  const recipient = {
    _id: logMe.requster._id,
    username: logMe.requster.username,
    pictureProfile: logMe.requster.pictureProfile,
  };

  await pushNotificationStatic(recipient._id,2)
 
  // await pushNotification(
  //   "accept order",
  //   "accept this order",
  //   "this order accept from driver",
  //   recipient,
  //   sender,
  //   "truckStack",
  //   "Truck"
  // )
  // await notification(
  //   "accept order",
  //   recipient,
  //   sender,
  //   logMe.orderId,
  //   "Truck",
  //   "accept this order",
  //   "this order accept from driver "
  // );
  await refresh(logMe.requster._id, "refreshOrderRequester");
  await refresh(req.user._id, "refreshTruck");
  await refresh(logMe.user._id, "refreshTruck");

  res.status(200).json({
    success: true,
    data: {},
  });
});

exports.allOrder = asyncHandler(async (req, res, next) => {
  const all = await Order.find({ "driver._id": req.user._id }).sort({
    createdAt: -1,
  });

  const wait = await Logs.find({
    $and: [
      { drivers: { $elemMatch: { status: "waiting" } } },
      { drivers: { $elemMatch: { userId: req.user._id } } },

      {
        status: { $lt: 4 },
      },
    ],
  });

  const accept = await Logs.find({
    $and: [
      { drivers: { $elemMatch: { status: "accept" } } },
      { drivers: { $elemMatch: { userId: req.user._id } } },
      { "driver._id": req.user._id },

      {
        status: { $lt: 10 },
      },
    ],
  });
 
  res.status(200).json({
    success: true,
    data: all,
    data2: wait.length,
    data3: accept.length,
  });
});

exports.profileMe = asyncHandler(async (req, res, next) => {
  const me = await Truck.findById({ "user._id": req.user._id });

  res.status(200).json({
    success: true,
    data: me,
  });
});

exports.updateProfile = asyncHandler(async (req, res, next) => {
  const me = await Truck.findById(req.params.id);

  const {
    active,
    orderRadius,
    companyName,
    companyLicensePhoto,
    idCard,
    idCardPhoto,
    truckType,
    truckPlate,
    truckPlatePhoto,
    transportCapacity,
    profileCompany,
    depositAmount,
    transportIncome,
  } = req.body;

  await me.updateOne(
    {
      active,
      orderRadius,
      companyName,
      companyLicensePhoto,
      idCard,
      idCardPhoto,
      truckType,
      truckPlate,
      truckPlatePhoto,
      transportCapacity,
      profileCompany,
      depositAmount,
      transportIncome,
    },
    { new: true }
  );

  res.status(200).json({
    success: true,
    data: me,
  });
});


// here is the changes...
exports.changeStatus = asyncHandler(async (req, res, next) => {
  const allV=await getAllVarible()
  const depo=allV.truckDepositeAmount
  const comi=allV.appComistionAmountTruck
  let number
  const order = await Order.findById(req.params.id);
  const newStatus = order.status + 1;
 
  if(newStatus>9){
         
  }
  const last = order.statusTime[order.statusTime.length - 1];

  let time;

  if (order.statusTime.length == 0) {
    time = {
      status: newStatus,
      action: 1,
      at: Date.now(),
    };
  } else {
    time = {
      status: newStatus,
      action: last.action + 1,
      at:  Date.now(),
    };
  }

  // if (last.action) {
  //   time = {
  //     status: newStatus,
  //     action: last.action + 1,
  //     at: Date.now(),
  //   };
  // } else {
  //   time = {
  //     status: newStatus,
  //     at: Date.now(),
  //   };
  // }

  const sender = {
    _id: req.user._id,
    username: req.user.username,
    pictureProfile: req.user.pictureProfile,
  };

  const recipient = {
    _id: order.requster._id,
    username: order.requster.username,
    pictureProfile: order.requster.pictureProfile,
  };
  if (newStatus == 5) {
    await pushNotificationStatic(recipient._id , 5)
    number=5
  }
  if(newStatus==6){
    await pushNotificationStatic(recipient._id , 6)
    number=6
  }
  if(newStatus==7){
    await pushNotificationStatic(recipient._id , 7)
    number=7
  }
  if(newStatus==8){
    await pushNotificationStatic(recipient._id , 8)
   number=8
  }
  if(newStatus==9&&(req.user.group=="admin"||req.user.group=="superAdmin")){
     number = 9
     
      // //!wallet section
      const appcomi=(order.raisedPrice)*(comi/100)*100
      const driverAmount=(order.raisedPrice)*100
      const requsterAmount=order.raisedPrice*100

      const bidTransActionRequster=await walletUpdater(0,order.requster._id,requsterAmount,`Truck cost for order ${order.productName}`,"truck")
      if(!bidTransActionRequster.success){
        return next(new ErrorResponse("Wallet transaction failed",500))
      }
      const bidTransAction=await walletUpdater(1,order.driver._id,driverAmount,`Truck cost for order ${order.productName}`,"truck")
      const bidTransActionComi=await walletUpdater(0,order.driver._id,appcomi,`App comision cost for order ${order.productName}`,"truck")

      if(!bidTransAction.success||!bidTransActionComi.success){
        return next(new ErrorResponse("Wallet transaction failed",500))
      }
      const bidTransActionRequsterApp=await walletUpdaterApp(1,order.requster._id,requsterAmount,`Truck cost for order ${order.productName}`,"truck")
      const bidTransActionA=await walletUpdaterApp(1,req.user._id,appcomi,`App comision cost for order ${order.productName}`,"truck")
      const bidTransActionApp=await walletUpdaterApp(0,order.driver._id,driverAmount,`Truck cost for order ${order.productName}`,"truck")
      if(!bidTransActionA.success||!bidTransActionRequsterApp.success||!bidTransActionApp.success){
        return next(new ErrorResponse("if your wallet amount change call ashAdmin",500))
      }
    
    order.requsterPaymentInvoiceNumber=bidTransActionRequster.data
    order.driverPaymentInvoiceNumber=bidTransAction.data
    await order.save()
    
    const driver=await Truck.findOne({"user._id":order.driver._id})

    const newActiveOrders=driver.activeOrders.filter(item=>item.order!=req.params.id)
    
     driver.activeOrders=newActiveOrders
   
    await driver.save()
    await Order.findByIdAndUpdate(req.params.id,{
      end:true
    })
    await pushNotificationStatic(recipient._id , 9)
    await pushNotificationStatic(sender._id , 9)
  }
  if(newStatus==9){
    number=9
    const depo=allV.truckDepositeAmount
    const comi=allV.appComistionAmountTruck
     // //!wallet section
     const appcomi=(order.raisedPrice)*(comi/100)*100
      const driverAmount=(order.raisedPrice)*100
      const requsterAmount=order.raisedPrice*100

      const bidTransActionRequster=await walletUpdater(0,order.requster._id,requsterAmount,`Truck cost for order ${order.productName}`,"truck")
      if(!bidTransActionRequster.success){
        return next(new ErrorResponse("Wallet transaction failed",500))
      }
      const bidTransAction=await walletUpdater(1,order.driver._id,driverAmount,`Truck cost for order ${order.productName}`,"truck")
      const bidTransActionComi=await walletUpdater(0,order.driver._id,appcomi,`App comision cost for order ${order.productName}`,"truck")

      if(!bidTransAction.success||!bidTransActionComi.success){
        return next(new ErrorResponse("Wallet transaction failed",500))
      }
      const bidTransActionRequsterApp=await walletUpdaterApp(1,order.requster._id,requsterAmount,`Truck cost for order ${order.productName}`,"truck")
      const bidTransActionA=await walletUpdaterApp(1,req.user._id,appcomi,`App comision cost for order ${order.productName}`,"truck")
      const bidTransActionApp=await walletUpdaterApp(0,order.driver._id,driverAmount,`Truck cost for order ${order.productName}`,"truck")
      if(!bidTransActionA.success||!bidTransActionRequsterApp.success||!bidTransActionApp.success){
        return next(new ErrorResponse("if your wallet amount change call ashAdmin",500))
      }
   
    order.requsterPaymentInvoiceNumber=bidTransActionRequster.data
    order.driverPaymentInvoiceNumber=bidTransAction.data
    await order.save()

    const driver=await Truck.findOne({"user._id":order.driver._id})
    const newActiveOrders=driver.activeOrders.filter(item=>item.order!=req.params.id)
     driver.activeOrders=newActiveOrders
     await driver.save()
     const log=await Logs.findOne({orderId:req.params.id})
     log.end=true
     await log.save()
     await Order.findByIdAndUpdate(req.params.id,{
      end:true
    })
    await pushNotificationStatic(recipient._id , 9)
    await pushNotificationStatic(sender._id , 9)
  }
  
  await Order.findByIdAndUpdate(
    req.params.id,
    {
      $addToSet: { statusTime: time },
      status: newStatus,
    },
    { new: true }
  );

  await Logs.findOneAndUpdate(
    { orderId: req.params.id },
    {
      $addToSet: { statusTime: time },
      status: newStatus,
    },
    { new: true }
  );

  await refreshTruck();   // !this is not working
 
  res.status(200).json({
    success: true,
    data: {},
  });
});


// pishnahad gheymat az samte driver
exports.bidPrice = asyncHandler(async (req, res, next) => {
  console.log("here bid price ");
  const allV=await getAllVarible()
  const bidAmount=allV.truckBidAmount*100
  const order=await Order.findById(req.params.id)
  const log=await Logs.findOne({orderId:req.params.id})
  const driver=await Truck.findOne({"user._id":req.user._id})
  const newBid=req.params.price
  if(!order||!log||!driver){
    return next(new ErrorResponse("resourse not found",404))
  }
  // if(driver.activeOrders!=0){ //!check driver dont haveBid in this orderDay or towmarow or lastDay
  //   console.log("driverrrrrrrrrrrrrr",driver.activeOrders);
  //   driver.activeOrders.forEach((item) => {
  //     if (
  //       item.date.day == log.date.day &&
  //       item.date.month == log.date.month &&
  //       item.date.year == log.date.year
  //     ) {
  //       return next(new ErrorResponse("You have active order in this date",400))
  //     }
  //   });
  // }

  // console.log("after driver check");

  const newBidArray=log.drivers

  if(log.status==0){ //?zamani ke order Truck hich bidi nadarad
       // //!wallet section
       const bidTransAction=await walletUpdater(0,req.user._id,bidAmount,"Driver bid cost","truck")
       if(!bidTransAction.success){
         return next(new ErrorResponse("Wallet transaction failed",500))
       }
       const bidTransActionA=await walletUpdaterApp(1,req.user._id,bidAmount,"Driver bid cost","truck")
       if(!bidTransActionA.success){
         return next(new ErrorResponse("if your wallet amount change call ashAdmin",500))
       }
    const driverObjForBid={
      driverId:driver._id,
      userId: driver.user._id,
      status:"waiting",
      paymnetInvoiceNumber:bidTransAction.data,
      bid:newBid,
      at: Date.now(),
    }  
    newBidArray.push(driverObjForBid)
    const time = {
    status: 1,
    action: 1,
    at: Date.now(),
  };
    log.drivers=newBidArray
    log.bid=newBid
    log.raisedPrice=newBid
    log.status=1
    log.statusTime=[time]
    order.bid=newBid
    order.raisedPrice=newBid
    order.status=1
    order.statusTime=[time]
    await log.save() 
    await order.save()
    await SingleCommerceT(log.requster._id)
    await refreshTruck();
    await pushNotificationStatic(log.requster._id._id,1)
    return res.status(200).json({
      success:true,
      data:{}
    })
  }
  else{ //? zamani ke order Truck bid darad
     // //!wallet section
     const bidTransAction=await walletUpdater(0,req.user._id,bidAmount,"Driver bid cost","truck")
     if(!bidTransAction.success){
       return next(new ErrorResponse("Wallet transaction failed",500))
     }
     const bidTransActionA=await walletUpdaterApp(1,req.user._id,bidAmount,"Driver bid cost","truck")
     if(!bidTransActionA.success){
       return next(new ErrorResponse("if your wallet amount change call ashAdmin",500))
     }
      let alreadBid =false
      let isWiner=(log.bid>newBid)
      log.drivers.forEach((item)=>{
        if(item.userId==req.user._id){
          alreadBid=item
        }
      })
      if(!alreadBid){
        const time = {
          status: 1,
          action: 1,
          at: Date.now(),
        }
        const driverObjForBid={
          driverId:driver._id,
          userId: driver.user._id,
          status:isWiner?"waiting":"reject",
          paymnetInvoiceNumber:isWiner?bidTransAction.data:"",
          bid:newBid,
          at: Date.now(),
        }  
        newBidArray.push(driverObjForBid)
        if(isWiner){
          newBidArray.forEach(item=>{
            if(item.userId!=req.user._id){
              item.status=="reject"
            }
          })
          log.drivers=newBidArray
          log.bid=newBid
          log.raisedPrice=newBid
          log.status=1
          log.statusTime=[time]
          order.bid=newBid
          order.raisedPrice=newBid
          order.status=1
          order.statusTime=[time]
          await log.save() 
          await order.save()
          await SingleCommerceT(log.requster._id)
          await refreshTruck();
          await pushNotificationStatic(log.requster._id,1)
          return res.status(200).json({
            success:true,
            data:{}
          })
          
        }else{

          log.drivers=newBidArray
          await log.save()
          await refreshTruck();
          return res.status(200).json({
            success:true,
            data:"you are rejected"
          })
        }
   

      }else{
             
        
        const time = {
           status: 1,
           action: 1,
           at: Date.now(),
            };
        let min=newBidArray[0].bid
        let winner
        newBidArray.forEach(item=>{
          if(item.userId==req.user._id){
            item.bid=newBid
            item.at=Date.now()
          }
          if(item.bid<min){
            min=item.bid
          }
        })
         
        newBidArray.forEach(item=>{
          if(item.bid==min){
            item.status="waiting"
            winner=item
          }else{
            item.status="reject"
          }
        })
                     
        log.bid=winner.bid
        log.statusTime=[time]
        log.raisedPrice=winner.bid
        order.bid=winner.bid
        order.statusTime=[time]
        order.raisedPrice=winner.bid

          await log.save() 
          await order.save()
          await SingleCommerceT(log.requster._id)
          await refreshTruck();
          await pushNotificationStatic(log.requster._id,1)
          return res.status(200).json({
            success:true,
            data:{}
          })
      }
  }
  
  // let newStatus
  // (log.bid>req.params.price)?newStatus="wating":newStatus="reject"
  // const driverObjForBid={
  //   driverId:driver._id,
  //   userId: driver.user._id,
  //   status: newStatus,
  //   bid:newBid,
  //   at: Date.now(),
  // }  
  // const time = {
  //   status: 1,
  //   action: 1,
  //   at: Date.now(),
  // };
  // const driverArray=log.drivers
  // const isAlreadyBided=driverArray.findIndex(item=>item.userId==req.user._id)
  // if(isAlreadyBided==-1){
  //   driverArray.push(driverObjForBid)
  // }else{
  //   driverArray[isAlreadyBided].status=newStatus
  //   driver[isAlreadyBided].bid=newBid
  //   if(newStatus=="wating"){
  //     driverArray.map((item)=>{
  //       if(item.userId!=req.user._id){
  //         item.status="reject"
  //       }
  //     })
  //   }
  // }
  // if(newStatus=="wating"){
  //   log.drivers=driverArray
  //   log.bid=newBid
  //   log.raisedPrice=newBid
  //   log.status=1
  //   log.statusTime=[time]
  //   order.bid=newBid
  //   order.raisedPrice=newBid
  //   order.status=1
  //   order.statusTime=[time]
  //   await log.save() 
  //   await order.save()
  // }else{

  // }
 
});

exports.getActiveOrdersMe = asyncHandler(async (req, res, next) => {

  const me = await Truck.findOne({ "user._id": req.user._id });

  
   const ActiveOrdersMe=me.activeOrders

  res.status(200).json({
    success: true,
    ActiveOrdersMe:ActiveOrdersMe 
  });
  
});
// exports.testChangeStatus= asyncHandler(async (req, res, next) => {
  
//   const testArray=req.body.array
  
  
 
//   testArray.forEach(item=>{
    
   
//     asyncprocces(req.user,item,req.params.id)
    
   
//   })

//   res.status(200).json({
//     success: true,
//     data: {},
  
  
//   }) 
 
// })


  
const asyncprocces=async(user,item,reqparamsId)=>{
 
  
  const order = await Order.findById(reqparamsId);
  let last = order.statusTime[order.statusTime.length - 1]
  let time  
  if (order.statusTime.length == 0) {
    time = {
      status: item.status,
      action: 1,
      at: item.at,
    };
  } else {
    time = {
      status: item.status,
      action: last.action + 1,
      at: item.at,
    };
  }

  await Order.findByIdAndUpdate(
    reqparamsId,
    {
      $addToSet: { statusTime: time },
      status: item.status,
    },
    { new: true }
    );

  await Logs.findOneAndUpdate(
    { orderId:reqparamsId },
    {
      $addToSet: { statusTime: time },
      status: item.status,
    },
    { new: true }
  );

  const sender = {
    _id: user._id,
    username: user.username,
    pictureProfile: user.pictureProfile,
  };

  const recipient = {
    _id: order.requster._id,
    username: order.requster.username,
    pictureProfile: order.requster.pictureProfile,
  };

  // await notification( 
  //   "change status",
  //   recipient,
  //   sender,
  //   order._id,
  //   "Order",
  //   "改变状态",
  //   "更改此订单的状态"
  // );
  

  // if (order.status > 4 && order?.driver?._id) {
  //   await addRefresh(order.requster._id, "refreshOrderRequester");

  //   await addRefresh(order.driver._id, "refreshTruck");
  //   await addRefresh(user._id, "refreshTruck");

  //   await refresh(order.requster._id, "refreshOrderRequester");
  //   await refresh(user._id, "refreshTruck");
  //   await refresh(order.driver._id, "refreshTruck");
  // }
  
  


}

exports.bidPriceNew = asyncHandler(async (req, res, next) => {

  //? find resourse
  const order=await Order.findById(req.params.id)
  const log=await Logs.findOne({orderId:req.params.id})
  const driver=await Truck.findOne({"user._id":req.user._id})
  const newBid=req.params.price
  if(!order||!log||!driver){
    return next(new ErrorResponse("resourse not found",404))
  }
  if(driver.activeOrders!=0){ //!check driver dont haveBid in this orderDay or towmarow or lastDay
    driver.activeOrders.forEach((item) => {
      if (
        item.date.day == log.date.day &&
        item.date.month == log.date.month &&
        item.date.year == log.date.year
      ) {
          return res.status(400).json({
          success: false,
          data: "you cant bid to this order you alresdy have order in this date",
        });

      }
     
    });
   }
   
  const newBidArray=log.drivers
  if(log.status==0){ //?zamani ke order Truck hich bidi nadarad
    const driverObjForBid={
      driverId:driver._id,
      userId: driver.user._id,
      status:"wating",
      bid:newBid,
      at: Date.now(),
    }  
    newBidArray.push(driverObjForBid)
    const time = {
    status: 1,
    action: 1,
    at: Date.now(),
  };
    log.drivers=newBidArray
    log.bid=newBid
    log.raisedPrice=newBid
    log.status=1
    log.statusTime=[time]
    order.bid=newBid
    order.raisedPrice=newBid
    order.status=1
    order.statusTime=[time]
    await log.save() 
    await order.save()
    await SingleCommerceT(log.requster._id)
    await refreshTruck();
    await pushNotificationStatic(log.requster._id._id,1)

    return res.status(200).json({
      success:true,
      data:{}
    })
  }
  else{ //? zamani ke order Truck bid darad
      let alreadBid =false
      let isWiner=(log.bid>newBid)
      log.drivers.forEach((item)=>{
        if(item.userId==req.user._id){
          alreadBid=item
        }
      })
      if(!alreadBid){
        const time = {
          status: 1,
          action: 1,
          at: Date.now(),
        }
        const driverObjForBid={
          driverId:driver._id,
          userId: driver.user._id,
          status:isWiner?"wating":"reject",
          bid:newBid,
          at: Date.now(),
        }  
        newBidArray.push(driverObjForBid)
        if(isWiner){
          newBidArray.forEach(item=>{
            if(item.userId!=newBid){
              item.status=="reject"
            }
          })
          log.drivers=newBidArray
          log.bid=newBid
          log.raisedPrice=newBid
          log.status=1
          log.statusTime=[time]
          order.bid=newBid
          order.raisedPrice=newBid
          order.status=1
          order.statusTime=[time]
          await log.save() 
          await order.save()
          await SingleCommerceT(log.requster._id)
          await refreshTruck();
          await pushNotificationStatic(log.requster._id,1)
          return res.status(200).json({
            success:true,
            data:{}
          })
          
        }else{

          log.drivers=newBidArray
          await log.save()
          await refreshTruck();
          return res.status(200).json({
            success:true,
            data:"you are rejected"
          })
        }
   

      }else{
        
        
        const time = {
           status: 1,
           action: 1,
           at: Date.now(),
            };
        let min=newBidArray[0].bid
        let winner
        newBidArray.forEach(item=>{
          if(item.userId==req.user._id){
            item.bid=newBid
            item.at=Date.now()
          }
          if(item.bid<min){
            min=item.bid
          }
        })
         
        newBidArray.forEach(item=>{
          if(item.bid==min){
            item.status="wating"
            winner=item
          }else{
            item.status="reject"
          }
        })
        log.bid=winner.bid
        log.statusTime=[time]
        log.raisedPrice=winner.bid
        order.bid=winner.bid
        order.statusTime=[time]
        order.raisedPrice=winner.bid

          await log.save() 
          await order.save()
          await SingleCommerceT(log.requster._id)
          await refreshTruck();
          await pushNotificationStatic(log.requster._id,1)
          return res.status(200).json({
            success:true,
            data:{}
          })
      }
  }
  
  // let newStatus
  // (log.bid>req.params.price)?newStatus="wating":newStatus="reject"
  // const driverObjForBid={
  //   driverId:driver._id,
  //   userId: driver.user._id,
  //   status: newStatus,
  //   bid:newBid,
  //   at: Date.now(),
  // }  
  // const time = {
  //   status: 1,
  //   action: 1,
  //   at: Date.now(),
  // };
  // const driverArray=log.drivers
  // const isAlreadyBided=driverArray.findIndex(item=>item.userId==req.user._id)
  // if(isAlreadyBided==-1){
  //   driverArray.push(driverObjForBid)
  // }else{
  //   driverArray[isAlreadyBided].status=newStatus
  //   driver[isAlreadyBided].bid=newBid
  //   if(newStatus=="wating"){
  //     driverArray.map((item)=>{
  //       if(item.userId!=req.user._id){
  //         item.status="reject"
  //       }
  //     })
  //   }
  // }
  // if(newStatus=="wating"){
  //   log.drivers=driverArray
  //   log.bid=newBid
  //   log.raisedPrice=newBid
  //   log.status=1
  //   log.statusTime=[time]
  //   order.bid=newBid
  //   order.raisedPrice=newBid
  //   order.status=1
  //   order.statusTime=[time]
  //   await log.save() 
  //   await order.save()
  // }else{

  // }
 
  
  

})
exports.cancelBid = asyncHandler(async (req, res, next) => {
  const order=await Order.findById(req.params.id) 
  const log=await Logs.findOne({orderId:req.params.id})
  const driver=await Truck.findOne({"user._id":req.user._id})
  if(!order||!log||!driver){
    return next(new ErrorResponse("resourse not found",404))
  }

 const driverArray=log.drivers
 const newArray=driverArray.filter(item=>item.userId!=req.user._id)

 
  
  if(newArray.length==0){
     log.bid=0
     log.raisedPrice=0
     log.status=0
     log.statusTime=[]
     log.drivers=[]
     order.bid=0
     order.raisedPrice=0
     order.status=0
     order.statusTime=[]
     await log.save()
     await order.save()
     
  }else{
    let min=newArray[0].bid
    newArray.forEach(item=>{
       if(item.bid<min){
          min=item.bid
       }
    })
    let newWinner
    newArray.forEach(item=>{
      if(item.bid==min){
        item.status="reject",
         newWinner=item
      }
    })
     log.bid=newWinner.bid
     log.raisedPrice=newWinner.bid
     log.drivers=newArray
     order.bid=newWinner.bid
     onanimationcancelrder.raisedPrice=newWinner.bid
    await log.save() 
    await order.save()
  }

  await SingleCommerceT(log.requster._id)
  await refreshTruck();   

  
  await pushNotificationStatic(log.requster._id,11)
  res.status(200).json({
    success:true,
  })

})