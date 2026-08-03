package com.example.alquran;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.media.MediaPlayer;
import android.os.PowerManager;

public class AdhanReceiver extends BroadcastReceiver {
    @Override
    public void onReceive(Context context, Intent intent) {
        // إيقاظ الشاشة والهاتف فوراً عند حلول وقت الصلاة
        PowerManager pm = (PowerManager) context.getSystemService(Context.POWER_SERVICE);
        PowerManager.WakeLock wakeLock = null;
        if (pm != null) {
            wakeLock = pm.newWakeLock(PowerManager.FULL_WAKE_LOCK |
                    PowerManager.ACQUIRE_CAUSES_WAKEUP |
                    PowerManager.ON_AFTER_RELEASE, "QuranApp:AdhanWakeLock");
            wakeLock.acquire(30000); // إبقاء الشاشة مضاءة 30 ثانية
        }

        // تشغيل صوت الأذان المخزن محلياً
        try {
            int soundResId = context.getResources().getIdentifier("adhan", "raw", context.getPackageName());
            if (soundResId != 0) {
                MediaPlayer mediaPlayer = MediaPlayer.create(context, soundResId);
                if (mediaPlayer != null) {
                    mediaPlayer.start();
                }
            }
        } catch (Exception e) {
            e.printStackTrace;
        }
    }
}
