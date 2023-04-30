const core = require('./build/Release/node-sharevox-core');

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

async function initialize() {
  //var elapsedTime = 0;
  //const startTime = Date.now();
  await loadModel("lib/model");
  //const middleTime = Date.now();
  //elapsedTime = middleTime - startTime;
  //console.log(`loadModel took ${elapsedTime} nanoseconds`);
  await loadDict("lib/open_jtalk_dic_utf_8-1.11");
  //const endTime = Date.now();
  //elapsedTime = endTime - middleTime;
  //console.log(`loadDict  took ${elapsedTime} nanoseconds`);
  var json = await getMetas();
  console.log(json);
}

initialize();
