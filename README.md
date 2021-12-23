# LB-Transmitter
 Current version of Transmitter for LioranBoard 2 . Download the latest release. This version will NOT work with LioranBoard 1.

## change log since the initial 5.00 version

## 5.00 version

### For users
Twitch Triggers allow you to test all available Twitch triggers by sending fake payload to LioranBoard 2.  
It works exactly the same as in LioranBoard 1.  
Main changes:  
- Can now send Follower trigger.  
- Can select founder badge and first time for chat message. 
- User ID pull values are now dynamically generated. 
- Channel points redeem and reward ID is also dynamically generated. 
 
### For extension devs
Transmitter uses LioranBoard websocket library to make sending and receiving data easier: https://github.com/LioranBoard/LioranBoard-2-Websocket. 
You can use promises for sending data to LioranBoard. Message ids are generated automatically. 

`lioranboardclient.send(command, data).then(response=>console.log(response))`

#### Helper functions
You can call all helper functions with `LB.method(arguments)`. 
To use promises, you can call them with `LB.method(arguments).then(response=>console.log(response))`. 
All methods are documented inside Transmitter via JSDoc.

`LB.getVariable(name, buttonId = 'global')`
- Get a variable
- specify its button id or leave empty for global variables
- example: `LB.getVariable('myVariable', 'ID1')`

`LB.setVariable(name, value, buttonId = 'global')`
- Set a variable
- specify its button id or leave empty to create global variables
- example: `LB.setVariable('myVariable', 'Hello World', 'ID1')`

`LB.deleteVariable(name, buttonId = 'global')`
- Delete a variable
- specify its button id or leave empty to create global variables
- example: `LB.deleteVariable('myVariable', 'ID1')`

`LB.insertArray(arrayName, index, value, buttonId = 'global')`
- Inserts an item to a specified index in an array, shifting the other items
- `arrayName` - name of the array
- `index` - index to insert the new item at
- `value` - item value
- `buttonId` - button id, default is global
- example: `LB.insertArray('myArray',0,'Hello','ID1')`

`LB.deleteArray(arrayName, slot, buttonId = 'global')`
- Deletes an item in a specified index in an array, shifting the other items
- `arrayName` - name of the array
- `index` - index to delete the item at
- `buttonId` - button id, default is global
- example: `LB.deleteArray('myArray',1,'ID1')`

`LB.extCommand(name, color = 3355443, height = 52, boxes)`
- Send an extension command (to create extension boxes) to LB 
- `name` = name of the extension command 
- `color` box color, accepts dec colors
- `height` - height of the box in pixels, you can use 52 for regular box or 80 for resiable box
- `boxes` - an object containing box objects (its key is box variable and value is an array of box params)
    - `boxVariable: [boxName, boxType, defaultValue, (optional)sizeModifier, (optional)selectOptions]`
    - boxVariable = variable to save the box value under 
    - boxName = name of the box shown in the user interface
    - boxType
        - 0 = Resizable text box that allow for newline,ud_d can be anything
        - 2 = Check box, ud_d should be set to true or false or it will crash, will always return true or false when triggered
        - 7 = keyboard button, ud_d should be 0, shouldn't really need this but this will send over a select key code
        - 8 = compare box, ud_d should be "==", returns a string from the compare box such as == or >=
        - 9 = math box, ud_d should be "=", return a string from the compare box such as = or +=
        - 10 = sound path box, ud_d should be "", return a path to said sound effect select
        - 11 = slider 0 to 100%, ud_d should be 0-1, will return a float 0 to 1
        - 14 = normal white box, ud_d can be anything if you want just normal 
        - 15 = Variable box(yellow box), ud_d should be a string, will return whatever variable is in the yellow box
        - 17 = color box, ud_d should be a number, will return the selected color
        - 18 = select box, ud_d should be 0, will show a list when click, of what you defined in ud_oX, will return a number, if user select 3rd option, it will return 2
        - 19 = select box string, ud_d should be a string, will return whatever string the user selected.
        - 20 = select box string typeable, ud_d should be a string,  will return whatever the user selected or typed in the box
        - 22 = file path, ud_d should be a string
        - 23 = image path, ud_d should be a string
    - defaultValue = default value of the variable
    - (optional) sizeModifier = horizontal box size, 1 is normal
    - (optional) [] selectOptions = array of options for the user to select (when using Select box type)
- example: `LB.extCommand('Lucky Wheel', 3355443, 52, { rewardName: ['Reward Name', 14, 'Some Reward name'], rewardName2: ['Reward Name 2', 14, 'And another reward name'] })` will create an extension command named Lucky Wheel with 2 text boxes. 
- example2: `LB.extCommand('Lucky Wheel', 3355443, 52, { color: ['Wheel Color', 18, '', null, ['blue','yellow','green']], rewardName: ['Reward Name', 14, 'Your Reward name'], rewardImage: ['Reward Image', 23, 'image.png'] })`  will create an extension command named Lucky wheel with one regular text box, one select box with options and one box to select an image file. 

`LB.triggerExt(trigger, pullData)`
- `trigger` - name of the trigger
- `data` - object containing all trigger pull data (can contain objects, arrays etc.)
- example: `LB.triggerExt('Test Trigger', {users:['Lioran', 'Melonax'], color: 'blue', number: 5})`

`LB.triggerButton(id)`
- Triggers a button
- `id` - button ID to trigger
- example: `LB.triggerButton('ID1')`

`LB.modifyButton(id, color, text, image, border)`
- Modifies a button appearance temporarily
- `id` - button ID to modify
- `color` - decimal button color (BGR)
- `text` - button text
-  `image` - button image file name
- `border` - border size, 0-7
- leave parameters empty to reset button back to default values
- example: `LB.modifyButton('ID1', 4934525, 'Hello', 'buttonImage.png', 5)`

`LB.popUp(message)`
- Send a popup message to LB
- example: `LB.popUp('Hello World!')`

`LB.alert(message)`
- Send an alert message to LB
- example: `LB.alert('Hello World!')`

`LB.notification(message)`
- Sends a notification (tray icon bubble) message to LB
- example: `LB.notification('Hello World!')`

`LB.getDeckList()`
- Request an array of all decks
- Replies with an array `["Deck1 Name","Unique ID",crc32,"Deck2 Name","Unique ID",crc32,...]`

`LB.getDeck(id)`
- Request a deck params
- provide `id` of the specified deck (retrieved from getDeckList command)
- example: `LB.getDeck('20211221163402196200595')`

`LB.getImage(fileName)`
- Retrieve an image in base64
- `fileName` = image file without the path
- example: `LB.getImage('test.png')`

`LB.getSum(fileName)`
- Retrieves CRC32 of a file
- `fileName` - file name without the path
- example: `LB.getSum('test.png')`

`LB.stayInformed(enabled)`
- Set `enabled` to true to start receiving all deck and button updates and false to stop receiving them
- example: `LB.stayInformed(true)`

`LB.getActiveButtons()`
- Retrieves all currently active buttons

`LB.getModifiedButtons()`
- Retrieves all currently modified buttons

`LB.getTwitchList()`
- Retrieves params of all linked Twitch accounts

`LB.trigger(type, data)`
- type - trigger number
    - 0 Twitch chat, 1 Twitch Sub, 2 Twitch Gift, 3 Twitch redeem, 4 Twitch Raid, 5 Twitch Bits, 6 Twitch Follower, 7 Hotkey, 8 Timer, 9 OBS Trigger, 10 lioranboard, 11 twitch moderation, 12 extension trigger
- data - whatever data is required for the trigger
- example for chat message trigger: `LB.trigger(0, { message : 'Hello World', broadcaster: 1, moderator: 0, sub: 0, vip: 0, founder: 0, trigger_data: { user_name: 'lioran', display_name: 'Lioran', user_id: 123456789, message : 'Hello World!', emote_list: '304822798:0-9/304682444:11-19', badge_list: 'subscriber/1', channel : 123456789, name_color: '#189A8D', first_time: 0 }})`
- this is a very complex command and not recommended to use unless you know the exact payload you need to send

`LB.close()`
- Closes LB connection to Transmitter

## Listening to extension data received from LioranBoard
Instead of using hooks (like in the old LB), you can directly listen to a specified extension payload coming from LioranBoard.  
This way you can receive all extension data directly in your running functions.   
Use `lioranboard.on(extensionName)`.  
For example, let's say your extension is called Lucky Wheel:  
  ```
  lioranboardclient.on('Lucky Wheel', (payload) => {
    DO SOMETHING WITH THE EXTENSION PAYLOAD
    console.log(payload)
  });
  ```
## Transmitter Collaboration

Transmitter is generated by Jekyll. Each section is a separate file generated from `_includes` folder. If you wish to propose changes, please do so by editing these files.
Any changes will immediately reflect at http://lioranboard.ca/LioranBoard-2-Transmitter/tsl_transmitter.html. I also manually generate the Transmitter file for each release, which can be found in `download` folder.
