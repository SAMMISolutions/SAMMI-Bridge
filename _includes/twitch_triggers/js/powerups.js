async SAMMITestTwitchPowerups(form) {
  const [name, userID] = await getNameFromInput(form.elements.name);
  const amount = parseInt(form.elements.bitsamount.value, 10) || 50;
  const powerUpType = form.elements.poweruptype.value;
  let power_up;
  let message;
  switch (powerUpType) {
    case "gigantify":
      message = form.elements.powerupsmessage.value || SAMMI.generateMessage();
      power_up = {
        emote: {
          id: "301324829",
          name: "chrizz14Love",
        },
        type: "gigantify_an_emote",
        message_effect_id: null,
      };
      break;
    case "message_effect":
      message = form.elements.powerupsmessage.value || SAMMI.generateMessage();
      power_up = {
        emote: null,
        type: "message_effect",
        message_effect_id: "cosmic-abyss",
      };
      break;
    case "celebration":
      message = "";
      power_up = {
        emote: {
          id: "301324829",
          name: "chrizz14Love",
        },
        type: "celebration",
        message_effect_id: null,
      };
      break;
  }
  const pullData = {
    user_name: name.toLowerCase(),
    display_name: name,
    user_id: userID,
    amount,
    bits: amount,
    message,
    power_up,
  };
  sendTriggerToSAMMI(
    44,
    `${pullData.display_name} used ${amount} bits for a powerup! [test trigger]`, {
      amount
    },
    pullData
  );
}
