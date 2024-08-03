const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");
const moment=require("moment")
const fetch = require("node-fetch");
const Truck = require("../models/Truck");
const Group = require("../models/Group");
const Order = require("../models/Order");
const Logs = require("../models/Logs");

//In connection with approve service
exports.createTruck = asyncHandler(async (req, res, next) => {
  const create = await Truck.create(req.body);

  res.status(200).json({
    success: true,
    data: {},
  });
});
exports.findOrder = asyncHandler(async (req, res, next) => {
  const find = await Order.findById(req.params.id);
  res.status(200).json({
    success: true,
    data: find,
  });
});
exports.addUserToFavorite = asyncHandler(async (req, res, next) => {
  const userId=req.params.userId
  const orderId=req.params.orderId

  await Order.findByIdAndUpdate(orderId,{
    $addToSet: {userFavorites:{userId:userId}}
  })
  await Logs.findOneAndUpdate({orderId:orderId},{
    $addToSet: {userFavorites:{userId:userId}}
  })

  res.status(201).json({
   success:true
  })
});
exports.removeUserToFavorite = asyncHandler(async (req, res, next) => {
 const userId=req.params.userId
 const orderId=req.params.orderId
 await Order.findByIdAndUpdate(orderId,{
  $pull: {userFavorites:{userId:userId}}
 })
 await Logs.findOneAndUpdate({orderId:orderId},{
  $pull: {userFavorites:{userId:userId}}
})
 res.status(201).json({
  success:true
 })
});
exports.getInfoForChart=asyncHandler(async (req, res, next) => {
  console.log("ffffffffffffffff");
  const orders= await Order.find()  
  const mainArray=[]

  const to1=moment().format("YYYY-MM-DD")
  const day=to1.split("-")[2]
  const frome1=moment(to1).add(-day+1,"d").format("YYYY-MM-DD")

  const obj1={frome:frome1,to:to1,totalAmount:0}
  
  const to2=moment(frome1).format("YYYY-MM-DD")
  const frome2=moment(to2).add(-1,"M").format("YYYY-MM-DD")
  
  const obj2={frome:frome2,to:to2,totalAmount:0}

  const to3=moment(frome2).format("YYYY-MM-DD")
  const frome3=moment(to3).add(-1,"M").format("YYYY-MM-DD")

  const obj3={frome:frome3,to:to3,totalAmount:0}

  const to4=moment(frome3).format("YYYY-MM-DD")
  const frome4=moment(to4).add(-1,"M").format("YYYY-MM-DD")
  const obj4={frome:frome4,to:to4,totalAmount:0}

  const to5=moment(frome4).format("YYYY-MM-DD")
  const frome5=moment(to5).add(-1,"M").format("YYYY-MM-DD")

  const obj5={frome:frome5,to:to5,totalAmount:0}

  const to6=moment(frome5).format("YYYY-MM-DD")
  const frome6=moment(to6).add(-1,"M").format("YYYY-MM-DD")

  const obj6={frome:frome6,to:to6,totalAmount:0}
  orders.forEach(item=>{
    const test=moment(item.createdAt)
    console.log(test);
    const isRange1=moment(item.createdAt).isBetween(frome1,to1)
    const isRange2=moment(item.createdAt).isBetween(frome2,to2)
    const isRange3=moment(item.createdAt).isBetween(frome3,to3)
    const isRange4=moment(item.createdAt).isBetween(frome4,to4)
    const isRange5=moment(item.createdAt).isBetween(frome5,to5)
    const isRange6=moment(item.createdAt).isBetween(frome6,to6)
    if(isRange1&&item.cancel==false&&item.status>4){
      obj1.totalAmount=obj1.totalAmount+item.bid
    }
    if(isRange2&&item.cancel==false&&item.status>4){
      obj2.totalAmount=obj2.totalAmount+item.bid
    }
    if(isRange3&&item.cancel==false&&item.status>4){
      obj3.totalAmount=obj3.totalAmount+item.bid
    }
    if(isRange4&&item.cancel==false&&item.status>4){
      obj4.totalAmount=obj4.totalAmount+item.bid
    }
    if(isRange5&&item.cancel==false&&item.status>4){
      obj5.totalAmount=obj5.totalAmount+item.bid
    }
    if(isRange6&&item.cancel==false&&item.status>4){
      obj6.totalAmount=obj6.totalAmount+item.bid
    }
  })
  
  mainArray.push(obj1)
  mainArray.push(obj2)
  mainArray.push(obj3)
  mainArray.push(obj4)
  mainArray.push(obj5)
  mainArray.push(obj6)
    
 res.status(200).json({
  success:true,
  mainArray
 })
}); 

