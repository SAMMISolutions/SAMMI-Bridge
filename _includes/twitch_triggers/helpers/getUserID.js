async function getUserID(username) {
    const defaultID = 76159058;
    const response = await fetch(`https://decapi.me/twitch/id/${username}`)
      .catch(() => { throw defaultID; });
    const tryToGetID = await response.text();
    if (tryToGetID.indexOf('User not found') === -1) return tryToGetID;
    return defaultID;
  }