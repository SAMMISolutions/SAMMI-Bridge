# SAMMI Bridge
 Current version of SAMMI Bridge . Download the latest [release](https://github.com/SAMMISolutions/SAMMISolutions/SAMMI-Bridge/releases). This version will NOT work with any previous non SAMMI versions.

Find more about SAMMI at [sammi.solutions](https://sammi.solutions)

### For users
**Twitch Triggers** allow you to test all available Twitch triggers by sending fake payload that mimics real triggers to SAMMI.\
**YouTube Triggers** allow you to test all available YouTube triggers by sending fake payload that mimics real triggers to SAMMI.

 
### For extension devs
SAMMI Bridge uses SAMMI websocket library to make sending and receiving data easier: https://github.com/SAMMISolutions/SAMMI-Websocket. 
You can use promises for sending data to SAMMI. Message ids are generated automatically. 

```js
sammiclient.send(command, data).then(response=>console.log(response))
```

#### Helper functions
You can call all helper functions with `SAMMI.method(arguments)`. 
To use promises, you can call them with `SAMMI.method(arguments).then(response=>console.log(response))`. 
All methods are documented inside SAMMI Bridge via JSDoc.

```js
SAMMI.getVariable(name, buttonId = 'global')
```
- Get a variable
- specify its button id or leave empty for global variables
- example: `SAMMI.getVariable('myVariable', 'ID1')`

```js
SAMMI.setVariable(name, value, buttonId = 'global')
```
- Set a variable
- specify its button id or leave empty to create a global variable
- example: `SAMMI.setVariable('myVariable', 'Hello World', 'ID1')`

```js
SAMMI.deleteVariable(name, buttonId = 'global')
```
- Delete a variable
- specify its button id or leave empty to delete a global variable
- example: `SAMMI.deleteVariable('myVariable', 'ID1')`

```js
SAMMI.insertArray(arrayName, index, value, buttonId = 'global')
```
- Inserts an item to a specified index in an array, shifting the other items
- `arrayName` - name of the array
- `index` - index to insert the new item at
- `value` - item value
- `buttonId` - button id, default is global
- example: `SAMMI.insertArray('myArray',0,'Hello','ID1')`


```js
SAMMI.deleteArray(arrayName, slot, buttonId = 'global')
```
- Deletes an item in a specified index in an array, shifting the other items
- `arrayName` - name of the array
- `index` - index to delete the item at
- `buttonId` - button id, default is global
- example: `SAMMI.deleteArray('myArray',1,'ID1')`

```js
SAMMI.extCommand(name, color = 3355443, height = 52, boxes, sendAsExtensionTrigger = false)
```
- Send an extension command (to create extension boxes) to SAMMI 
- `name` - name of the extension command 
- `color` - box color, accepts dec colors
- `height` - height of the box in pixels, you can use 52 for regular box or 80 for resiable box
- `boxes` - an object containing box objects (its key is box variable and value is an array of box params)
    - `boxVariable: [boxName, boxType, defaultValue, (optional)sizeModifier, (optional)selectOptions]`
    - `boxVariable` string - variable to save the box value under 
      - ! the following values are reserved variables and cannot be used as `boxVariable`: cmd, dis, ext, extcmd, ms, obsid, pos, sef, vis, xpan 
    - `boxName` string - name of the box shown in the user interface
    - `boxType` int
       boxType | Description
       ---|---
        0 | Resizable text box that allows for newline, defaultValue can be anything
        2 | Check box, defaultValue should be set to true or false, will always return true or false when triggered
        4 | OBS Scenes box
        5 | OBS Sources box
        6 | OBS Filters box
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
        22 | File path, defaultValue should be a string
        23 | Image path, defaultValue should be a string
        24 | Twitch reward redeem ID, defaultValue should be a number
        30 | No box at all, only label is present
        32 | OBS Pull Box 
        33 | Select Deck Box, defaultValue should be a number
        34 | Password Box, same as 14, except the string is displayed as *****
        35 | Twitch Account Box, select box with all linked Twitch accounts, returns the entered / selected text *****
        
    - `defaultValue` - default value of the variable
    - (optional) int `sizeModifier` - horizontal box size, 1 is normal
    - (optional) [] `selectOptions` - array of options for the user to select (when using Select box type)
    - (optional) boolean `sendAsExtensionTrigger` - will fire an extension trigger within SAMMI instead of sending the data to Bridge, useful for relaying information between buttons while providing your users with a friendly interface. Works the same as Trigger Extension Trigger command, except you can have custom boxes. (THIS FEATURE ONLY WORKS IN SAMMI 2022.5.1 AND BRIDGE 7.11 or newer)
- example: 
  ```js 
  SAMMI.extCommand('Lucky Wheel', 3355443, 52, {
    rewardName: ['Reward Name', 14, 'Some Reward name'],
    rewardName2: ['Reward Name 2', 14, 'And another reward name']
  }, true)
  ```
  will create an extension command named Lucky Wheel with 2 text boxes. Will send its data as an Extension Trigger within SAMMI instead of sending it to Bridge. 
- example2: 
  ```js 
  SAMMI.extCommand('Lucky Wheel', 3355443, 52, {
    color: ['Wheel Color', 18, 0, null, ['blue', 'yellow', 'green']],
    rewardName: ['Reward Name', 14, 'Your Reward name'],
    rewardImage: ['Reward Image', 23, 'image.png']
  })
  ``` 
  will create an extension command named Lucky wheel with one select box with options, one regular text box and one box to select an image file. Will send its data to Bridge. 


```js
SAMMI.triggerExt(trigger, pullData)
```
- `trigger` - name of the trigger
- `data` - object containing all trigger pull data (can contain objects, arrays etc.)
- example: `SAMMI.triggerExt('Test Trigger', {users:['cyanidesugar', 'Silverlink'], color: 'blue', number: 5})`

```js
SAMMI.triggerButton(id)
```
- Triggers a button
- `id` - button ID to trigger
- example: `SAMMI.triggerButton('ID1')`

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

```js
SAMMI.popUp(message)
```
- Send a popup message to SAMMI
- example: `SAMMI.popUp('Hello World!')`

```js
SAMMI.alert(message)
```
- Send an alert message to SAMMI
- example: `SAMMI.alert('Hello World!')`

```js
SAMMI.notification(message)
```
- Sends a notification (tray icon bubble) message to SAMMI
- example: `SAMMI.notification('Hello World!')`

```js
SAMMI.getDeckList()
```
- Request an array of all decks
- Replies with an array `["Deck1 Name","Unique ID",crc32,"Deck2 Name","Unique ID",crc32,...]`

```js
SAMMI.getDeck(id)
```
- Request a deck params
- provide `id` of the specified deck (retrieved from getDeckList command)
- example: `SAMMI.getDeck('20211221163402196200595')`

```js
SAMMI.getDeckStatus(id)
```
- Request current deck status (enabled/disabled)
- provide `id` of the specified deck (retrieved from getDeckList command)
- replies with either 0 (deck is disabled) or 1 (deck is enabled)
- example: `SAMMI.getDeckStatus('20211221163402196200595')`

```js
SAMMI.changeDeckStatus(id, status)
```
- Change deck status
- provide `id` of the specified deck (retrieved from getDeckList command)
- provide new `status` of the deck - 1 = enable, 0 = disable, 2 = toggle
- example: `SAMMI.changeDeckStatus('20211221163402196200595', 2)`

```js
SAMMI.getImage(fileName)
```
- Retrieve an image in base64
- `fileName` = image file without the path
- example: `SAMMI.getImage('test.png')`

```js
SAMMI.getSum(fileName)
```
- Retrieves CRC32 of a file
- `fileName` - file name without the path
- example: `SAMMI.getSum('test.png')`

```js
SAMMI.stayInformed(enabled)
```
- Set `enabled` to true to start receiving all deck and button updates and false to stop receiving them
- example: `SAMMI.stayInformed(true)`

```js
SAMMI.getActiveButtons()
```
- Retrieves all currently active buttons

```js
SAMMI.getModifiedButtons()
```
- Retrieves all currently modified buttons

```js
SAMMI.getTwitchList()
```
- Retrieves information for all linked Twitch accounts, including username, id, token etc.

```js
SAMMI.trigger(type, data)
```
- type - trigger number
    - 0 Twitch chat, 1 Twitch Sub, 2 Twitch Gift, 3 Twitch redeem, 4 Twitch Raid, 5 Twitch Bits, 6 Twitch Follower, 7 Hotkey, 8 Timer, 9 OBS Trigger, 10 SAMMI, 11 twitch moderation, 12 extension trigger
- data - whatever data is required for the trigger
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
- this is a very complex command and not recommended to use unless you know the exact payload you need to send

```js
SAMMI.close()
```
- Closes SAMMI connection to Bridge

```js
SAMMI.generateMessage()
```
- Generates a random message (used for test triggers)

## Listening to extension data received from SAMMI
In addition to hooks, you can also directly listen to a specified extension command coming from SAMMI.  
This way you can receive all extension data directly in your functions.   
Use `sammiclient.on()` or `sammiclient.addListener()` and `sammiclient.removeListener()`.  
For example, let's say your extension command is called Lucky Wheel:  
  ```js
  sammiclient.on('Lucky Wheel', (payload) => {
    // DO SOMETHING WITH THE EXTENSION PAYLOAD
    console.log(payload)
  });
  ```
You can also do: 
  ```js
 sammiclient.addListener('Lucky Wheel', functionToExecute)
  ```

*Note: These methods will not be available until after your Bridge connects to SAMMI. Make sure to wrap them in a function which you call in your Extension Commands section (which is initalized as soon as Bridge connects to SAMMI).*

## SAMMI Bridge Collaboration

SAMMI Bridge is generated by Jekyll. Each section is a separate file generated from `_includes` folder. If you wish to propose changes, please do so by editing these files.
Any changes will immediately reflect at https://sammi.solutions/SAMMI-Bridge/bridge.html. We also manually generate the Bridge file for each release, which can be found in `download` folder.

# Change log

## 5.05
Fixed bad auth token error for PubSub which happened when debug logging was enabled.

## 5.04
Debug Logging 
 - fixed undefined request names and ids shown in the log
 - Twitch tokens will show as *** for GetTwitchList replies to prevent accidentally exposing them
 
## 5.03
Fixed incorrect trigger type for Channel Points test trigger.

## 5.02
Cleaned up the code and fixed an array helper function. 

## 5.01
A lot has changed since the initial 5.00 version. Websocket protocol is now completely different and supports helper functions and promises. Testing buttons now work again too. 
