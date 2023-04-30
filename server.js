const fs = require('fs');
const express = require("express");
const bodyParser = require("body-parser");

const core = require('./build/Release/node-sharevox-core');

var speakers = {};

async function loadModel(path) {
  return new Promise((resolve, reject) => {
    if (core.initialize(path)) {
      resolve();
    } else {
      reject(new Error('Error loadModel'));
    }
  });
}

async function loadDict(path) {
  return new Promise((resolve, reject) => {
    if (core.sharevox_load_openjtalk_dict(path)) {
      resolve();
    } else {
      reject(new Error('Error loadDict'));
    }
  });
}

async function getMetas() {
  return new Promise((resolve) => {
    var ret = core.metas()
    resolve(ret);
  });
}

async function text2speach(text, id) {
  return new Promise((resolve) => {
    var ret = core.sharevox_tts(text, id);
    resolve(ret);
  });
}

async function initialize() {
  console.log('load model ...')
  await loadModel("lib/model");
  console.log('load open jtalk dic ...')
  await loadDict("lib/open_jtalk_dic_utf_8-1.11");
  var jsonString = await getMetas();
  var metas = JSON.parse(jsonString);
  return new Promise((resolve) => {
    resolve(metas);
  });
}

const app = express();
const port = process.env.PORT || 3000;

async function main() {
  speakers = await initialize();
  console.log(speakers.length+' charactors found');

  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  app.use(express.static("public"));

  app.get("/", function(request, response) {
    console.log("get /");
    response.sendFile(__dirname + "/public/index.html");
  });

  app.get('/metas', (req, res) => {
    const metas = JSON.stringify(speakers);
    const data = {
      message: metas,
      timestamp: new Date().getTime()
    };
    res.json(data);
  });  

  app.post("/texttospeach", async (req, res) => {
  //console.log(req.body);
    const text = req.body.text;
    const id = parseInt(req.body.id);
    const wavBuffer = await text2speach(text, id);
  //const wavBuffer = fs.readFileSync("/app/public/audio.wav");
    res.set({
      "Content-Type": "audio/wav",
      "Content-Disposition": 'attachment; filename="audio.wav"',
    });
    res.send(wavBuffer);
  });
  
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });  
}

main();
