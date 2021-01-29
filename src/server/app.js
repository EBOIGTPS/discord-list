const port = process.env.PORT || 3000;
var express = require("express");
var compression = require("compression");
var app = express();
module.exports = { app, port };
app.use(compression());
let log = console.log;
const rovel = require("rovel.js")
const fetch = rovel.fetch;
const dayjs = rovel.time;
const rateLimit = require("express-rate-limit");
let path = require("path");
// ejs setting
app.set('view engine', 'ejs');
app.set('view options', { delimiter: '::' });
const limiter = rateLimit({
 windowMs: 60 * 60 * 1000, // 60 minutes
 max: 1000 // limit each IP to 1000 requests per windowMs
});

app.set('trust proxy', 1);
app.use(limiter);

process.on('unhandledRejection', err => {
 var unre = function(req, res, next) {
  log(error("**PROCESS** - Unhandled Rejection:\n") + warn(err));
  next(err);
  app.use(unre);
 }
});
/*
var logger = function (req, res, next) {
        log();
        log(logs("Time: ") + ans(dayjs().format("ss | mm | hh A - DD/MM/YYYY Z")));
        const ip = req.ip || req.ips;
        log(logs('IP: ') + ans(ip));
        log(logs('Path requested: ') + ans(req.originalUrl));
        log(logs('Request.type: ') + ans(req.method));
        next();
}
app.use(logger);
log(logs("Using console logging"));
*/
var weblog = function(req, res, next) {
 const weburl = process.env.WEBHOOK;
 const logweb = `              **New Log!**\n**Time:** \`${dayjs().format("ss | mm | hh A - DD/MM/YYYY Z")}\`\n**IP:** ||${req.ip || req.ips}||\n**Path requested:** \`${req.originalUrl}\`\n**Request type:** \`${req.method}\``;
 fetch(weburl, {
  method: "POST",
  headers: {
   "Content-Type": "application/json"
  },
  body: JSON.stringify({
   "username": "RDL logging",
   "content": logweb
  })
 });
 next();
}
app.use(weblog);
log("Using webhooks");

log("[SERVER] Started!\nAt Time: "+(dayjs().format("ss | mm | hh A - DD/MM/YYYY Z")));

app.use('/assets', express.static(path.resolve("src/public/assets")));

app.get("/", (req, res) => {
 res.sendFile(path.resolve("src/public/assets/index.html"));
});

app.post()
app.get("/favicon.ico", (req, res) => {
 res.redirect("/assets/favicon.ico");
});

app.get("/arc-sw.js", (req, res) => {
 res.redirect("https://arc.io/arc-sw.js");
});

app.get("*", (req, res) => {
 res.sendFile(path.resolve("assets/index.html"));
 });