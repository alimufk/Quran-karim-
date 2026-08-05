package com.example.alquran;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.Service;
import android.content.Intent;
import android.content.pm.ServiceInfo;
import android.media.AudioAttributes;
import android.media.MediaPlayer;
import android.net.Uri;
import android.os.Build;
import android.os.IBinder;
import android.os.PowerManager;
import android.util.Log;
import androidx.core.app.NotificationCompat;

public class AdhanForegroundService extends Service {
    private MediaPlayer mediaPlayer;
    private PowerManager.WakeLock wakeLock;

    @Override
    public void onCreate() {
        super.onCreate();
        // إيقاظ المعالج لمنع النظام من النوم أثناء الرنين
        PowerManager pm = (PowerManager) getSystemService(POWER_SERVICE);
        if (pm != null) {
            wakeLock = pm.newWakeLock(
                PowerManager.PARTIAL_WAKE_LOCK | PowerManager.ACQUIRE_CAUSES_WAKEUP,
                "QuranApp:ServiceWakeLock"
            );
            wakeLock.acquire(10 * 60 * 1000L); // 10 دقائق كحد أقصى
        }
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        String channelId = "adhan_foreground_channel";
        
        // إنشاء قناة إشعارات الخدمة الدائمة
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel(
                channelId,
                "خدمة أذان الصلاة الدائمة",
                NotificationManager.IMPORTANCE_HIGH
            );
            NotificationManager manager = getSystemService(NotificationManager.class);
            if (manager != null) {
                manager.createNotificationChannel(channel);
            }
        }

        // إشعار إلزامي لظهور الخدمة في شريط الإشعارات (متوافق مع أندرويد 14)
        Notification notification = new NotificationCompat.Builder(this, channelId)
            .setContentTitle("تطبيق القرآن الكريم")
            .setContentText("الخدمة تعمل في الخلفية لمراقبة مواقيت الصلاة...")
            .setSmallIcon(android.R.drawable.ic_lock_idle_alarm)
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .setOngoing(true)
            .build();

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            startForeground(1337, notification, ServiceInfo.FOREGROUND_SERVICE_TYPE_MEDIA_PLAYBACK);
        } else {
            startForeground(1337, notification);
        }

        // تشغيل صوت الأذان فوراً عند بدء الخدمة
        playAdhanSound();

        return START_STICKY;
    }

    private void playAdhanSound() {
        try {
            if (mediaPlayer != null) {
                mediaPlayer.release();
                mediaPlayer = null;
            }

            int soundResId = getResources().getIdentifier("adhan", "raw", getPackageName());
            if (soundResId != 0) {
                Uri soundUri = Uri.parse("android.resource://" + getPackageName() + "/" + soundResId);
                mediaPlayer = new MediaPlayer();
                mediaPlayer.setAudioAttributes(
                    new AudioAttributes.Builder()
                        .setUsage(AudioAttributes.USAGE_ALARM)
                        .setContentType(AudioAttributes.CONTENT_TYPE_MUSIC)
                        .build()
                );
                mediaPlayer.setDataSource(this, soundUri);
                mediaPlayer.prepare();
                mediaPlayer.start();

                // عند انتهاء الأذان، إيقاف الخدمة وإخفاء الإشعار
                mediaPlayer.setOnCompletionListener(mp -> {
                    stopForeground(true);
                    stopSelf();
                });
            } else {
                Log.e("AdhanService", "لم يتم العثور على ملف الصوت adhan في raw");
            }
        } catch (Exception e) {
            Log.e("AdhanService", "خطأ في تشغيل الأذان عبر الخدمة: " + e.getMessage());
        }
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        if (mediaPlayer != null) {
            if (mediaPlayer.isPlaying()) mediaPlayer.stop();
            mediaPlayer.release();
            mediaPlayer = null;
        }
        if (wakeLock != null && wakeLock.isHeld()) {
            wakeLock.release();
        }
    }

    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }
}
