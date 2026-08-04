package com.example.alquran;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.media.AudioAttributes;
import android.media.MediaPlayer;
import android.os.PowerManager;

public class AdhanReceiver extends BroadcastReceiver {
    private static MediaPlayer mediaPlayer;

    @Override
    public void onReceive(Context context, Intent intent) {
        // 1. إيقاظ المعالج والشاشة فوراً
        PowerManager pm = (PowerManager) context.getSystemService(Context.POWER_SERVICE);
        PowerManager.WakeLock wakeLock = null;
        if (pm != null) {
            wakeLock = pm.newWakeLock(
                PowerManager.FULL_WAKE_LOCK |
                PowerManager.ACQUIRE_CAUSES_WAKEUP |
                PowerManager.ON_AFTER_RELEASE, 
                "QuranApp:AdhanWakeLock"
            );
            wakeLock.acquire(3 * 60 * 1000L); // إبقاء الهاتف مستيقظاً لمدة 3 دقائق
        }

        // 2. تشغيل ملف الصوت adhan.mp3 كاملاً بصوت المنبه
        try {
            if (mediaPlayer != null) {
                if (mediaPlayer.isPlaying()) mediaPlayer.stop();
                mediaPlayer.release();
                mediaPlayer = null;
            }

            int soundResId = context.getResources().getIdentifier("adhan", "raw", context.getPackageName());
            if (soundResId != 0) {
                mediaPlayer = MediaPlayer.create(context, soundResId);
                if (mediaPlayer != null) {
                    mediaPlayer.setAudioAttributes(
                        new AudioAttributes.Builder()
                            .setUsage(AudioAttributes.USAGE_ALARM)
                            .setContentType(AudioAttributes.CONTENT_TYPE_MUSIC)
                            .build()
                    );
                    mediaPlayer.start();
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
