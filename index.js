const express = require("express");
const app = express();
const path = require("path");
const port = 3000;
const bodyParser = require("body-parser");
require("dotenv").config();
const connection = require("./config/db");
const {
  generateToken,
  handleCallRouting,
} = require("./controller/twilioController");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/api/taskrouter-token", generateToken);
app.post("/api/call_routing", handleCallRouting);
app.get("/getform", (req, res) => {});

app.get("/users", (req, res) => {
  const query = "SELECT * FROM booking_forms WHERE integration_id=2";
  connection.query(query, (error, results) => {
    if (error) {
      console.error("Error fetching data:", error);
      res.status(500).send("Server error");
    } else {
      res.json(results);
    }
  });
});
app.listen(port, () => {
  console.log(`app is running on ${port}`);
});
