const fs = require('fs');
const addon = require('./build/Release/node-sharevox-core');

addon.initialize('lib/model');
addon.sharevox_load_openjtalk_dict('lib/open_jtalk_dic_utf_8-1.11');

//console.log(addon.metas());
console.log("sharevox_tts: start");
const buffer = addon.sharevox_tts('ピーブイエスだとサクサク動く', 4);
console.log("sharevox_tts: done");

fs.writeFileSync('audio.wav', buffer);
addon.sharevox_wav_free(buffer);
addon.finalize();

