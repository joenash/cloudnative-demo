const express = require("express");
const app = express();
const port = 3000;

app.use(express.static(__dirname + "/views"));
app.use(express.urlencoded({ extended: false }));

const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);
const MessagingResponse = require("twilio").twiml.MessagingResponse;

let hackers = [];

function findHacker(sender) {
  return hackers.findIndex((hacker) => hacker.sender === sender);
}

function createHacker(sender) {
  return (
    hackers.push({
      sender,
    }) - 1
  );
}

app.get("/", (req, res) => {
  res.render("index.html");
});

app.post("/receive", (req, res) => {
  console.log(req.body.Body);
  const sender = req.body.ProfileName;
  const hackerIndex = findHacker(sender);
  console.log(hackerIndex);
  const twiml = new MessagingResponse();

  if (hackerIndex === -1) {
    createHacker(sender);
    twiml.message("Hi! How can we help you today?");
  } else if (!hackers[hackerIndex].hasOwnProperty("problem")) {
    hackers[hackerIndex].problem = [req.body.Body];
    twiml.message("What's your discord username?");
  } else if (!hackers[hackerIndex].hasOwnProperty("discord")) {
    hackers[hackerIndex].discord = req.body.Body;
    twiml.message("Got it! Anything else?");
  } else {
    hackers[hackerIndex].problem.push(req.body.Body);
    twiml.message("Ok! We'll be in touch");
  }

  console.log(hackers);
  res.writeHead(200, { "Content-type": "text/xml" });
  res.end(twiml.toString());
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
