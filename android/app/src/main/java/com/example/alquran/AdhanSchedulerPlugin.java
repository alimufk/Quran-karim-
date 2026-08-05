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
            call.reject("Time is required");
            return;
        }

        Context context = getContext();
        AlarmManager alarmManager = (AlarmManager) context.getSystemService(Context.ALARM_SERVICE);

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

        if (alarmManager != null) {
            try {
                // استخدام setAlarmClock: المنبه الرسمي الصارم المضمون 100% في أندرويد
                AlarmManager.AlarmClockInfo clockInfo = new AlarmManager.AlarmClockInfo(timeInMillis, pendingIntent);
                alarmManager.setAlarmClock(clockInfo, pendingIntent);
                
                Log.d("AdhanScheduler", "تمت الجدولة كمنبه نظام رسمي: " + timeInMillis);
                call.resolve();
            } catch (Exception e) {
                Log.e("AdhanScheduler", "خطأ في جدولة المنبه: " + e.getMessage());
                call.reject(e.getMessage());
            }
        } else {
            call.reject("AlarmManager is null");
        }
    }
}
