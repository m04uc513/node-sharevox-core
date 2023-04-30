{
  "targets": [
    {
      "target_name": "node-sharevox-core",
      "cflags!": [ "-fno-exceptions" ],
      "cflags_cc!": [ "-fno-exceptions" ],
      "sources": [ "addon.cpp" ],
      "include_dirs": [
        "<!@(node -p \"require('node-addon-api').include\")"
      ],
      "libraries": [
        "<(module_root_dir)/lib/libcore.so",
        "<(module_root_dir)/lib/libopenjtalk.a",
        "<(module_root_dir)/lib/libonnxruntime.so"
      ],
      'defines': [ 'NAPI_DISABLE_CPP_EXCEPTIONS' ],
    }
  ]
}
