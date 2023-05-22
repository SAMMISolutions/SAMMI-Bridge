async SAMMITestTwitchShoutout(form) {
    const [name, userID] = await getNameFromInput(form.elements.name);
    const pullData = {
      id: '33426a33-0454-4e00-a9ad-4ee5ca74d75d',
      user_name: name.toLowerCase(),
      display_name: name,
      user_id: userID,
      name_color: '',
      picture_url: 'https://static-cdn.jtvnw.net/user-default-pictures-uv/dbdc9198-def8-11e9-8681-784f43822e80-profile_image-300x300.png',
      recent_categories: '',
    };
    sendTriggerToSAMMI(
      28,
      `Shoutout to ${pullData.display_name}! [test trigger]`,
      {},
      pullData,
    );
  }
  