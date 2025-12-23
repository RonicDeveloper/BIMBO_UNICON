
require('dotenv').config();
const Agent = require('undici').Agent;
const fs = require('fs');
const axios = require('axios');
const FormData = require("form-data");

// process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const { getMySQLTimestamp } = require('./SQLDateTIme');

const ca = fs.readFileSync('rootCA.pem', 'utf8');

const agent = new Agent({
  connect: {
    ca,
  },
});

const token = async () => {
  const response = await fetch(`${process.env.API_URL}:${process.env.API_PORT}${process.env.API_GET_TOKEN}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ apiKey: process.env.API_KEY }),
  });
  if (!response.ok) {
    throw new Error("Failed to fetch token");
  }
  const data = await response.json();
  return data.token;
};

// ------------------- [TEST TOKEN] -------------------
const testToken = async (token) => {
  const response = await fetch(`${process.env.API_URL}:${process.env.API_PORT}${process.env.API_TEST_TOKEN}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.JWT_TOKEN}`,
    },
    dispatcher: agent,
  });
  const data = await response.json()
  return data;
}

// ------------------- [CREATE USER ACTIVITY] -------------------
const createActivity = async (activityData) => {
    const response = await fetch(`${process.env.API_URL}:${process.env.API_PORT}${process.env.API_CREATE_ACTIVITY}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.JWT_TOKEN}`
        },
        dispatcher: agent,
        body: JSON.stringify(activityData),
    });
    const data = await response.json();
    return data;
}
// ------------------- [UPLOAD MEDIA] -------------------

const uploadMedia = async (mediaUploadData) => {
  try {
    const form = new FormData();
    form.append("activityId"    , mediaUploadData.activityId);
    form.append("identifier"    , mediaUploadData.identifier);
    form.append("readPointName" , mediaUploadData.readPointName);
    form.append("file"          , mediaUploadData.file);
    const response = await axios.post(`${process.env.API_URL}:${process.env.API_PORT}${process.env.API_UPLOAD_MEDIA}`,form,
      {
        headers: {...form.getHeaders(),
          ...form.getHeaders(),
          Authorization: `Bearer ${process.env.JWT_TOKEN}`,
        },
        dispatcher: agent,
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
      }
    );
    return response.data;
  } catch (err) {
    console.error("[ERROR UPLOADING MEDIA]");
    if (err.response) {
      console.error(err.response.status, err.response.data);
    } else {
      console.error(err.message);
    }
  }
}

// ------------------- [MEDIA LIST] -------------------
const mediaList = async (activityId) => {
    const response = await fetch(`${process.env.API_URL}:${process.env.API_PORT}${process.env.API_MEDIA_LIST}?activityId=${activityId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.JWT_TOKEN}`
        },
        dispatcher: agent,
    });
    const data = await response.json();
    return data;
};

// ------------------- [MEDIA SHARE LINK] -------------------
const mediaShareLink = async (assetId) => {
    const response = await fetch(`${process.env.API_URL}:${process.env.API_PORT}${process.env.API_MEDIA_SHARE}/${assetId}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.JWT_TOKEN}`
        },
        dispatcher: agent,
    });
    const data = await response.json();
    return data;
}



// =================================================================
// =================== [ TESTING REQUESTS ] 
// =================================================================


// ------------------- [REQUEST TEST TOKEN] -------------------
testToken(process.env.JWT_TOKEN).then((data) => {
    console.log("------------------- TEST TOKEN -------------------");
    console.log(data);
    if(data.error){
        token().then((token) => {
            console.log("------------------- NEW TOKEN -------------------");
            console.log(token);
            process.env.JWT_TOKEN = token;
        }); 
    }
});

// ------------------- [REQUEST CREATE ACTIVITY] -------------------

const activityData = {
    identifier      : "1E6BE663DC91900AF7",
    readPointName   : "NT-04A",
    startDate       : getMySQLTimestamp(),
    endDate         : getMySQLTimestamp(),
    activityData    : {
        score : 300,
        comments : "User made 3 attempts to login"
    }
}

// createActivity(activityData).then((data) => {
//     console.log("------------------- CREATE ACTIVITY -------------------");
//     console.log(data);
// }).catch((error) => {
//     console.error("Error creating activity:", error);
// });


// ------------------- [REQUEST UPLOAD MEDIA] -------------------

const mediaUploadData = {
    activityId      : "ACT__hRTtaYCLDl5vNssM6QU7g",
    identifier      : "1E6BE663DC91900AF7",
    readPointName   : "NT-04A",
    file            : fs.createReadStream("./TestVideo.mp4"),
}

// uploadMedia(mediaUploadData).then((data) => {
//     console.log("[UPLOAD COMPLETED]");
//     console.log(data);
// }).catch((error) => {
//     console.error("[ERROR UPLOADING MEDIA]", error);
// });


// ------------------- [REQUEST MEDIA LIST] -------------------

const testActivityId = "ACT__hRTtaYCLDl5vNssM6QU7g";

// mediaList(testActivityId).then((data) => {
//     console.log("------------------- MEDIA LIST -------------------");
//     console.log(data);
// }).catch((error) => {
//     console.error("Error fetching media list:", error);
// });


// ------------------- [REQUEST MEDIA SHARE LINK] -------------------

const assetId = "ASSET_GzUmHjY1_Cb8lTZeupDBIw";

// mediaShareLink(assetId).then((data) => {
//     console.log("------------------- MEDIA SHARE LINK -------------------");
//     console.log(data);
// }).catch((error) => {
//     console.error("Error fetching media share link:", error);
// });

