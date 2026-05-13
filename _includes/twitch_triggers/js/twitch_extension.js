        async SAMMITestTwitchExtension(form) {
          const [name, userID] = await getNameFromInput(form.elements.name);
          const redemptionNames = [
'🎙️ Voicechanger',
'🌈 Rainbow Overlay',
'❄️ Freeze Frame',
'📺 VHS Filter',
'🐸 Meme Drop',
'📣 Shoutout Blast',
'👑 VIP Moment',
'⏱️ Add Timer',
'📢 TTS Message',
'📝 On-Screen Note',
'🎮 Game Challenge',
'🕹️ Random Input',
'🛑 Stop Everything',
'🎛️ Random Filter',
'🧍 Big Face Cam',
'🔍 Zoom Face Cam',
'🫥 Hide Camera',
'📷 Swap Camera',
'💬 Speech Bubble',
'🧃 Drink Reminder',
'🐾 Pet The Streamer',
'⚙️ Trigger Random Button',
'🎰 Slot Event',
'🎡 Spin The Wheel',
'🗳️ Start Poll'
          ];
          const amountInput = parseFloat(form.elements.twitchExtensionAmount.value);
          const amount = isNaN(amountInput) ? 100 : Math.min(Math.max(amountInput, 0), 999);
          const redemptionName = form.elements.twitchExtensionRedemptionName.value ||
            redemptionNames[getRandomInt(0, redemptionNames.length - 1)];
          const triggerName = form.elements.twitchExtensionTriggerName.value || redemptionName;
          const pullData = {
            extension_user_id: 'ABCDEFG123456789',
            broadcaster_user_id: window.defaultTwitchUser.user_id,
            redemption_name: redemptionName,
            redeemed_at: new Date().toISOString(),
            display_name: name,
            user_name: name.toLowerCase(),
            amount,
            trigger_name: triggerName,
            trigger_type: 48,
            real_user_id: userID,
          };
          sendTriggerToSAMMI(
            48,
            `Twitch Extension: ${triggerName} [test trigger]`, {
              trigger: triggerName,
              user_name: pullData.user_name,
              redemption_name: redemptionName,
            },
            pullData,
          );
        }
