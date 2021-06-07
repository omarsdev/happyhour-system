const express = require("express");
const admin = require("firebase-admin");

const router = express.Router();
const serviceAccount = require("../config/firebase.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
let tokens = ['d-VGpmeUTCeZ_Dnhvp3P3m:APA91bG7tpHVWtdSMOClYAX89bX35J9NVDRNwnmJXuIFR_ydPbAdWhKYbQukDn6Y1yxeRfq7NPjasQwWZXrg9PLZpDpwbuV9XEFOnZs0ku9wP5YPbBfVPfUW07FRipOvUjonTvk70bcX'];
console.log(tokens);
// router.post("/post", (req, res) => {
//   tokens.push(req.body.token);
//   res.status(200).json({ message: "Successfully registered FCM Token!" });
// });

router.route("/register").post((req, res) => {
  tokens.push(req.body.token);
  console.log(tokens);

  res.status(200).json({ message: "Successfully registered FCM Token!" });
});

router.route("/notifications").post(async (req, res) => {
  try {
    const { title, body, imageUrl } = req.body;

    await admin.messaging().sendMulticast({
      tokens,
      notification: {
        title,
        body,
        imageUrl,
      },
    });
    res.status(200).json({ message: "Successfully sent notifications!" });
  } catch (err) {
    res
      .status(err.status || 500)
      .json({ message: err.message || "Something went wrong!" });
  }
});

// router.post("/notifications", async (req, res) => {
//   try {
//     const { title, body, imageUrl } = req.body;
//     await admin.messaging().sendMulticast({
//       tokens,
//       notification: {
//         title,
//         body,
//         imageUrl,
//       },
//     });
//     res.status(200).json({ message: "Successfully sent notifications!" });
//   } catch (err) {
//     res
//       .status(err.status || 500)
//       .json({ message: err.message || "Something went wrong!" });
//   }
// });

module.exports = router;
