package com.example.alquran;

import android.app.AlarmManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import android.util.Log;

import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "AdhanScheduler")
public class AdhanSchedulerPlugin extends Plugin {

    @PluginMethod
    public void scheduleAdhan(PluginCall call) {
        Long timeInMillis = call.getLong("timeInMillis");
        Integer reqCode = call.getInt("requestCode", 1001);

        if (timeInMillis == null) {
            call.reject("يجب تقديم الوقت بـ milliseconds");
            return;
        }

        Context context = getContext();
        AlarmManager alarmManager = (AlarmManager) context.getSystemService(Context.ALARM_SERVICE);

        Intent intent = new Intent(context, AdhanReceiver.class);
        intent.setAction("com.example.alquran.PLAY_ADHAN");

        PendingIntent pendingIntent = PendingIntent.getBroadcast(
            context,
            reqCode,
            intent,
            PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
        );

        if (alarmManager != null) {
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
                Log.d("AdhanScheduler", "تمت جدولة الأذان بنجاح للوقت: " + timeInMillis);
                call.resolve();
            } catch (SecurityException e) {
                Log.e("AdhanScheduler", "خطأ في إذن المنبهات الدقيقة", e);
                call.reject("Permission error for exact alarm: " + e.getMessage());
            }
        } else {
            call.reject("AlarmManager غير متوفر");
        }
    }
}
