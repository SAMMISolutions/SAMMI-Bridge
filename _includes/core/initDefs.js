/* eslint-disable */
// Twitch client ID to use for Twitch API requests
window.TWITCH_CLIENT_ID = 'xolexwv18o8i5uqsga0bw3z39cpg0c';
// default Twitch user 
window.defaultTwitchUser = {
  display_name: "Default User",
  login: "defaultuser",
  user_id: "123456789",
}
// init object with all available SAMMI command methods
const SAMMI = new SAMMICommands();
window.SAMMI = SAMMI;
const LB = SAMMI;
window.LB = LB;
// Expose debug and sammiModal functions for global access
window.logIt = null; 
window.sammiModal = null; 
// SAMMI global object with variables
const SAMMIVars = {
  SAMMIdebug: JSON.parse(localStorage.getItem('SAMMIdebug')) || {},
  twitchList: {},
  force_close: false,
  force_open: false,
  box_newline: 0,
  box_checkbox: 2,
  box_obs_scenes: 4,
  box_obs_sources: 5,
  box_obs_filters: 6,
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
  box_twitch_reward: 24,
  box_nobox: 30,
  box_obs_pull: 32,
  box_select_deck: 33,
  box_password: 34,
  box_twitch_account: 35,
};
window.SAMMIVars = SAMMIVars;
const LBVars = SAMMIVars;
window.LBVars = LBVars;

