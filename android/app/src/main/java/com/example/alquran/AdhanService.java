try {
    if (mediaPlayer != null) {
        if (mediaPlayer.isPlaying()) mediaPlayer.stop();
        mediaPlayer.release();
        mediaPlayer = null;
    }

    int soundResId = getResources().getIdentifier("adhan1", "raw", getPackageName());
    
    if (soundResId != 0) {
        // تشغيل صوت الأذان المخصص
        mediaPlayer = MediaPlayer.create(this, soundResId);
    } else {
        // ⚠️ صوت احتياطي: إذا لم يجد adhan1.mp3 سيرن بصوت منبه النظام الإجباري
        android.net.Uri defaultAlarmUri = android.media.RingtoneManager.getDefaultUri(android.media.RingtoneManager.TYPE_ALARM);
        mediaPlayer = new MediaPlayer();
        mediaPlayer.setDataSource(this, defaultAlarmUri);
        mediaPlayer.prepare();
    }

    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
        mediaPlayer.setAudioAttributes(
                new AudioAttributes.Builder()
                        .setUsage(AudioAttributes.USAGE_ALARM)
                        .setContentType(AudioAttributes.CONTENT_TYPE_MUSIC)
                        .build()
        );
    } else {
        mediaPlayer.setAudioStreamType(AudioManager.STREAM_ALARM);
    }

    AudioManager audioManager = (AudioManager) getSystemService(Context.AUDIO_SERVICE);
    if (audioManager != null) {
        int maxVol = audioManager.getStreamMaxVolume(AudioManager.STREAM_ALARM);
        audioManager.setStreamVolume(AudioManager.STREAM_ALARM, maxVol, 0);
    }

    mediaPlayer.setOnCompletionListener(mp -> stopSelf());
    mediaPlayer.start();
} catch (Exception e) {
    e.printStackTrace();
    stopSelf();
}
