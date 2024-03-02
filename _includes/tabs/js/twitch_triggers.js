// Fake Triggers testing
async function SAMMITestTriggers() {
  const processTrigger = {
    {% include twitch_triggers/js/follower.js %},
    {% include twitch_triggers/js/subscriber.js %},
    {% include twitch_triggers/js/subgift.js %},
    {% include twitch_triggers/js/bits.js %},
    {% include twitch_triggers/js/points.js %},
    {% include twitch_triggers/js/raid.js %},
    {% include twitch_triggers/js/predictions.js %},
    {% include twitch_triggers/js/polls.js %},
    {% include twitch_triggers/js/hypetrain.js %},
    {% include twitch_triggers/js/chat.js %},
    {% include twitch_triggers/js/shoutout.js %},
    {% include twitch_triggers/js/shoutout_receive.js %},
    {% include twitch_triggers/js/adbreak.js %},
    {% include twitch_triggers/js/stream.js %},
    {% include twitch_triggers/js/charity.js %}
  };

  class ConstructPullData {
    constructor(type) {
      const name = generateName();
      this.user_name = name[0].toLowerCase();
      this.display_name = type !== 'SAMMITestTwitchBits' ? name[0] : undefined;
      this.user_id = name[1];
      this.addvalues = (params) => {
        Object.assign(this, params);
      };
    }
  }

  const forms = document.querySelectorAll('.SAMMITestTriggers');
  Array.prototype.slice.call(forms).forEach((form) => {
    form.addEventListener(
      'submit',
      (e) => {
        e.preventDefault();
        const pullData = new ConstructPullData(form.id);
        processTrigger[form.id](form, pullData);
      },
      false,
    );
  });

  {% include twitch_triggers/helpers/getNameFromInput.js %}
  {% include twitch_triggers/helpers/getUserID.js %}
  {% include twitch_triggers/helpers/generateName.js %}
  {% include twitch_triggers/helpers/getRandomInt.js %}
  {% include twitch_triggers/helpers/splitNParts.js %}
  {% include twitch_triggers/helpers/twitchTimestamp.js %}
  {% include twitch_triggers/helpers/populateWithChoiceInfo.js %}
  {% include twitch_triggers/helpers/populateWithOutcomeInfo.js %}
  {% include twitch_triggers/helpers/generateUUID.js %}
  {% include helpers/sendTriggerToSAMMI.js %}

}
