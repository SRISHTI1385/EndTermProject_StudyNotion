const cloudinary = require("cloudinary").v2;
require("dotenv").config();

exports.cloudinaryConnect = () => {
    try {
        cloudinary.config({
            //!    ########   Configuring the Cloudinary to Upload MEDIA ########
            cloud_name: process.env.CLOUD_NAME,
            api_key: process.env.CLOUD_API_KEY,
            api_secret: process.env.CLOUD_API_SECRET,
        });
    } catch (err) {
        console.log(`unable to connect in cloudinary ${err}`);
    }
};
