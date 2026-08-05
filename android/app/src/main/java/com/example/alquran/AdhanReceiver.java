package com.example.alquran;

import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.media.AudioAttributes;
import android.media.MediaPlayer;
import android.net.Uri;
import android.os.Build;
import android.os.PowerManager;
import android.util.Log;
import androidx.core.app.NotificationCompat;

public class AdhanReceiver extends BroadcastReceiver {
    private static MediaPlayer mediaPlayer;

    @Override
    public void onReceive(Context context, Intent intent) {
        Log.d("AdhanReceiver", "تم استقبال إشارة الأذان!");

        // 1. إيقاظ الشاشة والمعالج
        PowerManager pm = (PowerManager) context.getSystemService(Context.POWER_SERVICE);
        PowerManager.WakeLock wakeLock = null;
        if (pm != null) {
            wakeLock = pm.newWakeLock(
                PowerManager.PARTIAL_WAKE_LOCK | PowerManager.ACQUIRE_CAUSES_WAKEUP,
                "QuranApp:AdhanWakeLock"
            );
            wakeLock.acquire(3 * 60 * 1000L); // إيقاظ لمدّة 3 دقائق
        }

        // 2. إنشاء قناة الإشعارات وبناء الإشعار المرئي (Heads-up Notification)
        String channelId = "adhan_alarm_channel_v2";
        NotificationManager notificationManager = (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel(
                channelId,
                "تنبيهات الأذان والصلاة",
                NotificationManager.IMPORTANCE_HIGH
            );
            channel.setDescription("إشعارات بصوت الأذان عند حلول وقت الصلاة");
            channel.enableVibration(true);
            channel.setLockscreenVisibility(NotificationCompat.VISIBILITY_PUBLIC);
            if (notificationManager != null) {
                notificationManager.createNotificationChannel(channel);
            }
        }

        // إعداد فتح التطبيق عند النقر على الإشعار
        Intent openAppIntent = new Intent(context, MainActivity.class);
        openAppIntent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP);
        int pendingFlags = PendingIntent.FLAG_UPDATE_CURRENT;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            pendingFlags |= PendingIntent.FLAG_IMMUTABLE;
        }
        PendingIntent pendingIntent = PendingIntent.getActivity(context, 0, openAppIntent, pendingFlags);

        // بناء الإشعار الظاهر على الشاشة
        NotificationCompat.Builder builder = new NotificationCompat.Builder(context, channelId)
            .setSmallIcon(android.R.drawable.ic_lock_idle_alarm)
            .setContentTitle("الله أكبر - حان الآن وقت الصلاة")
            .setContentText("حي على الصلاة، حي على الفلاح")
            .setPriority(NotificationCompat.PRIORITY_MAX)
            .setCategory(NotificationCompat.CATEGORY_ALARM)
            .setVisibility(NotificationCompat.VISIBILITY_PUBLIC)
            .setAutoCancel(true)
            .setContentIntent(pendingIntent);

        if (notificationManager != null) {
            notificationManager.notify(8888, builder.build());
        }

        // 3. تشغيل صوت الأذان
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
                Log.e("AdhanReceiver", "لم يتم العثور على ملف adhan في res/raw");
            }
        } catch (Exception e) {
            Log.e("AdhanReceiver", "خطأ أثناء تشغيل الأذان: " + e.getMessage());
        }
    }
}
