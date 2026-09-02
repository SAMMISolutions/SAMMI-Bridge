function ytLiveTestUserBanned(pullData) {
  const bannedName = document.getElementById('YTLiveBannedUserName').value || 'Banned User';
  const duration = parseInt(document.getElementById('YTLiveBanDuration').value, 10) || 0;
  const bannedUserId = `UC${generateYouTubeTestId().replaceAll('-', '').slice(-20)}`;
  pullData.addvalues({
    chat_id: 'e5LT2xEURi9BQzf2rLe5eB3325081929219850',
    message_id: generateYouTubeTestId(),
    moderator_display_name: pullData.display_name,
    moderator_user_id: pullData.user_id,
    moderator_channel_url: `https://www.youtube.com/channel/${pullData.user_id}`,
    moderator_picture_url: pullData.picture_url,
    banned_display_name: bannedName,
    banned_user_id: bannedUserId,
    banned_channel_url: `https://www.youtube.com/channel/${bannedUserId}`,
    banned_picture_url: 'https://yt3.ggpht.com/ytc/AIdro_kTestUser',
    ban_type: duration > 0 ? 'temporary' : 'permanent',
    ban_duration_seconds: duration,
  });
  sendTriggerToSAMMI(55, `YouTube User Banned [test trigger]: ${bannedName}`, {}, pullData);
}
