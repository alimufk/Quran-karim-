package com.example.alquran;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.media.AudioAttributes;
import android.media.AudioManager;
import android.media.MediaPlayer;
import android.os.Build;
import android.os.IBinder;
import android.os.PowerManager;
import androidx.core.app.NotificationCompat;

public class AdhanService extends Service {
    private MediaPlayer mediaPlayer;
    private PowerManager.WakeLock wakeLock;
    private static final String CHANNEL_ID = "adhan_alarm_channel_v2";

    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        createNotificationChannel();

        // جلب أيقونة التطبيق ديناميكياً لتجنب أخطاء البناء على GitHub
        int iconId = getResources().getIdentifier("ic_launcher", "mipmap", getPackageName());
        if (iconId == 0) {
            iconId = android.R.drawable.ic_lock_idle_alarm;
        }

        Notification notification = new NotificationCompat.Builder(this, CHANNEL_ID)
                .setContentTitle("الله أكبر - حان الآن وقت الصلاة 🕌")
                .setContentText("حي على الصلاة، حي على الفلاح")
                .setSmallIcon(iconId)
                .setPriority(NotificationCompat.PRIORITY_MAX)
                .setCategory(NotificationCompat.CATEGORY_ALARM)
                .setOngoing(true)
                .build();

        startForeground(1001, notification);

        PowerManager pm = (PowerManager) getSystemService(Context.POWER_SERVICE);
        if (pm != null) {
            wakeLock = pm.newWakeLock(
                    PowerManager.PARTIAL_WAKE_LOCK | PowerManager.ACQUIRE_CAUSES_WAKEUP,
                    "Adhan:ServiceWakeLock"
            );
            wakeLock.acquire(4 * 60 * 1000L);
        }

        try {
            if (mediaPlayer != null) {
                if (mediaPlayer.isPlaying()) mediaPlayer.stop();
                mediaPlayer.release();
                mediaPlayer = null;
            }

            int soundResId = getResources().getIdentifier("adhan1", "raw", getPackageName());
            if (soundResId != 0) {
                mediaPlayer = MediaPlayer.create(this, soundResId);

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
            } else {
                stopSelf();
            }
        } catch (Exception e) {
            e.printStackTrace();
            stopSelf();
        }

        return START_NOT_STICKY;
    }

    private void createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel(
                    CHANNEL_ID,
                    "تنبيهات الأذان",
                    NotificationManager.IMPORTANCE_HIGH
            );
            channel.setDescription("قناة تشغيل الأذان بأعلى أولوية");
            channel.setLockscreenVisibility(Notification.VISIBILITY_PUBLIC);
            NotificationManager manager = getSystemService(NotificationManager.class);
            if (manager != null) {
                manager.createNotificationChannel(channel);
            }
        }
    }

    @Override
    public void onDestroy() {
        if (mediaPlayer != null) {
            if (mediaPlayer.isPlaying()) mediaPlayer.stop();
            mediaPlayer.release();
            mediaPlayer = null;
        }
        if (wakeLock != null && wakeLock.isHeld()) {
            wakeLock.release();
        }
        super.onDestroy();
    }
}
