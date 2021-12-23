/** LB2 Helper Functions
* You can call them with LB.{helperfunction}
* Use promises if you want to get a reply back from LB
* No promise example: LB.setVariable(myVariable, 'some value', 'someButtonID')
* Promise example: LB.getVariable(myVariable, 'someButtonID').then(reply=>console.log(reply))
*/

function LBCommands() {
  const LBSendCommand = {
    /**
    * Get a variable from LB
    * @param {string} name - name of the variable
    * @param {string} buttonId - button ID for local variable, default = global variable
    */
    async getVariable(name, buttonId = 'global') {
      return sendToLB('GetVariable', { Variable: name, ButtonId: buttonId });
    },
    /**
    * Set a variable in LB
    * @param {string} name - name of the variable
    * @param {(string|number|object|array|null)} value - new value of the variable
    * @param {string} buttonId - button ID for local variable, default = global variable
    */
    async setVariable(name, value, buttonId = 'global') {
      return sendToLB('SetVariable', { Variable: name, Value: value, ButtonId: buttonId });
    },
    /**
    * Send a popup message to LB
    * @param {string} msg - message to send
    */
    async popUp(msg) {
      return sendToLB('PopupMessage', { Message: msg });
    },
    /**
    * Send a yellow notification message to LB
    * @param {string} msg - message to send
    */
    async alert(msg) {
      return sendToLB('AlertMessage', { Message: msg });
    },
    /**
    * send extension command to LB
    * @param {string} name - name of the extension command
    * @param {string} color - box color, accepts hex/dec colors (include # for hex), default 3355443
    * @param {string} height - height of the box in pixels, 52 for regular or 80 for resizable box, default 52
    * @param {Object} boxes
    * - one object per box, key = boxVariable, value = array of box params
    * - boxVariable = variable to save the box value under
    * - boxName = name of the box shown in the user interface
    * - boxType = type of the box, 0 = resizable, 2 = checkbox (true/false), 14 = regular box, 15 = variable box, 18 = select box, see extension guide for more
    * - defaultValue = default value of the variable
    * - (optional) sizeModifier = horizontal box size, 1 is normal
    * - (optional) [] selectOptions = array of options for the user to select (when using Select box type)
    * @param {[boxName: string, boxType: number, defaultValue: (string | number), sizeModifier: (number|undefined), selectOptions: Array|undefined]} boxes.boxVariable
    * */
    async extCommand(name, color = 3355443, height = 52, boxes) {
      const ext = new LBConstructExtCommand(name, color, height);
      for (const [key, value] of Object.entries(boxes)) {
        ext.addBox(key, value);
      }
      return sendToLB('SendExtensionCommands', { Data: [ext] });
    },
    /**
    * Close LioranBoard connection to Transmitter.
    */
    async close() {
      return sendToLB('Close');
    },
    /**
    * Get deck and button updates
    * @param {boolean} enabled - enable or disable updates
    */
    async stayInformed(enabled) {
      return sendToLB('SetStayInformed', { Enabled: enabled });
    },
    /**
    * Request an array of all decks
    * - Replies with an array ["Deck1 Name","Unique ID",crc32,"Deck2 Name","Unique ID",crc32,...]
    * - Use crc32 value to verify deck you saved localy is the same
    */
    async getDeckList() {
      return sendToLB('GetDeckList');
    },
    /**
    * Request a deck params
    * @param {string} id - Unique deck ID retrieved from getDeckList
    * - Replies with an object containing a full deck
    */
    async getDeck(id) {
      return sendToLB('GetDeck', { UniqueId: id });
    },
    /**
    * Retrieve an image in base64
    * @param {string} fileName - image file name without the path (image.png)
    * - Replies with an object containing the Base64 string of the image
    */
    async getImage(fileName) {
      return sendToLB('GetImage', { FileName: fileName });
    },
    /**
    * Retrieves CRC32 of a file
    * @param {string} fileName - file name without the path (image.png)
    */
    async getSum(fileName) {
      return sendToLB('GetSum', { Name: fileName });
    },
    /**
    * Retrieves all currently active buttons
    * - Replies with an array of button param objects
    */
    async getActiveButtons() {
      return sendToLB('GetOngoingButtons');
    },
    /**
    * Retrieves params of all linked Twitch accounts
    */
    async getTwitchList() {
      return sendToLB('GetTwitchList');
    },
    /**
    * Sends a trigger
    * @param {number} type - type of trigger
    * - trigger types: 0 Twitch chat, 1 Twitch Sub, 2 Twitch Gift, 3 Twitch redeem
    * 4 Twitch Raid, 5 Twitch Bits, 6 Twitch Follower, 7 Hotkey
    * 8 Timer, 9 OBS Trigger, 10 lioranboard, 11 twitch moderation, 12 extension trigger
    * @param {object} data - whatever data is required for the trigger, see manual
    */
    async trigger(type, data) {
      return sendToLB('SendTrigger', { Type: type, Data: data });
    },
    /**
    * Triggers a button
    * @param {string} id - button ID to trigger
    */
    async triggerButton(id) {
      return sendToLB('TriggerButton', { ButtonId: id });
    },
    /**
    * Releases a button
    * @param {string} id - button ID to trigger
    */
    async releaseButton(id) {
      return sendToLB('ReleaseButton', { ButtonId: id });
    },
    /**
    * Modifies a button
    * @param {string} id - button ID to trigger
    * @param {number|undefined} color - decimal button color (BGR)
    * @param {string|undefined} text - button text
    * @param {string|undefined} image - button image file name
    * @param {number|undefined} border - border size, 0-7
    * - leave parameters empty to reset button back to default values
    */
    async modifyButton(id, color, text = '', image, border) {
      return sendToLB('ModifyButton', {
        ButtonId: id,
        Data: {
          color : color || undefined, text : text || undefined, image: image || undefined, border : border || undefined,
        },
      });
    },
    /**
    * Retrieves all currently modified buttons
    * - object of button objects that are currently modified
    */
    async getModifiedButtons() {
      return sendToLB('GetModifications');
    },
    /**
    * Sends an extension trigger
    * @param {string} trigger - name of the trigger
    * @param {object} data - object containing all trigger pull data
    */
    async triggerExt(trigger, data = {}) {
      return sendToLB('ExtensionTrigger', { Trigger: trigger, Data: data });
    },
    /**
    * Deletes a variable
    * @param {string} name - name of the variable
    * @param {string} buttonId - button ID for local variable, default = global variable
    */
    async deleteVariable(name, buttonId = 'global') {
      return sendToLB('DeleteVariable', { Variable: name, ButtonId: buttonId });
    },
    /**
    * Insert an array value
    * @param {string} arrayName - name of the array
    * @param {number} index - index to insert the new item at
    * @param {string|number|object|array} value - item value
    * @param {string} buttonId - button id, default is global
    */
    async insertArray(arrayName, index, value, buttonId = 'global') {
      return sendToLB('InsertArrayValue', {
        Array: arrayName, Slot: slot, Value: value, ButtonId: buttonId,
      });
    },
    /**
    * Delete an array slot
    * @param {string} arrayName - name of the array
    * @param {number} index - index of the item to delete
    * @param {string} buttonId - button id, default is global
    */
    async deleteArray(arrayName, slot, buttonId = 'global') {
      return sendToLB('DeleteArraySlot', { Array: arrayName, Slot: slot, ButtonId: buttonId });
    },
    /**
    * Shows a message bubble from the tray icon
    * @param {string} msg - message to show
    */
    async notification(msg) {
      return sendToLB('NotificationMessage', { Message: msg });
    },
  };

  async function sendToLB(command, data) {
    const res = await lioranboardclient.send(command, data);
    return res;
  }

  // construct extension command object
  class LBConstructExtCommand {
    constructor(name, color, height) {
      let p = 0;
      this.name = name;
      this.color = color;
      this.height = height;
      this.addBox = (boxVar, params) => {
        this[`ud_t${p}`] = boxVar;
        this[`ud_n${p}`] = params[0];
        this[`ud${p}`] = params[1];
        this[`ud_d${p}`] = params[2];
        this[`ud_m${p}`] = params[3] || undefined;
        this[`ud_o${p}`] = params[4] || undefined;
        p += 1;
      };
    }
  }
  return LBSendCommand;
}
