const fetch = require("node-fetch");

exports.refresh = async (id, type) => {
  // console.log("id", id);
  // console.log("type", type);

  const url = `${process.env.SERVICE_REFRESH}/api/v1/refresh/callalone/${id}/${type}`;
  try {
    const rawResponse = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
      },
    });
    const response = await rawResponse.json();
    // console.log("response refresh accept", response);
  } catch (error) {
    console.log("error", error);
  }
};

exports.refreshTruck = async () => {
  const url = `${process.env.SERVICE_REFRESH}/api/v1/refresh/calltruck`;
  try {
    const rawResponse = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
      },
    });
    const response = await rawResponse.json();
    console.log('truck refresh resault >>> ', response)
    // console.log("response refreshTruck accept", response);
  } catch (error) {
    console.log("error", error);
  }
};

// const fetch = require("node-fetch");

// exports.refresh = async (id) => {
//   const url = `http://localhost:6001/api/v1/refresh/callcontent`;
//   try {
//     const rawResponse = await fetch(url, {
//       method: "POST",
//       headers: {
//         Accept: "*/*",
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ provider: id }),
//     });
//     const response = await rawResponse.json();
//   } catch (error) {
//     console.log("error", error);
//   }
// };
exports.SingleCommerceT = async (id) => {
  const url = `${process.env.SERVICE_REFRESH}/api/v1/refresh/single/singlecommercettr/${id}`;
  try {
    const rawResponse = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
      },
      // body: JSON.stringify({ provider: id }),
    });
    const response = await rawResponse.json();


  } catch (error) {
    console.log("error", error);
  }
};