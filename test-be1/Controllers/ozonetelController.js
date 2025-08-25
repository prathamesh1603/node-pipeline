const appError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const axios = require("axios");
const crypto = require("crypto");

exports.callCustomerByAgentId = catchAsync(async (req, res, next) => {
  const { customerPhone } = req.body;

  if (!req.user?.agentId || !customerPhone) {
    return res.status(400).send({
      status: false,
      msg: "All parameters are mandatory or you do not have access",
    });
  }

  const thirdPartyApiUrl = `https://in1-ccaas-api.ozonetel.com/CAServices/AgentManualDial.php`;

  const { ofCompany } = req.user;
  let ozonetelApiKey;

  const ENCRYPTION_KEY = Buffer.from(
    process.env.ENCRYPTION_KEY_OZENTEL_API_KEY,
    "base64"
  );

  function decrypt(text) {
    if (!text) return null;
    const parts = text.split(":");
    if (parts.length !== 2) return text; // Return original if format is invalid
    const iv = Buffer.from(parts[0], "hex");
    const encryptedText = parts[1];
    const decipher = crypto.createDecipheriv("aes-256-cbc", ENCRYPTION_KEY, iv);
    let decrypted = decipher.update(encryptedText, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  }

  if (ofCompany?.ozonetelApiKey) {
    ozonetelApiKey = decrypt(ofCompany.ozonetelApiKey); // Decrypt and set in the document
  }

  if (!ozonetelApiKey) {
    return next(new appError("api key not found in your organization", 400));
  }

  const params = new URLSearchParams({
    api_key: ozonetelApiKey, // Use secure storage for the API key
    agentID: req?.user?.agentId,
    customerNumber: customerPhone,
    campaignName: req.user?.campaignName || "Inbound_918049250480", // Replace with your campaign if needed
    username: req.user?.ofCompany?.ozonetelUsername, // Replace with your username
    // api_key: "KKbe3b161cffd1154ef4428b4529a785a8",
    // agentID: "GCP0002",
    // customerNumber: "7038309471",
    // campaignName: "Inbound_918049250480",
    // username: "grow_networth",

    format: "json",
  }).toString();

  const headers = {
    // "Content-Type": "application/x-www-form-urlencoded", // Adjust for URL-encoded body
  };

  try {
    const response = await axios.post(`${thirdPartyApiUrl}?${params}`, null, {
      headers,
    });

    const data = response.data;

    if (data.status.toLowerCase() === "queued successfully") {
      return res.status(200).send({
        status: true,
        msg: "Call queued successfully",
        ucid: data.ucid,
      });
    } else {
      return res.status(400).send({
        status: false,
        msg: data.status || "Failed to queue the call",
      });
    }
  } catch (error) {
    console.error("Error calling third-party API:", error.message);
    res.status(500).send({
      status: false,
      msg: "Internal server error",
      error: error.message,
    });
  }
});
