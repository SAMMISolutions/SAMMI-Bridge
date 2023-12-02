# SAMMI Bridge
Current version of SAMMI Bridge. Find more about SAMMI at [sammi.solutions](https://sammi.solutions)

## Download
[Latest Release](https://github.com/SAMMISolutions/SAMMISolutions/SAMMI-Bridge/releases)

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
SAMMI Bridge uses [SAMMI websocket library](https://github.com/SAMMISolutions/SAMMI-Websocket) to make sending and receiving data easier: h. 
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
SAMMI.extCommand(name, color = 3355443, height = 52, boxes, sendAsExtensionTrigger = false, hideCommand = false)
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
     - (optional) `selectOptions`: An optional array of options for the user to choose from (relevant only for specific box types like Select box).
     - (optional) `sendAsExtensionTrigger`: A boolean parameter (default is `false`) that, when set to `true`, triggers an extension within SAMMI instead of sending data to Bridge. This is useful for relaying information between buttons.
     - (optional) `hideCommand`: Another boolean parameter (default is `false`) that, when set to `true`, hides the command from the extension menu in SAMMI. Useful for commands that are only used internally.

#### Box Types
| boxType | Description |
---|---
0 | Resizable text box that allows for newline, defaultValue should be a string
2 | Check box, defaultValue must be set to true or false, will return true or false when triggered
4 | OBS Scenes box - allows user to select an OBS scene from a dropdown
5 | OBS Sources box - allows user to select an OBS source from a dropdown
6 | OBS Filters box - allows user to select an OBS filter from a dropdown
7 | Keyboard button, defaultValue should be 0, returns the select key code
8 | Compare box, defaultValue should be `==`, returns a string from the compare box, such as `=|` or `>=`
9 | Math box, defaultValue should be `=`, returns a string from the compare box, such as `|` or `+=`
10 | Sound path box, defaultValue should be `""`, returns its path
11 | Slider 0 to 100%, defaultValue should be 0-1, returns a float 0 to 1
14 | Normal white box, defaultValue can be anything
15 | Variable box (yellow box), defaultValue should be a string, returns whatever variable is in the yellow box
17 | Color box, defaultValue should be a number, returns the selected color
18 | Select box value, defaultValue should be `0`, shows a list of all the options you provided when clicked and returns a numeric value of the selected option
19 | Select box string, defaultValue should be a string, returns a string the user selected
20 | Select box string typeable, defaultValue should be a string, returns a string the user selected or typed in the box
22 | File path, defaultValue should be a string, returns the selected file path
23 | Image path, defaultValue should be a string, returns the selected image path
24 | Twitch reward redeem ID, defaultValue should be a number, returns the selected reward ID
30 | No box at all, only label is present
32 | OBS Pull Box 
33 | Select Deck Box, defaultValue should be a number
34 | Password Box, same as 14, except the string is displayed as *****
35 | Twitch Account Box, select box with all linked Twitch accounts, returns the selected option

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


ID to trigger
- example: `SAMMI.triggerButton('ID1')`

### Modify Button
```js
SAMMI.modifyButton(id, color, text, image, border)
```
- Modifies a button appearance temporarily
- `id` - button ID to modify
- `color` - decimal button color (BGR)
- `text` - button text
-  `image` - button image file name
- `border` - border size, 0-7
- leave parameters empty to reset button back to default values
- example: `SAMMI.modifyButton('ID1', 4934525, 'Hello', 'buttonImage.png', 5)`

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
  SAMMI.httpRequest('https://icanhazdadjoke.com', "GET", { "Accept: application/json" }, {}).then(response => {
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
- Replies with an array `["Deck1 Name","Unique ID",crc32,"Deck2 Name","Unique ID",crc32,...]`

### Get Deck
```js
SAMMI.getDeck(id)
```
- Request a deck params
- provide `id` of the specified deck (retrieved from getDeckList command)
- example: `SAMMI.getDeck('202

11221163402196200595')`

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
    - 0 Twitch chat, 1 Twitch Sub, 2 Twitch Gift, 3 Twitch redeem, 4 Twitch Raid, 5 Twitch Bits, 6 Twitch Follower, 7 Hotkey, 8 Timer, 9 OBS Trigger, 10 SAMMI, 11 twitch moderation, 12 extension trigger
- `data` - whatever data is required for the trigger
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