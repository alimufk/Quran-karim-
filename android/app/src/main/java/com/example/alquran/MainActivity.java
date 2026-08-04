package com.example.alquran;

import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.media.AudioAttributes;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    @Override
    public void onCreate(Bundle savedInstanceState) {
        // 1. تسجيل إضافة الجدولة المخصصة AdhanSchedulerPlugin في جسر Capacitor
        registerPlugin(AdhanSchedulerPlugin.class);

        super.onCreate(savedInstanceState);

        // 2. إنشاء قناة إشعارات الأذان عالية الأولوية مع ربطها بملف الصوت المحلي
        createNotificationChannel();
    }

    private void createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            String channelId = "adhan_alarm_channel";
            CharSequence name = "Adhan Alarms";
            String descriptionText = "Channel for Prayer Adhan Audio Alerts";
            int importance = NotificationManager.IMPORTANCE_HIGH;

            NotificationChannel channel = new NotificationChannel(channelId, name, importance);
            channel.setDescription(descriptionText);

            // ربط القناة بملف الصوت المحلي adhan.mp3 الموجود في res/raw/adhan.mp3
            Uri soundUri = Uri.parse("android.resource://" + getPackageName() + "/raw/adhan");
            AudioAttributes audioAttributes = new AudioAttributes.Builder()
                    .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
                    .setUsage(AudioAttributes.USAGE_ALARM) // التعامل معه كمنبه هاتف رسمي
                    .build();

            channel.setSound(soundUri, audioAttributes);
            channel.enableVibration(true);
            channel.setLockscreenVisibility(android.app.Notification.VISIBILITY_PUBLIC);

            NotificationManager notificationManager = getSystemService(NotificationManager.class);
            if (notificationManager != null) {
                notificationManager.createNotificationChannel(channel);
            }
        }
    }
}
