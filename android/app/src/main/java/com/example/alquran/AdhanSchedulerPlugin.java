package com.example.alquran;

import android.app.AlarmManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import android.provider.Settings;
import android.util.Log;

import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "AdhanScheduler")
public class AdhanSchedulerPlugin extends Plugin {

    @PluginMethod
    public void scheduleAdhan(PluginCall call) {
        Double timeDouble = call.getDouble("timeInMillis");
        Integer reqCode = call.getInt("requestCode", 1001);

        if (timeDouble == null) {
            call.reject("الوقت بالملي ثانية مطلوب");
            return;
        }

        long timeInMillis = timeDouble.longValue();
        Context context = getContext();
        AlarmManager alarmManager = (AlarmManager) context.getSystemService(Context.ALARM_SERVICE);

        if (alarmManager == null) {
            call.reject("AlarmManager غير متوفر");
            return;
        }

        // 1. فحص إذن المنبهات الدقيقة في أندرويد 12 فما فوق (Android 12+)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            if (!alarmManager.canScheduleExactAlarms()) {
                try {
                    Intent intent = new Intent(Settings.ACTION_REQUEST_SCHEDULE_EXACT_ALARM);
                    intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                    context.startActivity(intent);
                } catch (Exception e) {
                    Log.e("AdhanScheduler", "تعذر فتح إعدادات المنبهات: " + e.getMessage());
                }
                call.reject("يرجى تفعيل خيار 'المنبهات والتذكيرات' للتطبيق من شاشة الإعدادات التي تم فتحها الآن، ثم أعد المحاولة.");
                return;
            }
        }

        Intent intent = new Intent(context, AdhanReceiver.class);
        intent.setAction("com.example.alquran.PLAY_ADHAN");

        int flags = PendingIntent.FLAG_UPDATE_CURRENT;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            flags |= PendingIntent.FLAG_IMMUTABLE;
        }

        PendingIntent pendingIntent = PendingIntent.getBroadcast(
            context,
            reqCode != null ? reqCode : 1001,
            intent,
            flags
        );

        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                alarmManager.setExactAndAllowWhileIdle(
                    AlarmManager.RTC_WAKEUP,
                    timeInMillis,
                    pendingIntent
                );
            } else {
                alarmManager.setExact(
                    AlarmManager.RTC_WAKEUP,
                    timeInMillis,
                    pendingIntent
                );
            }
            Log.d("AdhanScheduler", "تمت الجدولة بنجاح للوقت: " + timeInMillis);
            call.resolve();
        } catch (Exception e) {
            Log.e("AdhanScheduler", "فشل الجدولة: " + e.getMessage());
            call.reject("فشل الجدولة: " + e.getMessage());
        }
    }
}
