/** SAMMI Core Helper Functions
 * You can call them with SAMMI.{helperfunction}
 * Use promises if you want to get a reply back from SAMMI
 * No promise example: SAMMI.setVariable(myVariable, 'some value', 'someButtonID')
 * Promise example: SAMMI.getVariable(myVariable, 'someButtonID').then(reply=>console.log(reply))
 */
function SAMMICommands() {
  const SendCommand = {
    /**
     * Get a variable from SAMMI
     * @param {string} name - name of the variable
     * @param {string} buttonId - button ID for local variable, default = global variable
     */
    async getVariable(name = '', buttonId = 'global') {
      return sendToSAMMI('GetVariable', {
        Variable: name,
        ButtonId: buttonId,
      });
    },

    /**
     * Set a variable in SAMMI
     * @param {string} name - name of the variable
     * @param {(string|number|object|array|null)} value - new value of the variable
     * @param {string} buttonId - button ID for local variable, default = global variable
     */
    async setVariable(name = '', value = '', buttonId = 'global') {
      return sendToSAMMI('SetVariable', {
        Variable: name,
        Value: value,
        ButtonId: buttonId,
      });
    },

    /**
     * Send a popup message to SAMMI
     * @param {string} msg - message to send
     */
    async popUp(msg = '') {
      return sendToSAMMI('PopupMessage', {
        Message: msg,
      });
    },

    /**
     * Send a yellow notification message to SAMMI
     * @param {string} msg - message to send
     */
    async alert(msg = '') {
      return sendToSAMMI('AlertMessage', {
        Message: msg,
      });
    },

    /**
     * send extension command to SAMMI
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
    async extCommand(name = '', color = 3355443, height = 52, boxes = {}, triggerButton = false) {
      const ext = new SammiConstructExtCommand(name, color, height, triggerButton);

      for (const [key, value] of Object.entries(boxes)) {
        ext.addBox(key, value);
      }

      return sendToSAMMI('SendExtensionCommands', {
        Data: [ext],
      });
    },

    /**
     * Close SAMMI Bridge connection to SAMMI Core.
     */
    async close() {
      return sendToSAMMI('Close');
    },

    /**
     * Get deck and button updates
     * @param {boolean} enabled - enable or disable updates
     */
    async stayInformed(enabled) {
      return sendToSAMMI('SetStayInformed', {
        Enabled: enabled,
      });
    },

    /**
     * Request an array of all decks
     * - Replies with an array ["Deck1 Name","Unique ID",crc32,"Deck2 Name","Unique ID",crc32,...]
     * - Use crc32 value to verify deck you saved localy is the same
     */
    async getDeckList() {
      return sendToSAMMI('GetDeckList');
    },

    /**
     * Request a deck params
     * @param {string} id - Unique deck ID retrieved from getDeckList
     * - Replies with an object containing a full deck
     */
    async getDeck(id = 0) {
      return sendToSAMMI('GetDeck', {
        UniqueId: id,
      });
    },

    /**
     * Get deck status
     * - Replies with either 0 (deck is disabled) or 1 (deck is enabled)
     * @param {string} id - Unique deck ID retrieved from getDeckList
     */
    async getDeckStatus(deckID = 0) {
      return sendToSAMMI('getDeckStatus', {
        deckID,
      });
    },

    /**
     * Change deck status
     * @param {string} id - Unique deck ID retrieved from getDeckList
     * @param {int} status - New deck status, 0 = disable, 1 = enable, 2 = toggle
     */
    async changeDeckStatus(deckID = 0, status = 1) {
      return sendToSAMMI('changeDeckStatus', {
        deckID,
        status,
      });
    },

    /**
     * Retrieve an image in base64
     * @param {string} fileName - image file name without the path (image.png)
     * - Replies with an object containing the Base64 string of the image
     */
    async getImage(fileName = '') {
      return sendToSAMMI('GetImage', {
        FileName: fileName,
      });
    },

    /**
     * Retrieves CRC32 of a file
     * @param {string} fileName - file name without the path (image.png)
     */
    async getSum(fileName = '') {
      return sendToSAMMI('GetSum', {
        Name: fileName,
      });
    },

    /**
     * Retrieves all currently active buttons
     * - Replies with an array of button param objects
     */
    async getActiveButtons() {
      return sendToSAMMI('GetOngoingButtons');
    },

    /**
     * Retrieves params of all linked Twitch accounts
     */
    async getTwitchList() {
      return sendToSAMMI('GetTwitchList');
    },

    /**
     * Sends a trigger
     * @param {number} type - type of trigger
     * - trigger types: 0 Twitch chat, 1 Twitch Sub, 2 Twitch Gift, 3 Twitch redeem
     * 4 Twitch Raid, 5 Twitch Bits, 6 Twitch Follower, 7 Hotkey
     * 8 Timer, 9 OBS Trigger, 10 SAMMI Bridge, 11 twitch moderation, 12 extension trigger
     * @param {object} data - whatever data is required for the trigger, see manual
     */
    async trigger(type = -1, data = { trigger_data: {} }) {
      return sendToSAMMI('SendTrigger', {
        Type: type,
        Data: data,
      });
    },

    /**
     * Sends a test trigger that will automatically include channel ID for from_channel_id pull value
     * @param {number} type - type of trigger
     * - trigger types: 0 Twitch chat, 1 Twitch Sub, 2 Twitch Gift, 3 Twitch redeem
     * 4 Twitch Raid, 5 Twitch Bits, 6 Twitch Follower, 7 Hotkey
     * 8 Timer, 9 OBS Trigger, 10 SAMMI Bridge, 11 twitch moderation, 12 extension trigger
     * @param {object} data - whatever data is required for the trigger, see manual
     */
    async testTrigger(type, data) {
      return sendToSAMMI('SendTestTrigger', {
        Type: type,
        Data: data,
      });
    },

    /**
     * Triggers a button
     * @param {string} id - button ID to trigger
     */
    async triggerButton(id = '') {
      return sendToSAMMI('TriggerButton', {
        ButtonId: id,
      });
    },

    /**
     * Releases a button
     * @param {string} id - button ID to release
     */
    async releaseButton(id = '') {
      return sendToSAMMI('ReleaseButton', {
        ButtonId: id,
      });
    },

    /**
     * Modifies a button
     * @param {string} id - button ID to modify
     * @param {number|undefined} color - decimal button color (BGR)
     * @param {string|undefined} text - button text
     * @param {string|undefined} image - button image file name
     * @param {number|undefined} border - border size, 0-7
     * - leave parameters empty to reset button back to default values
     */
    async modifyButton(id, color, text = '', image, border) {
      return sendToSAMMI('ModifyButton', {
        ButtonId: id,
        Data: {
          color: color || undefined,
          text: text || undefined,
          image: image || undefined,
          border: border || undefined,
        },
      });
    },

    /**
     * Retrieves all currently modified buttons
     * - object of button objects that are currently modified
     */
    async getModifiedButtons() {
      return sendToSAMMI('GetModifications');
    },

    /**
     * Sends an extension trigger
     * @param {string} trigger - name of the trigger
     * @param {object} dats - object containing all trigger pull data
     */
    async triggerExt(trigger = '', data = {}) {
      return sendToSAMMI('ExtensionTrigger', {
        Trigger: trigger,
        Data: data,
      });
    },

    /**
     * Deletes a variable
     * @param {string} name - name of the variable
     * @param {string} buttonId - button ID for local variable, default = global variable
     */
    async deleteVariable(name = '', buttonId = 'global') {
      return sendToSAMMI('DeleteVariable', {
        Variable: name,
        ButtonId: buttonId,
      });
    },

    /**
     * Inserts an array value
     * @param {string} arrayName - name of the array
     * @param {number} index - index to insert the new item at
     * @param {string|number|object|array} value - item value
     * @param {string} buttonId - button id, default is global
     */
    async insertArray(arrayName = '', index = 0, value = '', buttonId = 'global') {
      return sendToSAMMI('InsertArrayValue', {
        Array: arrayName,
        Slot: index,
        Value: value,
        ButtonId: buttonId,
      });
    },

    /**
     * Deletes an array value at specified index
     * @param {string} arrayName - name of the array
     * @param {number} index - index of the item to delete
     * @param {string} buttonId - button id, default is global
     */
    async deleteArray(arrayName = '', slot = 0, buttonId = 'global') {
      return sendToSAMMI('DeleteArraySlot', {
        Array: arrayName,
        Slot: slot,
        ButtonId: buttonId,
      });
    },

    /**
     * Sends a notification (tray icon bubble) message to SAMMI
     * @param {string} msg - message to show
     */
    async notification(msg = '') {
      return sendToSAMMI('NotificationMessage', {
        Message: msg,
      });
    },
    generateMessage() {
      const messages = [
        'All that glitters is not gold. Fair is foul, and foul is fair Hover through the fog and filthy air. These violent delights have violent ends. Hell is empty and all the devils are here. By the pricking of my thumbs, Something wicked this way comes. Open, locks, Whoever knocks!',
        'Hello World!',
        "Alright, I'll be honest with ya, Bob. My name's not Kirk. It's Skywalker. Luke Skywalker.",
        'Well, that never happened in any of the simulations.',
        'You know, you blow up one sun and suddenly everyone expects you to walk on water.',
        "How's a needle in my butt gonna get water out of my ears?",
        'If you immediately know the candle light is fire, then the meal was cooked a long time ago.',
        'In the middle of my backswing!?',
        'If I am to remain in this body, I must shave my head.',
        "I remembered something. There's a man. He is bald and wears a short sleeve shirt. And somehow, he is important to me… I think his name is… Homer.",
        'Alright, we came here in peace, we expect to go in one... piece.',
        'It costs nearly a billion dollars just to turn the lights on around here',
        "You wouldn't believe the things you can make from the common, simple items lying around your planet... which reminds me, you're going to need a new microwave.",
        'Welcome, ye knights of the round table, men of honor, followers of the path of righteousness. Only those with wealth of knowledge and truth of spirit shall be given access to the underworld, the storehouse of riches of Ambrosius Aurelianus. Prove ye worthy, and all shall be revealed.',
      ];
      const randomMessage = messages[Math.floor(Math.random() * messages.length)];
      return randomMessage;
    },
  };

  async function sendToSAMMI(command, data) {
    const res = await sammiclient.send(command, data);
    return res;
  } // construct extension command object

  class SammiConstructExtCommand {
    constructor(name, color, height, triggerButton = false) {
      let p = 0;
      this.name = name;
      this.color = color;
      this.height = height;
      this.triggerButton = triggerButton;

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

  return SendCommand;
}
