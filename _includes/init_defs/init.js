// Twitch client ID to use for Twitch API requests
const TWITCH_CLIENT_ID = 'xolexwv18o8i5uqsga0bw3z39cpg0c';
// init object with all available SAMMI command methods
const SAMMI = LB = new SAMMICommands();
// Expose websocket client and logIt function for global access
let sammiclient;
let lioranboardclient;
let logIt;
let sammiModal;
// SAMMI global object with variables
const SAMMIVars = LBVars = {
  SAMMIdebug: JSON.parse(localStorage.getItem('SAMMIdebug')) || {},
  twitchList: {},
  force_close: false,
  box_newline: 0,
  box_checkbox: 2,
  box_keyboard: 7,
  box_compare: 8,
  box_math: 9,
  cbox_sound: 10,
  box_slider: 11,
  box_normal: 14,
  box_variable: 15,
  box_color: 17,
  box_selectvalue: 18,
  box_selectstring: 19,
  box_selectstringwritable: 20,
  box_loadfile: 22,
  box_imagefile: 23,
};
