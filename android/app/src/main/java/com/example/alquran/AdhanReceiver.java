package com.example.alquran;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.media.AudioAttributes;
import android.media.MediaPlayer;
import android.net.Uri;
import android.os.PowerManager;
import android.util.Log;

public class AdhanReceiver extends BroadcastReceiver {
    private static MediaPlayer mediaPlayer;

    @Override
    public void onReceive(Context context, Intent intent) {
        Log.d("AdhanReceiver", "وصلت إشارة المنبه، جاري إيقاظ الهاتف وتشغيل الأذان...");

        // إيقاظ المعالج والشاشة فوراً
        PowerManager pm = (PowerManager) context.getSystemService(Context.POWER_SERVICE);
        PowerManager.WakeLock wakeLock = null;
        if (pm != null) {
            wakeLock = pm.newWakeLock(
                PowerManager.PARTIAL_WAKE_LOCK | PowerManager.ACQUIRE_CAUSES_WAKEUP,
                "QuranApp:AdhanWakeLock"
            );
            wakeLock.acquire(5 * 60 * 1000L); // 5 دقائق كحد أقصى
        }

        try {
            if (mediaPlayer != null) {
                if (mediaPlayer.isPlaying()) mediaPlayer.stop();
                mediaPlayer.release();
                mediaPlayer = null;
            }

            int soundResId = context.getResources().getIdentifier("adhan", "raw", context.getPackageName());
            if (soundResId != 0) {
                Uri soundUri = Uri.parse("android.resource://" + context.getPackageName() + "/" + soundResId);
                mediaPlayer = new MediaPlayer();
                mediaPlayer.setAudioAttributes(
                    new AudioAttributes.Builder()
                        .setUsage(AudioAttributes.USAGE_ALARM)
                        .setContentType(AudioAttributes.CONTENT_TYPE_MUSIC)
                        .build()
                );
                mediaPlayer.setDataSource(context, soundUri);
                mediaPlayer.prepare();
                mediaPlayer.start();

                final PowerManager.WakeLock wl = wakeLock;
                mediaPlayer.setOnCompletionListener(mp -> {
                    if (wl != null && wl.isHeld()) {
                        wl.release();
                    }
                    mp.release();
                    mediaPlayer = null;
                });
            } else {
                Log.e("AdhanReceiver", "خطأ: لم يتم العثور على ملف adhan في مجلد res/raw!");
            }
        } catch (Exception e) {
            Log.e("AdhanReceiver", "خطأ أثناء تشغيل الأذان: " + e.getMessage());
        }
    }
}
