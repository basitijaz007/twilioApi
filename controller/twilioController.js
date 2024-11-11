const { AccessToken } = require("twilio").jwt;
const VoiceGrant = AccessToken.VoiceGrant;
const VoiceResponse = require("twilio").twiml.VoiceResponse;

const generateToken = (req, res) => {
  const identity = "basit";

  const token = new AccessToken(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_API_KEY,
    process.env.TWILIO_API_SECRET,
    { ttl: 3600, identity }
  );
  token.identity = identity;

  const voiceGrant = new VoiceGrant({
    outgoingApplicationSid: process.env.TWILIO_TWIML_APP_SID,
    incomingAllow: true,
  });

  token.addGrant(voiceGrant);

  res.json({
    identity: identity,
    token: token.toJwt(),
  });
};

const handleCallRouting = (req, res) => {
  const dialedNumber = req.body.To || null;
  const voiceResponse = new VoiceResponse();

  if (dialedNumber && dialedNumber !== process.env.TWILIO_CALLER_ID) {
    const sanitizedNumber = dialedNumber.replace(/[^\d+\-\(\)]/g, "");
    const dial = voiceResponse.dial({ callerId: process.env.TWILIO_CALLER_ID });

    if (/^[\d+\-\(\)]+$/.test(sanitizedNumber)) {
      dial.number(sanitizedNumber);
    } else {
      voiceResponse.say("The number you have dialed is invalid.");
    }
  } else if (dialedNumber === process.env.TWILIO_CALLER_ID) {
    voiceResponse.say("You have dialed the caller ID number.");
  } else {
    voiceResponse.say("Thank you for calling.");
  }

  res.set("Content-Type", "text/xml");
  res.send(voiceResponse.toString());
};

module.exports = { generateToken, handleCallRouting };
