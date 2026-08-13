package com.example.alquran;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.media.AudioAttributes;
import android.media.AudioManager;
import android.media.MediaPlayer;
import android.media.RingtoneManager;
import android.net.Uri;
import android.os.Build;
import android.os.PowerManager;
import androidx.core.app.NotificationCompat;

public class AdhanReceiver extends BroadcastReceiver {
    private static final String CHANNEL_ID = "adhan_alarm_channel_v3";
    private static final String ATHKAR_CHANNEL_ID = "athkar_alarm_channel_v1";
    private static MediaPlayer staticMediaPlayer;

    @Override
    public void onReceive(Context context, Intent intent) {
        PowerManager pm = (PowerManager) context.getSystemService(Context.POWER_SERVICE);
        if (pm != null) {
            PowerManager.WakeLock wakeLock = pm.newWakeLock(
                    PowerManager.PARTIAL_WAKE_LOCK | PowerManager.ACQUIRE_CAUSES_WAKEUP | PowerManager.ON_AFTER_RELEASE,
                    "Adhan:ReceiverWakeLock"
            );
            wakeLock.acquire(3 * 60 * 1000L);
        }

        // قراءة بيانات التنبيه الممررة من مشروع React
        int requestCode = intent.getIntExtra("requestCode", 0);
        String title = intent.getStringExtra("title");
        String body = intent.getStringExtra("body");
        String type = intent.getStringExtra("type");

        // إذا كان التنبيه أذكار (نوع athkar أو رقم الطلب أكبر من أو يساوي 2000)
        boolean isAthkar = "athkar".equals(type) || requestCode >= 2000;

        if (isAthkar) {
            showAthkarNotification(context, title, body, requestCode);
        } else {
            showNotificationAndPlaySound(context);
        }
    }

    // 🔔 دالة إشعار الأذكار (إشعار ناعم بصوت التنبيهات المعتاد)
    private void showAthkarNotification(Context context, String title, String body, int requestCode) {
        NotificationManager notificationManager = (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);
        if (notificationManager == null) return;

        if (title == null || title.isEmpty()) title = "تنبيه الأذكار 🔔";
        if (body == null || body.isEmpty()) body = "حان موعد الأذكار ✨";

        Uri soundUri = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION);

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel(
                    ATHKAR_CHANNEL_ID,
                    "تنبيهات الأذكار",
                    NotificationManager.IMPORTANCE_HIGH
            );
            channel.setDescription("قناة إشعارات أذكار الصباح والمساء");
            channel.enableVibration(true);

            if (soundUri != null) {
                AudioAttributes audioAttributes = new AudioAttributes.Builder()
                        .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
                        .setUsage(AudioAttributes.USAGE_NOTIFICATION)
                        .build();
                channel.setSound(soundUri, audioAttributes);
            }

            notificationManager.createNotificationChannel(channel);
        }

        Intent openIntent = new Intent(context, MainActivity.class);
        int pendingFlags = PendingIntent.FLAG_UPDATE_CURRENT;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            pendingFlags |= PendingIntent.FLAG_IMMUTABLE;
        }
        PendingIntent contentIntent = PendingIntent.getActivity(context, requestCode, openIntent, pendingFlags);

        int iconId = context.getResources().getIdentifier("ic_launcher", "mipmap", context.getPackageName());
        if (iconId == 0) iconId = android.R.drawable.ic_popup_reminder;

        NotificationCompat.Builder builder = new NotificationCompat.Builder(context, ATHKAR_CHANNEL_ID)
                .setContentTitle(title)
                .setContentText(body)
                .setSmallIcon(iconId)
                .setPriority(NotificationCompat.PRIORITY_HIGH)
                .setCategory(NotificationCompat.CATEGORY_REMINDER)
                .setContentIntent(contentIntent)
                .setAutoCancel(true);

        notificationManager.notify(requestCode, builder.build());
    }

    // 🕌 دالة الأذان الأصلية لديك
    private void showNotificationAndPlaySound(Context context) {
        NotificationManager notificationManager = (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);
        if (notificationManager == null) return;

        Uri soundUri = null;
        int soundResId = context.getResources().getIdentifier("adhan1", "raw", context.getPackageName());
        if (soundResId != 0) {
            soundUri = Uri.parse("android.resource://" + context.getPackageName() + "/" + soundResId);
        } else {
            soundUri = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_ALARM);
            if (soundUri == null) {
                soundUri = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_RINGTONE);
            }
        }

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel(
                    CHANNEL_ID,
                    "تنبيهات الأذان والصلوات",
                    NotificationManager.IMPORTANCE_HIGH
            );
            channel.setDescription("قناة تشغيل الأذان بأعلى أولوية");
            channel.setLockscreenVisibility(Notification.VISIBILITY_PUBLIC);
            channel.enableVibration(true);

            if (soundUri != null) {
                AudioAttributes audioAttributes = new AudioAttributes.Builder()
                        .setContentType(AudioAttributes.CONTENT_TYPE_MUSIC)
                        .setUsage(AudioAttributes.USAGE_ALARM)
                        .build();
                channel.setSound(soundUri, audioAttributes);
            }

            notificationManager.createNotificationChannel(channel);
        }

        Intent openIntent = new Intent(context, MainActivity.class);
        int pendingFlags = PendingIntent.FLAG_UPDATE_CURRENT;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            pendingFlags |= PendingIntent.FLAG_IMMUTABLE;
        }
        PendingIntent contentIntent = PendingIntent.getActivity(context, 0, openIntent, pendingFlags);

        int iconId = context.getResources().getIdentifier("ic_launcher", "mipmap", context.getPackageName());
        if (iconId == 0) iconId = android.R.drawable.ic_lock_idle_alarm;

        NotificationCompat.Builder builder = new NotificationCompat.Builder(context, CHANNEL_ID)
                .setContentTitle("الله أكبر - حان الآن وقت الصلاة 🕌")
                .setContentText("حي على الصلاة، حي على الفلاح")
                .setSmallIcon(iconId)
                .setPriority(NotificationCompat.PRIORITY_MAX)
                .setCategory(NotificationCompat.CATEGORY_ALARM)
                .setContentIntent(contentIntent)
                .setVibrate(new long[]{0, 1000, 500, 1000})
                .setAutoCancel(true);

        notificationManager.notify(1001, builder.build());

        try {
            AudioManager audioManager = (AudioManager) context.getSystemService(Context.AUDIO_SERVICE);
            if (audioManager != null) {
                int maxVol = audioManager.getStreamMaxVolume(AudioManager.STREAM_ALARM);
                audioManager.setStreamVolume(AudioManager.STREAM_ALARM, maxVol, 0);
            }

            if (staticMediaPlayer != null) {
                try {
                    if (staticMediaPlayer.isPlaying()) staticMediaPlayer.stop();
                    staticMediaPlayer.release();
                } catch (Exception ignored) {}
            }

            staticMediaPlayer = new MediaPlayer();
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
                staticMediaPlayer.setAudioAttributes(
                        new AudioAttributes.Builder()
                                .setUsage(AudioAttributes.USAGE_ALARM)
                                .setContentType(AudioAttributes.CONTENT_TYPE_MUSIC)
                                .build()
                );
            } else {
                staticMediaPlayer.setAudioStreamType(AudioManager.STREAM_ALARM);
            }

            staticMediaPlayer.setDataSource(context, soundUri);
            staticMediaPlayer.prepare();
            staticMediaPlayer.start();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
