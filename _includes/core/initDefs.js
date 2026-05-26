/* eslint-disable */
// Twitch client ID to use for Twitch API requests
window.TWITCH_CLIENT_ID = 'xolexwv18o8i5uqsga0bw3z39cpg0c';
// default Twitch user 
window.defaultTwitchUser = {
  display_name: "Default User",
  login: "defaultuser",
  user_id: "123456789",
}
window.SAMMIRefreshBridge = function SAMMIRefreshBridge() {
  var href = window.location.href;
  var hashIndex = href.indexOf('#');
  var hash = hashIndex === -1 ? '' : href.slice(hashIndex);
  var base = hashIndex === -1 ? href : href.slice(0, hashIndex);
  base = base.replace(/([?&])sammi_reload=[^&]*&?/, '$1').replace(/[?&]$/, '');
  var separator = base.indexOf('?') === -1 ? '?' : '&';
  window.location.href = base + separator + 'sammi_reload=' + new Date().getTime() + hash;
};
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
  box_normal_bottom: 1,
  box_checkbox: 2,
  box_obs_scenes: 4,
  box_obs_sources: 5,
  box_obs_filters: 6,
  box_keyboard: 7,
  box_compare: 8,
  box_math: 9,
  box_sound: 10,
  cbox_sound: 10,
  box_slider: 11,
  box_extension: 12,
  box_variable_bottom: 13,
  box_normal: 14,
  box_normal_top: 14,
  box_variable: 15,
  box_variable_top: 15,
  box_smooth_type: 16,
  box_color: 17,
  box_selectvalue: 18,
  box_selectstring: 19,
  box_selectstringwritable: 20,
  box_triggerpull: 21,
  box_loadfile: 22,
  box_imagefile: 23,
  box_twitch_reward: 24,
  box_redeemid: 24,
  box_commands: 25,
  box_youtube_category: 26,
  box_youtube_account: 27,
  box_sourcesettings: 28,
  box_filtersettings: 29,
  box_nobox: 30,
  box_nothing: 30,
  box_obs_requests: 31,
  box_obs_pull: 32,
  box_select_deck: 33,
  box_decks: 33,
  box_password: 34,
  box_twitch_account: 35,
  box_source_change_settings_request: 36,
  box_save_variable: 37,
  box_aitum_requests: 38,
  box_loadfolder: 39,
  box_meld_scene: 40,
  box_meld_track: 41,
  box_meld_layer: 42,
  box_meld_effect: 43,
  box_meld_item: 44,
  box_meld_pull: 45,
};
window.SAMMIVars = SAMMIVars;
const LBVars = SAMMIVars;
window.LBVars = LBVars;

