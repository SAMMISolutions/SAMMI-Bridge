# SAMMI Bridge
Current version of SAMMI Bridge. Find more about SAMMI at [sammi.solutions](https://sammi.solutions)

## Download
[Latest Release](https://github.com/SAMMISolutions/SAMMI-Bridge/releases)

## Table of Contents
- [For Users](#for-users)
- [For Extension Devs](#for-extension-devs)
- [Helper Functions](#helper-functions)
  - [Get Variable](#get-variable)
  - [Set Variable](#set-variable)
  - [Delete Variable](#delete-variable)
  - [Insert Array](#insert-array)
  - [Delete Array](#delete-array)
  - [Extension Command](#extension-command)
  - [Trigger Extension](#trigger-extension)
  - [Trigger Button](#trigger-button)
  - [Release Button](#release-button)
  - [Modify Button](#modify-button)
  - [Edit Button](#edit-button)
  - [Save Ini File](#save-ini-file)
  - [Load Ini File](#load-ini-file)
  - [Open URL](#open-url)
  - [HTTP Request](#http-request)
  - [Pop Up Message](#pop-up-message)
  - [Alert Message](#alert-message)
  - [Notification Message](#notification-message)
  - [Get Deck List](#get-deck-list)
  - [Get Deck](#get-deck)
  - [Get Deck Status](#get-deck-status)
  - [Change Deck Status](#change-deck-status)
  - [Get Image](#get-image)
  - [Get Sum](#get-sum)
  - [Stay Informed](#stay-informed)
  - [Get Active Buttons](#get-active-buttons)
  - [Get Modified Buttons](#get-modified-buttons)
  - [Get Twitch List](#get-twitch-list)
  - [Trigger](#trigger)
  - [Test Trigger](#test-trigger)
  - [Close](#close)
  - [Generate Message](#generate-message)
  - [Listening to Extension Data Received from SAMMI](#listening-to-extension-data-received-from-sammi)
  - [SAMMI Bridge Collaboration](#sammi-bridge-collaboration)

## For Users
**Status** tab shows the current status of your connection to SAMMI. You can see your Bridge version, and your connection status. You can also enable or disable logging.  
**Extensions** tab allows you to see all your installed extensions, and their versions. You can verify if your extensions are up to date here.  
**Twitch Triggers** tab allows you to test all available Twitch triggers by sending fake payload that mimics real triggers to SAMMI. 
**YouTube Triggers** tab allows you to test all available YouTube triggers by sending fake payload that mimics real triggers to SAMMI. 
 
## For Extension Devs
SAMMI Bridge uses [SAMMI websocket library](https://github.com/SAMMISolutions/SAMMI-Websocket) to make sending and receiving data easier.
You can use promises for sending data to SAMMI. Message ids are generated automatically. 

```js
sammiclient.send(command, data).then(response=>console.log(response))
```

## Helper Functions
Bridge provides native helper functions to make your life easier, without the need to use SAMMI Websocket library directly.  
You can call all helper functions with `SAMMI.method(arguments)`.   
To use promises, you can call them with `SAMMI.method(arguments).then(response=>console.log(response))`.   
All methods are documented inside SAMMI Bridge via JSDoc. For that, please download unminified version of SAMMI Bridge from [download folder](https://github.com/SAMMISolutions/SAMMI-Bridge/tree/main/download).

### Get Variable
```js
SAMMI.getVariable(name, buttonId = 'global')
```
- Get a variable
- Specify its button id or leave empty for global variables
- Example: `SAMMI.getVariable('myVariable', 'ID1')`

### Set Variable
```js
SAMMI.setVariable(name, value, buttonId = 'global', instanceID [optional])
```
- Set a variable
- Specify `button id` or leave empty to create a global variable
- Specify `instanceID` if the button is not persistent
  - retrieved from Extension Command payload as `instanceID` key 
  - the button must be still active (for example with Wait Until Variable exists command) when setting non persistent button variable
  - only available in SAMMI Core 2023.2.0^
- example: `SAMMI.setVariable('myVariable', 'Hello World', 'ID1')`

### Delete Variable
```js
SAMMI.deleteVariable(name, buttonId = 'global')
```
- Delete a variable
- Specify its button id or leave empty to delete a global variable
- Example: `SAMMI.deleteVariable('myVariable', 'ID1')`

### Insert Array
```js
SAMMI.insertArray(arrayName, index, value, buttonId = 'global')
```
- Inserts an item to a specified index in an array, shifting the other items
- `arrayName` - name of the array
- `index` - index to insert the new item at
- `value` - item value
- `buttonId` - button id, default is global
- Example: `SAMMI.insertArray('myArray',0,'Hello','ID1')`

### Delete Array
```js
SAMMI.deleteArray(arrayName, slot, buttonId = 'global')
```
- Deletes an item in a specified index in an array, shifting the other items
- `arrayName` - name of the array
- `index` - index to delete the item at
- `buttonId` - button id, default is global
- Example: `SAMMI.deleteArray('myArray',1,'ID1')`

### Extension Command
```js
SAMMI.extCommand(name, color = 3355443, height = 52, boxes, triggerButton = false, hidden = false)
SAMMI.extCommand(name, color, height, boxes, triggerButton, hidden, rowUnits)
SAMMI.extCommand(name, color, height, boxes, triggerButton, hidden, rowUnits, rowHeights)
```
This function is used to send an extension command to SAMMI, e.g. what users see when they add the extension command to their button. 
Here are the parameters:

- `name`: This is a string that represents the name of the extension command, as it will appear in SAMMI Core to the users.
- `color` (optional): This parameter determines the color of the extension box, and it accepts colors in BGR hex format (e.g., `3355443`). If you don't provide this parameter, it defaults to `3355443`.
- `height` (optional): This parameter sets the height of the extension box in pixels. You can use `52` for a regular box or `80` for a resizable text box. If you omit this parameter, it defaults to `52`.
- `boxes`: This is an object containing all the extension boxes available inside the extension command. Each box is represented by a key-value pair within the `boxes` object.
   - The object key (`boxVariable`): This is a string that represents a variable name under which the box value will be saved, and passed to Bridge when the extension command is triggered. 
      - The following values are reserved variables and cannot be used as `boxVariable`: `cmd`, `dis`, `ext`, `extcmd`, `ms`, `obsid`, `pos`, `sef`, `vis`, `xpan`.   
   - The object value: This value is an array with specific elements representing the box's properties. It includes:
     - `boxName`: A string that serves as a friendly name for the box, displayed to the user in SAMMI Core.
     - `boxType`: An integer that indicates the type of box. This integer corresponds to different types of boxes (e.g., resizable text box, check box, OBS Scenes box, etc.). See the table below for a list of all box types.
     - `defaultValue`: The default value for the variable associated with this box.
     - (optional) `sizeModifier`: An optional parameter that adjusts the horizontal size of the box. It defaults to `1`. 0.5 is half the size, 2 is double the size, etc. Note that by changing the size of one box, you will also change the size of all other boxes in the extension command, as the total sum of all boxes' sizes must be equal to the number boxes themselves to fit in the extension command.
     - (optional) `options`: An object of options for the `boxType` chosen. For box types with dropdown menus, this can instead be an array of options a user picks from.
 - (optional) `triggerButton`: A boolean parameter (default is `false`) that, when set to `true`, triggers an extension within SAMMI instead of sending data to Bridge. This is useful for relaying information between buttons.
 - (optional) `hidden`: Another boolean parameter (default is `false`) that, when set to `true`, hides the command from the extension menu in SAMMI. Useful for commands that are only used internally.
 - (optional) `rowUnits`: An array that defines how many width units each command row uses. For example `[3, 5, 2]` creates three command rows. Boxes are placed into each row until their `sizeModifier` values add up to that row's unit count, then SAMMI continues on the next row.
 - (optional) `rowHeights`: An array that defines the height of each command row in pixels, for example `[52, 80, 52]`. If omitted, SAMMI uses the command's default row height for each row. Boxes are aligned to the top of their row.

#### Box Types
You can use the numeric values directly, or use the helper constants exposed on `SAMMIVars` / `LBVars` where available, for example `SAMMIVars.box_selectstringwritable`.

| boxType | Helper constant | Description |
|---:|---|---|
| 0 | `box_newline` | Resizable text box that allows newlines. Default value should be a string. |
| 1 | `box_normal_bottom` | Single-line text box aligned to the bottom of the command row. |
| 2 | `box_checkbox` | Checkbox. Default value must be `true` or `false`; returns a boolean. |
| 4 | `box_obs_scenes` | OBS scene selector. Stores the selected scene name. |
| 5 | `box_obs_sources` | OBS source selector. Stores the selected source name. |
| 6 | `box_obs_filters` | OBS filter selector. Stores the selected filter name. |
| 7 | `box_keyboard` | Keyboard key selector. Default value should be `0`; returns the selected key code. |
| 8 | `box_compare` | Compare operator selector. Common values include `==`, `!=`, `>`, `<`, `>=`, `<=`. |
| 9 | `box_math` | Math/operator selector. Common values include `=`, `+=`, `-=`, `*=`, `/=`, `mod`, `div`, `concat`, bitwise operators, and math helpers. |
| 10 | `box_sound` / `cbox_sound` | Audio file path picker with preview controls. Returns the selected path. |
| 11 | `box_slider` | Slider from `0` to `1`, displayed as 0-100%. |
| 12 | `box_extension` | Extension command selector. Mostly used internally by SAMMI's own extension command flow. |
| 13 | `box_variable_bottom` | Yellow variable/value box aligned to the bottom of the command row. |
| 14 | `box_normal` / `box_normal_top` | Single-line text box aligned to the top of the command row. |
| 15 | `box_variable` / `box_variable_top` | Yellow variable/value box aligned to the top of the command row. |
| 16 | `box_smooth_type` | Smooth transition type selector used by movement/animation commands. |
| 17 | `box_color` | Color picker box. Default value should be a decimal BGR color. |
| 18 | `box_selectvalue` | Dropdown that returns the numeric index of the selected option. Default value should be a number. |
| 19 | `box_selectstring` | Dropdown that returns the selected option string. |
| 20 | `box_selectstringwritable` | Typeable dropdown. Returns either a selected option string or custom typed text. |
| 21 | `box_triggerpull` | Trigger Pull selector. Lets users pick a trigger payload key. |
| 22 | `box_loadfile` | File path picker. Returns the selected file path. |
| 23 | `box_imagefile` | Image file path picker. Returns the selected image path. |
| 24 | `box_twitch_reward` / `box_redeemid` | Twitch Channel Point reward selector. Returns the selected reward ID. |
| 25 | `box_commands` | Command option box. Provide an array of extension command names to let the user swap between related commands. |
| 26 | `box_youtube_category` | YouTube category selector for the selected YouTube account. |
| 27 | `box_youtube_account` | YouTube account selector. |
| 28 | `box_sourcesettings` | OBS source settings helper. Provides a "Check Settings" helper for source/input settings. |
| 29 | `box_filtersettings` | OBS filter settings helper. Provides a "Check Settings" helper for source filter settings. |
| 30 | `box_nobox` / `box_nothing` | No input field; only the label is drawn. |
| 31 | `box_obs_requests` | Resizable OBS request selector/text box. |
| 32 | `box_obs_pull` | OBS Event Pull selector. Lets users pick OBS event payload values. |
| 33 | `box_select_deck` / `box_decks` | Deck selector. Supports normal deck names plus special entries such as next/previous deck. |
| 34 | `box_password` | Password text box. Same value behavior as a normal text box, but displayed as hidden text. |
| 35 | `box_twitch_account` | Twitch account selector. Returns the selected linked Twitch account login. |
| 36 | `box_source_change_settings_request` | Resizable OBS source settings request selector/text box for source setting changes. |
| 37 | `box_save_variable` | Save Variable box for async extension commands. SAMMI waits for the extension to return a value before continuing.<br><br>Options:<br>- `timeoutAfter`: custom timeout in milliseconds. Default: `30000`. |
| 38 | `box_aitum_requests` | Resizable Aitum request selector/text box. |
| 39 | `box_loadfolder` | Folder path picker. Returns the selected folder path. |
| 40 | `box_meld_scene` | Meld scene selector. Shows scene names, stores the scene ID in the background. |
| 41 | `box_meld_track` | Meld track selector. Shows track names, stores the track ID in the background. Can be filtered by a parent scene. |
| 42 | `box_meld_layer` | Meld layer selector. Shows layer names, stores the layer ID in the background. Can be filtered by a parent scene. |
| 43 | `box_meld_effect` | Meld effect selector. Shows effect names, stores the effect ID in the background. Can be filtered by a parent layer. |
| 44 | `box_meld_item` | Generic Meld item selector. |
| 45 | `box_meld_pull` | Meld Event Pull selector. Lets users pick Meld trigger payload values. |

For `box_selectvalue`, `box_selectstring`, `box_selectstringwritable`, and `box_commands`, pass the option list as the fifth item in the box array:

```js
SAMMI.extCommand('Example: Select Action', 3355443, 52, {
  action: ['Action', SAMMIVars.box_selectstring, 'Start', 1, ['Start', 'Stop', 'Toggle']]
})
```

![Example Box Types](https://i.imgur.com/LP4OICw.png)

#### Usage Examples

This extension command named Lucky Wheel will create three boxes: a select box with options to select a color, a regular text box, and a box to select an image file. It will send its data to Bridge.

  ```js 
  SAMMI.extCommand('Lucky Wheel', 3355443, 52, {
    color: ['Wheel Color', 19, 'blue', null, ['blue', 'yellow', 'green']],
    rewardName: ['Reward Name', 14, 'Your Reward name'],
    rewardImage: ['Reward Image', 23, 'image.png']
  })
  ``` 

![](https://i.imgur.com/M1AOUWE.png)

This extension command will create an extension command named Lucky Wheel with two text boxes. It will send its data as an Extension Trigger within SAMMI instead of sending it to Bridge. 

  ```js 
  SAMMI.extCommand('Lucky Wheel', 3355443, 52, {
    rewardName: ['Reward Name', 14, 'Some Reward name'],
    rewardName2: ['Reward Name 2', 14, 'And another reward name']
  }, true)
  ```
![](https://i.imgur.com/UisZBCL.png)

This extension command will create the same extension command as above, however it will be hidden from the extension menu in SAMMI. 

  ```js 
  SAMMI.extCommand('Lucky Wheel', 3355443, 52, {
    rewardName: ['Reward Name', 14, 'Some Reward name'],
    rewardName2: ['Reward Name 2', 14, 'And another reward name']
  }, true, true)
  ```
![](https://i.imgur.com/H6xJkwF.png)

This extension command creates a single visible command, which can be used to swap between hidden commands. This is useful if you're adding multiple, similar functioning commands.

```js
const MyExtensionCommands = [
    "My Extension: Command 1",
    "My Extension: Command 2",
    "My Extension: Command 3",
];
SAMMI.extCommand("My Extension: Command Selector", 4467268, 52, {
    option: ["Option", 25, "Select Command", 1, MyExtensionCommands]
}, false, false);

SAMMI.extCommand("My Extension: Command 1", 4467268, 52, {
    option: ["Option", 25, "Command 1", 1, MyExtensionCommands],
}, true, true);
SAMMI.extCommand("My Extension: Command 2", 4467268, 52, {
    option: ["Option", 25, "Command 2", 1, MyExtensionCommands],
}, true, true);
SAMMI.extCommand("My Extension: Command 3", 4467268, 52, {
    option: ["Option", 25, "Command 3", 1, MyExtensionCommands],
}, true, true);
```
![a list of commands](https://i.imgur.com/pU231bs.png)

This extension command has a save variable parameter. This means SAMMI automatically waits for a value. It also includes an options object with the `timeoutAfter` key set to set a timeout of `10000` milliseconds rather than the default `30000` milliseconds.

```js
SAMMI.extCommand("My Extension: Basic Math", 4467268, 52, {
    value1: ["Value 1", 14, "", 1.2],
    opreator: ["Operator", 9, "+", 0.4],
    value2: ["Value 2", 14, "", 1.2],
    saveVar: ["Save Variable As", 37, "", 1.2, {timeoutAfter: 10000}]
}, false, false);
```

This extension command uses two command rows. The first row has two equal boxes (`[1, 1]` inside a row with `2` units), and the second row has one wider box inside a row with `1` unit.

```js
SAMMI.extCommand("My Extension: Two Row Command", 4467268, 132, {
    scene: ["Scene", 14, "", 1],
    action: ["Action", 19, "Start", 1, ["Start", "Stop"]],
    message: ["Message", 0, "", 1]
}, false, false, [2, 1], [52, 80]);
```

### Trigger Extension
```js
SAMMI.triggerExt(trigger, pullData)
```
- `trigger` - name of the trigger
- `data` - object containing all trigger pull data (can contain objects, arrays etc.)
- example: `SAMMI.triggerExt('Test Trigger', {users:['cyanidesugar', 'Silverlink'], color: 'blue', number: 5})`

### Trigger Button
```js
SAMMI.triggerButton(id)
```
- Triggers a button
- `id` - button ID to trigger
- example: `SAMMI.triggerButton('ID1')`

### Release Button
```js
SAMMI.releaseButton(id)
```
- Releases a button that was triggered and is still considered active
- `id` - button ID to release
- example: `SAMMI.releaseButton('ID1')`

### Modify Button
```js
SAMMI.modifyButton(id, color, text, image, border, fontColor, borderColor, fontShadow)
SAMMI.modifyButton(id, {
  color,
  text,
  image,
  border,
  font_color,
  border_color,
  font_shadow
})
```
- Modifies a button appearance temporarily
- `id` - button ID to modify
- `color` - decimal button color (BGR)
- `text` - button text
-  `image` - button image file name
- `border` - border size, 0-8
- `fontColor` / `font_color` - decimal font color (BGR)
- `borderColor` / `border_color` - decimal border color (BGR)
- `fontShadow` / `font_shadow` - `true` to show the font shadow, `false` to hide it
- leave parameters empty to reset button back to default values
- example: `SAMMI.modifyButton('ID1', 4934525, 'Hello', 'buttonImage.png', 5, 16777215, 0, true)`
- object example: `SAMMI.modifyButton('ID1', { text: 'Hello', font_color: 16777215, border_color: 0, font_shadow: false })`

### Edit Button
```js
SAMMI.editButton(deckId, buttonId)
```
- Opens an edit commands window in SAMMI for the selected button
- Highly experimental, use at your own risk
- `deckId` - deck ID where the button resides
- `buttonId` - button ID to open
- example: `SAMMI.editButton("20220625173133284190011", "MyAwesomeButton")`

### Save Ini File
```js
SAMMI.saveIni(fileName, section, key, value, type = "string" | "number")
```
- Saves a value to an INI file
- `fileName` - file name
- `section` - section name
- `key` - key name
- `value` - value to save
- `type` - type of the value, either string or number
- example: `SAMMI.saveIni("test.ini", "mySection", "myKey", "Hello world!", "string")`

### Load Ini File
```js
SAMMI.loadIni(fileName, section, key, type = "string" | "number")
```
- Loads a value from an INI file
- `fileName` - file name
- `section` - section name
- `key` - key name
- `type` - type of the value, either string or number
- example: `SAMMI.loadIni("test.ini", "section", "key", "string").then(response => console.log(response))`

### Open URL
```js
SAMMI.openURL(url)
```
- Opens an URL in your default browser
- Useful when Bridge is docked in OBS to avoid opening URLs in OBS
- `url` - full URL to open
- example: `SAMMI.openURL("https://google.com")`

### Http Request
```js
SAMMI.httpRequest(url, method = 'GET', headers [optional], body [optional])
```
- Sends an HTTP request via SAMMI to avoid CORS issues
- `url` - full URL to send the request to
- `method` - HTTP method, GET, POST, PUT, DELETE etc.
- `headers` - object containing all headers
- `body` - body of the request
- example 1: 
  ```js
  SAMMI.httpRequest("https://icanhazdadjoke.com", "GET", { Accept: "application/json" }, {}).then(response => {
    const data = JSON.parse(response.Value)
    console.log(data)
  })
  ```
- example 2: 
  ```js
  const headers = {
    'Client-id': 'XXX',
    'Authorization': 'Bearer XXX',
    'Content-Type': 'application/json'
  }

  const body = {
      'title': "Test Bridge Reward",
      'cost': 50000
  }

  SAMMI.httpRequest('https://api.twitch.tv/helix/channel_points/custom_rewards?broadcaster_id=XXX', "POST", headers, body)
  .then(response => {
      const data = JSON.parse(response.Value)
      console.log(data)
  })
  ```


### Pop Up Message
```js
SAMMI.popUp(message)
```
- Send a popup message to SAMMI
- example: `SAMMI.popUp('Hello World!')`

### Alert Message
```js
SAMMI.alert(message)
```
- Send an alert message to SAMMI
- example: `SAMMI.alert('Hello World!')`

### Notification Message
```js
SAMMI.notification(message)
```
- Sends a notification (tray icon bubble) message to SAMMI
- example: `SAMMI.notification('Hello World!')`

### Get Deck List
```js
SAMMI.getDeckList()
```
- Request an array of all decks
- Replies with an array of deck objects. Each deck includes `deckName`, `deckId`, `crc`, `status`, and `buttons`.
- `status` is a number: `1.0` for enabled decks and `0.0` for disabled decks.
- Each button entry can include `id`, `group_id`, `text`, `queueable`, `border`, `border_color`, `font_color`, and `font_shadow`.

### Get Deck
```js
SAMMI.getDeck(id)
```
- Request a deck params
- provide `id` of the specified deck (retrieved from getDeckList command)
- example: `SAMMI.getDeck('20211221163402196200595')`

### Get Deck Status
```js
SAMMI.getDeckStatus(id)
```
- Request current deck status (enabled/disabled)
- provide `id` of the specified deck (retrieved from getDeckList command)
- replies with either 0 (deck is disabled) or 1 (deck is enabled)
- example: `SAMMI.getDeckStatus('20211221163402196200595')`

### Change Deck Status
```js
SAMMI.changeDeckStatus(id, status)
```
- Change deck status
- provide `id` of the specified deck (retrieved from getDeckList command)
- provide new `status` of the deck - 1 = enable, 0 = disable, 2 = toggle
- example: `SAMMI.changeDeckStatus('20211221163402196200595', 2)`

### Get Image
```js
SAMMI.getImage(fileName)
```
- Retrieve an image in base64
- `fileName` = image file without the path
- example: `SAMMI.getImage('test.png')`

### Get Sum
```js
SAMMI.getSum(fileName)
```
- Retrieves CRC32 of a file
- `fileName` - file name without the path
- example: `SAMMI.getSum('test.png')`

### Stay Informed
NOTE: This function is NO LONGER SUPPORTED and has been REMOVED from SAMMI Core.
```js
SAMMI.stayInformed(enabled)
```
- Set `enabled` to true to start receiving all deck and button updates and false to stop receiving them
- example: `SAMMI.stayInformed(true)`

### Get Active Buttons
```js
SAMMI.getActiveButtons()
```
- Retrieves all currently active buttons

### Get Modified Buttons
```js
SAMMI.getModifiedButtons()
```
- Retrieves all currently modified buttons

### Get Twitch List
```js
SAMMI.getTwitchList()
```
- Retrieves information for all linked Twitch accounts, including username, id, token etc.

### Trigger
```js
SAMMI.trigger(type, data)
```
- `type` - trigger number
- `data` - trigger payload object. It must contain a `trigger_data` object/map. SAMMI adds `trigger_type` into `trigger_data` while processing the trigger.
- example for chat message trigger: 
    ```js
    SAMMI.trigger(0, {
    message : 'Hello World',
    broadcaster: 1,
    moderator: 0, 
    sub: 0, vip: 0,
    founder: 0,
    trigger_data: { 
      user_name: 'silverlink', 
      display_name: 'Silverlink', 
      user_id: 123456789, 
      message : 'Hello World!', 
      emote_list: '304822798:0-9/304682444:11-19', 
      badge_list: 'broadcaster/1', 
      channel : 123456789, 
      name_color: '#189A8D', 
      first_time: 0 
      }
    })
    ```
- This is a very complex command that is not recommended to use unless you know the exact payload you need to send. Bridge test triggers use this command, and the code is available in this repository.

#### Trigger Types
These are the current trigger IDs SAMMI Core exposes through `global.trigger_type` and accepts through `SAMMI.trigger(type, data)`.

| ID | Type key | Trigger |
|---:|---|---|
| 0 | `twitchchat` | Twitch Chat Message |
| 1 | `twitchsub` | Twitch Subscription |
| 2 | `twitchcommunitygift` | Twitch Subscription - Community Gift |
| 3 | `twitchredeem` | Twitch Channel Point Redemption |
| 4 | `twitchraid` | Twitch Raid |
| 5 | `twitchbits` | Twitch Bits |
| 6 | `twitchfollower` | Twitch New Follower |
| 7 | `hotkey` | Hotkey |
| 8 | `timer` | Repeat Interval / Timer |
| 9 | `obstrigger` | OBS Trigger |
| 10 | `sammi` | SAMMI Trigger |
| 11 | `twitchmoderation` | Twitch Moderation |
| 12 | `extensiontrigger` | Extension Trigger |
| 13 | `twitchwhispers` | Twitch Whisper |
| 14 | `twitchhost[DEPRECATED]` | Twitch Host (deprecated) |
| 15 | `twitchprediction` | Twitch Prediction |
| 16 | `twitchpoll` | Twitch Poll |
| 17 | `twitchhypetrain` | Twitch Hype Train |
| 18 | `youtubechat` | YouTube Chat Message |
| 19 | `youtubesubscriber` | YouTube Subscriber |
| 20 | `youtubesuperchat` | YouTube Super Chat |
| 21 | `youtubesupersticker` | YouTube Super Sticker |
| 22 | `youtubemember` | YouTube Sponsor / Member |
| 23 | `deckapp` | SAMMI Deck / Deck App |
| 24 | `triggerbutton` | Trigger Button |
| 25 | `triggerbuttondelay` | Trigger Button Delay |
| 26 | `webhooktrigger` | Webhook Trigger |
| 27 | `twitchlowtrust` | Twitch Low Trust Users |
| 28 | `twitchshoutout` | Twitch Shoutout - Created |
| 29 | `sammivoice` | SAMMI Voice |
| 30 | `crowdcontrol` | Crowd Control |
| 31 | `voicemod` | Voicemod |
| 32 | `pulsoid` | Pulsoid |
| 33 | `adbreak` | Twitch Ad Break |
| 34 | `twitchcharity` | Twitch Charity |
| 35 | `twitchannouncement` | Twitch Announcement |
| 36 | `twitchgueststar` | Twitch Guest Star |
| 37 | `twitchshoutoutreceive` | Twitch Shoutout - Received |
| 38 | `twitchstream` | Twitch Stream |
| 39 | `elgatostreamdeck` | Elgato Stream Deck |
| 40 | `twitchautomcaticrewardredemption` | Twitch Automatic Reward Redemption |
| 41 | `twitchchannelupdate` | Twitch Channel Information Updated |
| 42 | `gamepad` | Gamepad |
| 43 | `twitchwatchstreak` | Twitch Watch Streak |
| 44 | `twitchdefaultpowerup` | Twitch Default Power-Ups |
| 45 | `twitchcustomeventsubscription` | Twitch Custom EventSub Subscription |
| 46 | `twitcheventsubstatus` | Twitch EventSub Status Changed |
| 47 | `twitchcombo` | Twitch Combo |
| 48 | `twitchextension` | Twitch Extension |
| 49 | `twitchcustompowerup` | Twitch Custom Power-Ups |
| 50 | `meldtrigger` | Meld Trigger |

#### Trigger Payload Notes
- `data.trigger_data` is required for all trigger types. It can contain strings, numbers, booleans, arrays, and objects.
- For OBS and Meld triggers, SAMMI matches the top-level `updatetype` value against the trigger's selected event type. For example: `{ updatetype: 'RecordingChanged', trigger_data: { ... } }`.
- Extension triggers can usually be sent more safely through `SAMMI.triggerExt(trigger, pullData)`, which wraps the data for trigger type `12`.
- Bridge's own test-trigger UI uses `SAMMI.testTrigger`, described below, because it can add the broadcaster channel ID for Twitch pull values.

#### Meld Trigger Payloads
Meld trigger type `50` uses the top-level `updatetype` to select the event. Valid event names currently include:

- `Connected`
- `Disconnected`
- `SessionChanged`
- `SceneChanged`
- `SceneCreated`
- `SceneRemoved`
- `LayerCreated`
- `LayerRemoved`
- `StreamingChanged`
- `StreamStarted`
- `StreamStopped`
- `RecordingChanged`
- `RecordingStarted`
- `RecordingStopped`

Common Meld pull values include `connected`, `webchannelReady`, `ip`, `port`, `isStreaming`, `isRecording`, `isReplayBufferActive`, `currentScene`, `currentSceneId`, `previousScene`, `previousSceneId`, `stagedScene`, `stagedSceneId`, `sceneCount`, `layerCount`, `trackCount`, `effectCount`, `event`, `trigger`, `type`, `updatetype`, and `trigger_type`.

Scene/layer events can additionally include values such as `sceneId`, `sceneName`, `layerId`, `layerName`, `itemId`, `itemName`, `itemType`, `parentId`, and `parentName`. Session/signal events can include `args`, `signal`, and, for `SessionChanged`, `session`.

### Test Trigger
```js
SAMMI.testTrigger(type, data)
```
- Sends a test trigger through the same trigger system as `SAMMI.trigger`
- Uses the first linked Twitch account as the channel context for `from_channel_id` pull values
- `type` - trigger number from the table above
- `data` - trigger payload object with a required `trigger_data` object/map
- example:
  ```js
  SAMMI.testTrigger(5, {
    trigger_data: {
      user_name: 'silverlink',
      display_name: 'Silverlink',
      amount: 100,
      message: 'Cheer100 hello!'
    }
  })
  ```

### Close
```js
SAMMI.close()
```
- Closes SAMMI connection to Bridge

### Generate Message
```js
SAMMI.generateMessage()
```
- Generates a random message (used for test triggers)

### Listening to Extension Data Received from SAMMI
When a user triggers an extension command, SAMMI will send the data to Bridge (unless the `sendAsExtensionTrigger` parameter is set to `true`).
You can listen to this data by using `sammiclient.on('extension name', (payload) => {})`.
You can also use `sammiclient.addListener('extension name', functionToExecute)`.

For example, let's say your extension command is called Lucky Wheel:  
  ```js
  sammiclient.on('Lucky Wheel', (payload) => {
    console.log(payload)
    // DO SOMETHING WITH THE EXTENSION PAYLOAD
    // FromButton - button ID the extension command was triggered in 
    // instanceId - instance ID of a button the extension command was triggered in
    const { FromButton, instanceId }  = payload.Data 
  });
  ```

You can also use `addListener` instead of `on`:
  ```js
 sammiclient.addListener('Lucky Wheel', functionToExecute)
  ``` 

*Note: These methods are not be available until after your Bridge connects to SAMMI. Make sure to wrap them in a function which you call in your Extension Commands section (which is initialized as soon as Bridge connects to SAMMI).*

### SAMMI Bridge Collaboration

SAMMI Bridge is generated by Jekyll. Each section is a separate file generated from `_includes` folder. If you wish to propose changes, please do so by editing these files.
Any changes will immediately reflect at https://sammi.solutions/SAMMI-Bridge/bridge.html. We also manually generate the Bridge file for each release, which can be found in the `download` folder.
