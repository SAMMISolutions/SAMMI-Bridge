function twitchTimestamp(timestamp) {
    const date = new Date(timestamp);
    const isoString = date.toISOString();
    const formattedTimestamp = isoString.substring(0, 20) + isoString.substring(20, 23) + "000000Z";
    return formattedTimestamp;
}