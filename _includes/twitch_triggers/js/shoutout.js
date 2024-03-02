async SAMMITestTwitchShoutout(form) {
    const [name, userID] =  await getNameFromInput(form.elements.name)
    const pullData = {
      id: '33426a33-0454-4e00-a9ad-4ee5ca74d75d',
      user_name: name.toLowerCase(),
      display_name: name,
      user_id: userID,
      picture_url: 'https://static-cdn.jtvnw.net/user-default-pictures-uv/dbdc9198-def8-11e9-8681-784f43822e80-profile_image-300x300.png',
      started_at: twitchTimestamp(Date.now()),
      target_cooldown_ends_at: twitchTimestamp(Date.now() + 1000 * 60 * 60),
      cooldown_ends_at: twitchTimestamp(Date.now() + 1000 * 60 * 2),
      moderator_user_name: 'testmod',
      moderator_display_name: 'TestMod',
      moderator_user_id: '123456789',
      viewer_count: getRandomInt(1, 1000),
    };
    sendTriggerToSAMMI(
      28,
      `Shoutout to ${pullData.display_name}! [test trigger]`,
      {},
      pullData,
    );
  }
  