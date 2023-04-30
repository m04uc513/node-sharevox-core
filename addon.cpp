#include <stdio.h>
#include <napi.h>
#include "core.h"

using namespace Napi;

Boolean _initialize(const CallbackInfo& info) {
  Env env = info.Env();
  int narg = info.Length();
  if (narg < 1) {
    printf("E initialize: narg = %d\n", narg);
    return Boolean::New(env, false);
  }
  if (!info[0].IsString()) {
    printf("E initialize: arg[1] not String\n");
    return Boolean::New(env, false);
  }
  std::string str = info[0].As<Napi::String>().Utf8Value();
  const char *root_dir_path = str.c_str();
  initialize(root_dir_path, false);
  return Boolean::New(env, true);
}

Value _finalize(const CallbackInfo& info) {
  Env env = info.Env();
  finalize();
  return env.Null();
}

Value _metas(const CallbackInfo& info) {
  Env env = info.Env();
  const char *ret = metas();
  //printf("metas: %s\n", ret);
  return String::New(env, ret);
}

Boolean _sharevox_load_openjtalk_dict(const CallbackInfo& info) {
  Env env = info.Env();
  int narg = info.Length();
  if (narg < 1) {
    printf("E sharevox_load_openjtalk_dict: narg = %d\n", narg);
    return Boolean::New(env, false);
  }
  if (!info[0].IsString()) {
    printf("E sharevox_load_openjtalk_dict: arg[0] not String\n");
    return Boolean::New(env, false);
  }
  std::string str = info[0].As<Napi::String>().Utf8Value();
  const char *dict_path = str.c_str();
  SharevoxResultCode ret = sharevox_load_openjtalk_dict(dict_path);
  if (ret == SHAREVOX_RESULT_SUCCEED) {
    return Boolean::New(env, true);
  } else {
    return Boolean::New(env, false);
  }
}

Value _sharevox_tts(const CallbackInfo& info) {
  Env env = info.Env();
  int narg = info.Length();
  if (narg < 2) {
    printf("E sharevox_tts: narg = %d\n", narg);
    return env.Null();
  }
  if (!info[0].IsString()) {
    printf("E sharevox_tts: arg[0] not String\n");
    return env.Null();
  }
  if (!info[1].IsNumber()) {
    printf("E sharevox_tts: arg[1] not Number\n");
    return env.Null();
  }

  std::string str = info[0].As<Napi::String>().Utf8Value();
  const char *text = str.c_str();
  int64_t speaker_id = info[1].As<Napi::Number>().Int64Value();
  int output_binary_size;
  uint8_t *output_wav;
  sharevox_tts(text, speaker_id, &output_binary_size, &output_wav);

  Buffer<uint8_t> buffer = Buffer<uint8_t>::New(env, 
                                                output_wav, 
                                                output_binary_size);

  return buffer;
}

void _sharevox_wav_free(const CallbackInfo& info) {
  //Env env = info.Env();
  int narg = info.Length();
  if (narg < 1) {
    printf("E sharevox_wav_free: narg = %d\n", narg);
    return;
  }
  if (!info[0].IsBuffer()) {
    printf("E sharevox_wav_free: arg[0] not Buffer\n");
    return;
  }
  Buffer<uint8_t> buffer = info[0].As<Napi::Buffer<uint8_t>>();
  sharevox_wav_free(buffer.Data());
}

Object Init(Env env, Object exports) {

  exports.Set(String::New(env, "initialize"), 
            Function::New(env, _initialize));
  exports.Set(String::New(env, "finalize"), 
            Function::New(env, _finalize));
  exports.Set(String::New(env, "metas"), 
            Function::New(env, _metas));
  exports.Set(String::New(env, "sharevox_load_openjtalk_dict"), 
            Function::New(env, _sharevox_load_openjtalk_dict));
  exports.Set(String::New(env, "sharevox_tts"), 
            Function::New(env, _sharevox_tts));
  exports.Set(String::New(env, "sharevox_wav_free"), 
            Function::New(env, _sharevox_wav_free));
  
  return exports;
}

NODE_API_MODULE(addon, Init)
