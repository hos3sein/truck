const fetch = require("node-fetch");
const Order = require("./models/Order");
const Truck = require("./models/Truck");
const Logs = require("./models/Logs");

exports.createPerm = async () => {
  const data = [
    {
      name: "approve request",
      description: "approve pending request",
      iconName: "approve",
      libIconName: "lib approve",
      serviceName: "approve",
      prefixName: "admin",
      funcName: "approverequest",
      number: 20,
    },
    {
      name: "all request",
      description: "get all pending request",
      iconName: "approve",
      libIconName: "lib approve",
      serviceName: "approve",
      prefixName: "admin",
      funcName: "allpendings",
      number: 21,
    },

    {
      name: "request for group",
      description: "request for add group to me",
      iconName: "approve",
      libIconName: "lib approve",
      serviceName: "approve",
      prefixName: "user",
      funcName: "request",
      number: 22,
    },

    {
      name: "all request me",
      description: "get all request me ",
      iconName: "approve",
      libIconName: "lib approve",
      serviceName: "approve",
      prefixName: "user",
      funcName: "all",
      number: 23,
    },
  ];

  const url = `http://localhost:8012/api/v1/setting/dev/allper`;
  try {
    const rawResponse = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
      },
    });
    const response = await rawResponse.json();

    if (response.data.length) {
      response.data.find(async (elem) => {
        if (elem.number == 20) {
          return console.log("rad sho");
        } else {
          for (let i = 0; i < data.length; i++) {
            const element = data[i];

            try {
              const urll = `http://localhost:8012/api/v1/setting/permission/create`;
              const rawResponse = await fetch(urll, {
                method: "POST",
                headers: {
                  Accept: "*/*",
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(element),
              });
              const response = await rawResponse.json();
            } catch (err) {
              console.log("err", err);
            }
          }
        }
      });
    } else {
      for (let i = 0; i < data.length; i++) {
        const element = data[i];

        try {
          const urll = `http://localhost:8012/api/v1/setting/dev/createperm`;
          const rawResponse = await fetch(urll, {
            method: "POST",
            headers: {
              Accept: "*/*",
              "Content-Type": "application/json",
            },
            body: JSON.stringify(element),
          });
          const response = await rawResponse.json();
        } catch (err) {
          console.log("err", err);
        }
      }
    }
  } catch (err) {
    console.log("err", err);
  }
};

exports.createOrderDriver = async () => {
  const data = [
    {
      origin: {
        address: "1",
        latitude: 29.85781412760417,
        longitude: 121.51512749565973,
        city: "tehran",
        province: "浙江省",
        district: "海曙区",
        street: "丽园南路",
      },
      destination: {
        address: "浙江省台州市黄岩区头陀镇南岙村",
        latitude: 28.63425371353206,
        longitude: 121.11952175222041,
        city: "台州市",
        province: "浙江省",
        district: "黄岩区",
        street: "",
      },
      date: {
        day: 3,
        month: 9,
        year: 2022,
      },
      requster: {
        _id: "62ea2acc244aa5f2cf8b5c5f",
        username: "bisari",
        pictureProfile: "users/8618811111111/profilePicture/8618811111111.jpg",
      },
      truckType: 1,
      truckCapacity: 0,
      productName: "002",
      addressOrigin: "浙江省宁波市海曙区段塘街道新典路宁波第二技师学院",
      phoneNumberSender: "8618811111111",
      lineMakerOrigin: false,
      addressDestination: "浙江省台州市黄岩区头陀镇南岙村",
      lineMakerDestination: false,
      phoneNumberReceiver: "8618811111112",
      distance: 168,
      price: 203280,
      note: "salam",
      pending: true,
      end: false,
      status: 0,
    },
    {
      origin: {
        address: "2",
        latitude: 29.85781412760417,
        longitude: 121.51512749565973,
        city: "esfahan",
        province: "浙江省",
        district: "海曙区",
        street: "丽园南路",
      },
      destination: {
        address: "浙江省台州市黄岩区头陀镇南岙村",
        latitude: 28.63425371353206,
        longitude: 121.11952175222041,
        city: "台州市",
        province: "浙江省",
        district: "黄岩区",
        street: "",
      },
      date: {
        day: 7,
        month: 9,
        year: 2022,
      },
      requster: {
        _id: "62ea2acc244aa5f2cf8b5c5f",
        username: "bisari",
        pictureProfile: "users/8618811111111/profilePicture/8618811111111.jpg",
      },
      truckType: 2,
      truckCapacity: 0,
      productName: "",
      addressOrigin: "",
      phoneNumberSender: "8618811111111",
      lineMakerOrigin: false,
      addressDestination: "",
      lineMakerDestination: false,
      phoneNumberReceiver: "8618811111111",
      distance: 745,
      price: 485,
      note: "",

      status: 0,
    },
    {
      origin: {
        address: "3",
        latitude: 29.85781412760417,
        longitude: 121.51512749565973,
        city: "tehran",
        province: "浙江省",
        district: "海曙区",
        street: "丽园南路",
      },
      destination: {
        address: "浙江省宁波市海曙区段塘街道段塘西路御坊堂",
        latitude: 29.844635996451277,
        longitude: 121.51309507516496,
        city: "宁波市",
        province: "浙江省",
        district: "海曙区",
        street: "段塘西路",
      },
      date: {
        day: 3,
        month: 9,
        year: 2022,
      },
      requster: {
        _id: "62ea2acc244aa5f2cf8b5c5f",
        username: "bisari",
        pictureProfile: "users/8618811111111/profilePicture/8618811111111.jpg",
      },
      truckType: 1,
      truckCapacity: 0,
      productName: "kkk",
      addressOrigin: "浙江省宁波市海曙区段塘街道新典路宁波第二技师学院",
      phoneNumberSender: "8618811111111",
      lineMakerOrigin: false,
      addressDestination: "浙江省宁波市海曙区段塘街道新典路宁波第二技师学院",
      lineMakerDestination: false,
      phoneNumberReceiver: "8618811111113",
      distance: 2,
      price: 2420,
      note: "salam",
      status: 0,
    },
  ];

  const dta = [
    {
      group: "truck",
      companyName: "sample company",
      companyAddress: [
        {
          address:
            "浙江省宁波市鄞州区新明街道宁波高新区江南路亚朵酒店联安·四季里大厦",
          nameAddress: "truck company",
          latitude: 29.887522000000015,
          longitude: 121.61093300000002,
          city: "tehran",
          province: "浙江省",
          district: "鄞州区",
          street: "清水桥路",
          number: "300-308号",
        },
      ],
      idCard: 647474747473,
      truckType: 1,
      transportCapacity: 25,
      profileCompany:
        "users/8618667826620/company/profilePicture/8618667826620.jpg",
      deposit: false,
      depositAmount: 0,
      active: true,
    },
    {
      group: "truck",
      companyName: "dasd",
      companyAddress: [
        {
          address: "浙江省宁波市海曙区段塘街道新典路宁波第二技师学院",
          nameAddress: "truck esfahan",
          latitude: 29.85781412760417,
          longitude: 121.51512749565973,
          city: "esfahan",
          province: "浙江省",
          district: "海曙区",
          street: "丽园南路",
          number: "202号",
        },
      ],
      idCard: 12321312,
      truckType: 2,
      transportCapacity: 22,
      profileCompany:
        "users/8618811111111/company/profilePicture/8618811111111.jpg",
      deposit: false,
      depositAmount: 0,
      active: true,
    },
    {
      group: "truck",
      companyName: "abdolaco",
      companyAddress: [
        {
          address: "浙江省宁波市海曙区段塘街道新典路宁波第二技师学院",
          nameAddress: "truck teharn 0",
          latitude: 29.85781412760417,
          longitude: 121.51512749565973,
          city: "teharan",
          province: "浙江省",
          district: "海曙区",
          street: "丽园南路",
          number: "202号",
        },
      ],
      idCard: 14040468,
      truckType: 2,
      transportCapacity: 12,
      profileCompany:
        "users/8618898765432/company/profilePicture/8618898765432.jpg",
      deposit: false,
      depositAmount: 0,
      active: true,
    },
    {
      group: "truck",
      companyName: "abdolacos",
      companyAddress: [
        {
          address: "浙江省宁波市海曙区段塘街道新典路宁波第二技师学院",
          nameAddress: "truck shiraz",
          latitude: 29.85781412760417,
          longitude: 121.51512749565973,
          city: "shiraz",
          province: "浙江省",
          district: "海曙区",
          street: "丽园南路",
          number: "202号",
        },
      ],
      idCard: 1232233,
      truckType: 2,
      transportCapacity: 11,
      profileCompany:
        "users/8618862527362/company/profilePicture/8618862527362.jpg",
      deposit: false,
      depositAmount: 0,
      active: true,
    },

    {
      group: "truck",
      companyName: "sample company",
      companyAddress: [
        {
          address:
            "浙江省宁波市鄞州区新明街道宁波高新区江南路亚朵酒店联安·四季里大厦",
          nameAddress: "truck moshabeh",
          latitude: 29.887522000000015,
          longitude: 121.61093300000002,
          city: "tehran",
          province: "浙江省",
          district: "鄞州区",
          street: "清水桥路",
          number: "300-308号",
        },
      ],
      idCard: 647474747473,
      truckType: 1,
      transportCapacity: 25,
      profileCompany:
        "users/8618667826620/company/profilePicture/8618667826620.jpg",
      deposit: false,
      depositAmount: 0,
      active: true,
    },
  ];

  const find = await Order.find();

  if (find.length) {
    return;
  }

  data.forEach(async (elem) => {
    const createOrder = await Order.create(elem);

    await Logs.create({ orderId: createOrder._id });
  });

  dta.forEach(async (elem) => {
    await Truck.create(elem);
  });
};
// {
//   origin: {
//     address: "浙江省宁波市海曙区段塘街道新典路宁波第二技师学院",
//     latitude: 29.85781412760417,
//     longitude: 121.51512749565973,
//     city: "宁波市",
//     province: "浙江省",
//     district: "海曙区",
//     street: "丽园南路",
//   },
//   destination: {
//     address: "浙江省宁波市海曙区段塘街道丽园南路丽园南路学校(建设中)",
//     latitude: 29.856064371872918,
//     longitude: 121.51689171337043,
//     city: "宁波市",
//     province: "浙江省",
//     district: "海曙区",
//     street: "丽园南路",
//   },
//   date: {
//     day: 3,
//     month: 9,
//     year: 2022,
//   },
//   requster: {
//     _id: "62ea2acc244aa5f2cf8b5c5f",
//     username: "bisari",
//     pictureProfile: "users/8618811111111/profilePicture/8618811111111.jpg",
//   },
//   truckType: 1,
//   truckCapacity: 0,
//   productName: "sss",
//   addressOrigin: "浙江省宁波市海曙区段塘街道新典路宁波第二技师学院",
//   phoneNumberSender: "8618811111111",
//   lineMakerOrigin: false,
//   addressDestination: "浙江省宁波市海曙区段塘街道新典路宁波第二技师学院",
//   lineMakerDestination: false,
//   phoneNumberReceiver: "8618811111113",
//   distance: 1,
//   price: 1210,
//   note: "ffffff",
//   status: 0,
// },
// {
//   origin: {
//     address: "浙江省宁波市海曙区段塘街道新典路宁波第二技师学院",
//     latitude: 29.85781412760417,
//     longitude: 121.51512749565973,
//     city: "宁波市",
//     province: "浙江省",
//     district: "海曙区",
//     street: "丽园南路",
//   },
//   destination: {
//     address: "浙江省宁波市海曙区段塘街道丽园南路358号海曙恒一广场",
//     latitude: 29.851466213148722,
//     longitude: 121.51429514706855,
//     city: "宁波市",
//     province: "浙江省",
//     district: "海曙区",
//     street: "丽园南路",
//   },
//   date: {
//     day: 3,
//     month: 9,
//     year: 2022,
//   },
//   requster: {
//     _id: "62ea2acc244aa5f2cf8b5c5f",
//     username: "bisari",
//     pictureProfile: "users/8618811111111/profilePicture/8618811111111.jpg",
//   },
//   truckType: 1,
//   truckCapacity: 0,
//   productName: "fff",
//   addressOrigin: "浙江省宁波市海曙区段塘街道新典路宁波第二技师学院",
//   phoneNumberSender: "8618811111111",
//   lineMakerOrigin: false,
//   addressDestination: "浙江省宁波市海曙区段塘街道新典路宁波第二技师学院",
//   lineMakerDestination: false,
//   phoneNumberReceiver: "8618811111114",
//   distance: 1,
//   price: 1210,
//   note: "fffffggg",

//   status: 0,
// },
// {
//   origin: {
//     address: "浙江省宁波市海曙区段塘街道新典路宁波第二技师学院",
//     latitude: 29.85781412760417,
//     longitude: 121.51512749565973,
//     city: "宁波市",
//     province: "浙江省",
//     district: "海曙区",
//     street: "丽园南路",
//   },
//   destination: {
//     address: "浙江省宁波市海曙区段塘街道丽园南路358号海曙恒一广场",
//     latitude: 29.851466213148722,
//     longitude: 121.51429514706855,
//     city: "宁波市",
//     province: "浙江省",
//     district: "海曙区",
//     street: "丽园南路",
//   },
//   date: {
//     day: 3,
//     month: 9,
//     year: 2022,
//   },
//   requster: {
//     _id: "62ea2acc244aa5f2cf8b5c5f",
//     username: "bisari",
//     pictureProfile: "users/8618811111111/profilePicture/8618811111111.jpg",
//   },
//   truckType: 1,
//   truckCapacity: 0,
//   productName: "fff",
//   addressOrigin: "浙江省宁波市海曙区段塘街道新典路宁波第二技师学院",
//   phoneNumberSender: "8618811111111",
//   lineMakerOrigin: false,
//   addressDestination: "浙江省宁波市海曙区段塘街道新典路宁波第二技师学院",
//   lineMakerDestination: false,
//   phoneNumberReceiver: "8618811111114",
//   distance: 1,
//   price: 1210,
//   note: "fffffggg",

//   status: 0,
// },
// {
//   origin: {
//     address: "浙江省宁波市海曙区段塘街道新典路宁波第二技师学院",
//     latitude: 29.85781412760417,
//     longitude: 121.51512749565973,
//     city: "宁波市",
//     province: "浙江省",
//     district: "海曙区",
//     street: "丽园南路",
//   },
//   destination: {
//     address: "浙江省宁波市海曙区段塘街道丽园南路358号海曙恒一广场",
//     latitude: 29.851466213148722,
//     longitude: 121.51429514706855,
//     city: "宁波市",
//     province: "浙江省",
//     district: "海曙区",
//     street: "丽园南路",
//   },
//   date: {
//     day: 3,
//     month: 9,
//     year: 2022,
//   },
//   requster: {
//     _id: "62ea2acc244aa5f2cf8b5c5f",
//     username: "bisari",
//     pictureProfile: "users/8618811111111/profilePicture/8618811111111.jpg",
//   },
//   truckType: 1,
//   truckCapacity: 0,
//   productName: "fff",
//   addressOrigin: "浙江省宁波市海曙区段塘街道新典路宁波第二技师学院",
//   phoneNumberSender: "8618811111111",
//   lineMakerOrigin: false,
//   addressDestination: "浙江省宁波市海曙区段塘街道新典路宁波第二技师学院",
//   lineMakerDestination: false,
//   phoneNumberReceiver: "8618811111114",
//   distance: 1,
//   price: 1210,
//   note: "fffffggg",

//   status: 0,
// },
// {
//   origin: {
//     address: "浙江省宁波市海曙区段塘街道新典路宁波第二技师学院",
//     latitude: 29.85781412760417,
//     longitude: 121.51512749565973,
//     city: "宁波市",
//     province: "浙江省",
//     district: "海曙区",
//     street: "丽园南路",
//   },
//   destination: {
//     address: "浙江省宁波市海曙区段塘街道丽园南路358号海曙恒一广场",
//     latitude: 29.851466213148722,
//     longitude: 121.51429514706855,
//     city: "宁波市",
//     province: "浙江省",
//     district: "海曙区",
//     street: "丽园南路",
//   },
//   date: {
//     day: 3,
//     month: 9,
//     year: 2022,
//   },
//   requster: {
//     _id: "62ea2acc244aa5f2cf8b5c5f",
//     username: "bisari",
//     pictureProfile: "users/8618811111111/profilePicture/8618811111111.jpg",
//   },
//   truckType: 1,
//   truckCapacity: 0,
//   productName: "fff",
//   addressOrigin: "浙江省宁波市海曙区段塘街道新典路宁波第二技师学院",
//   phoneNumberSender: "8618811111111",
//   lineMakerOrigin: false,
//   addressDestination: "浙江省宁波市海曙区段塘街道新典路宁波第二技师学院",
//   lineMakerDestination: false,
//   phoneNumberReceiver: "8618811111114",
//   distance: 1,
//   price: 1210,
//   note: "fffffggg",

//   status: 0,
// },
// {
//   origin: {
//     address: "浙江省宁波市海曙区段塘街道新典路宁波第二技师学院",
//     latitude: 29.85781412760417,
//     longitude: 121.51512749565973,
//     city: "宁波市",
//     province: "浙江省",
//     district: "海曙区",
//     street: "丽园南路",
//   },
//   destination: {
//     address: "浙江省台州市椒江区洪家街道江西小炒(振兴北路店)",
//     latitude: 28.61863913605763,
//     longitude: 121.42191130917728,
//     city: "台州市",
//     province: "浙江省",
//     district: "椒江区",
//     street: "振兴北路",
//   },
//   date: {
//     day: 17,
//     month: 9,
//     year: 2022,
//   },
//   requster: {
//     _id: "62ea2acc244aa5f2cf8b5c5f",
//     username: "bisari",
//     pictureProfile: "users/8618811111111/profilePicture/8618811111111.jpg",
//   },
//   truckType: 1,
//   truckCapacity: 0,
//   productName: "tre",
//   addressOrigin: "浙江省宁波市海曙区段塘街道新典路宁波第二技师学院",
//   phoneNumberSender: "8618811111111",
//   lineMakerOrigin: false,
//   addressDestination: "浙江省台州市椒江区洪家街道江西小炒(振兴北路店)",
//   lineMakerDestination: false,
//   phoneNumberReceiver: "8618811111113",
//   distance: 192,
//   price: 3840,
//   note: "",

//   status: 0,
// },
