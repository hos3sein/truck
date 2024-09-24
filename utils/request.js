const { response } = require("express");
const fetch = require("node-fetch");

exports.addLoc = async (loc, id) => {
  const url = `${process.env.SERVICE_AUTHENTICATION}/api/v1/auth/dev/addloc/${id}`;

  try {
    const rawResponse = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ locations: loc }),
    });
    const response = await rawResponse.json();
    if (response.success) {
      return response;
    }
  } catch (err) {
    console.log("err", err);
  }
};

exports.pushNotification = async (
  notificationType,
  title,
  message,
  recipient,
  sender,
  navigate,
  relationModel
) => {
  const url = `${process.env.SERVICE_NOTIFICATION}/api/v1/notification/pushnotification/createpushnotif`;
  //  const url = `http://localhost:8006/api/v1/notification/pushnotification/createpushnotif`;


  try {
    const rawResponse = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        notificationType,
        title,
        message,
        recipient,
        sender,
        navigate,
        relationModel
      }),
    });
    const response = await rawResponse.json();

    if (response.success) {
      console.log("success");
      
    }
  } catch (error) {
    console.log("error", error);
  }
};
exports.notification = async (
  notificationType,
  recipient,
  sender,
  relation,
  relationModel,
  title,
  message
) => {
  const url = `${process.env.SERVICE_NOTIFICATION}/api/v1/notification/create`;
  // const url = `http://localhost:8006/api/v1/notification/create`;

  try {
    const rawResponse = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        notificationType,
        recipient,
        sender,
        relation,
        relationModel,
        title,
        message,
      }),
    });
    const response = await rawResponse.json();

    if (response.success) {
      console.log("success");
    }
  } catch (error) {
    console.log("error", error);
  }
};

exports.checkToken = async (token) => {
  // console.log("token>>>>>>>>", token);
  const url = `${process.env.SERVICE_AUTHENTICATION}/api/v1/auth/checktoken`;

  try {
    const rawResponse = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "*",
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
    });
    const response = await rawResponse.json();
    if (response.success) {
      return response;
    } else {
      return response;
    }
  } catch (err) {
    console.log("err", err);
  }
};

exports.addRefresh = async (user, subject) => {
  const url = `http://106.14.208.28:8050/api/v1/refresh/create`;
  
  try {
    const rawResponse = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user,
        subject,
      }),
    });
    const response = await rawResponse.json();

    if (response.success) {
      console.log("success");
    }
  } catch (error) {
    console.log("error", error);
  }
};
exports.getAllVarible = async () => {
  const url = `https://ashmoresetting.chinabizsetup.com/api/v1/setting/variable/all`;
  try {
    const rawResponse = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
      },
    });
    const response = await rawResponse.json();
       console.log(response.data);
       return response.data
  } catch (error) {
    console.log("error", error);
  }
};




exports.newLog=async (body) => {
  console.log("here");
    const url = `${process.env.SERVICE_SETTING}/api/v1/setting/log/putlog`;
    try {
      const rawResponse = await fetch(url, {
        method: "POST",
        headers: {
          Accept: "*",
          "Content-Type": "application/json",
        },
        body:JSON.stringify(body)
      });
      const response = await rawResponse.json();
      console.log(response);
      if (response.success) {
        console.log("nice");
        return true;
      } else {
        return false;
      }
    } catch (err) {
      console.log("err", err);
    }
  };
  
  
  

  exports.getUSER = async(id)=>{
    const url = `${process.env.SERVICE_AUTHENTICATION}/api/v1/auth/interservice/getuser/${id}`;
    try {
      const rawResponse = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "*",
          "Content-Type": "application/json",
        },
        // body:JSON.stringify(body)
      });
      const response = await rawResponse.json();
      console.log(response);
      return response
    } catch (err) {
      console.log("err", err);
    }
  }
  