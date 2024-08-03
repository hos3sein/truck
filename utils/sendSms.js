const request = require("request");

const sendSms = async (phone, code) => {
  try {
    const con = false;

    if (con) {
      const formData = {
        account: "6t2SJSuz",
        password: "YCtcoINM",
        mobile: `${req.body.phone}`,
        content: `【宁波哥伦布】您的验证码是${code}。`,
        sender: "GLBNET",
      };

      request.post(
        {
          url: "http://apier.mytelecloud.com/sms/service/postSend",
          form: formData,
        },
        (err, httpResponse, body) => {
          console.log(err, body, httpResponse);
        }
      );
    } else {
      console.log("sms cancel");
    }
  } catch (err) {
    console.log("err>>>", err);
  }
};

module.exports = sendSms;
