


//Email

//Notification


//Otp

export const GenerateOtp = () => {
    const otp = Math.floor(100000 + Math.random() * 90000);
    let expiry = new Date();
    expiry.setTime(new Date().getTime() + (30 * 60 * 1000));
    return {otp, expiry}
}


export const onRequestOtp = async(otp: number, toPhoneNumber: string) => {
    const accountSId = "ACe160499b5ec8579f2b4ebbdcfdff1e2e";
    const authToken = "f7e5458a850f6843d6392d34c69e3f18";
    const client = require("twilio")(accountSId, authToken);

    const response = await client.messages.create({
      body: `Thomas Jindu says Your OTP is ${otp}`,
      from: "+19036086542", 
      to: `+263${toPhoneNumber}`,
    });

    return response;
}


