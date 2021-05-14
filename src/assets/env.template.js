(function(window) {
    window["env"] = window["env"] || {};
  
    // Environment variables
    window["env"]["appUrl"] = '${APP_URL}',
    window["env"]["peerjsHost"] = '${PEERJS_HOST}',
    window["env"]["peerjsPort"] = '${PEERJS_PORT}',
    window["env"]["peerjsPath"] = '${PEERJS_PATH}'
})(this);