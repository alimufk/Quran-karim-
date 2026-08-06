package com.example.alquran;

import android.app.AlarmManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "AdhanScheduler")
public class AdhanSchedulerPlugin extends Plugin {

    @PluginMethod
    public void scheduleAdhan(PluginCall call) {
        Double timeDouble = call.getDouble("timeInMillis");
        Integer requestCode = call.getInt("requestCode");

        if (timeDouble == null || requestCode == null) {
            call.reject("Invalid parameters");
            return;
        }

        long timeInMillis = timeDouble.longValue();
        Context context = getContext();
        AlarmManager alarmManager = (AlarmManager) context.getSystemService(Context.ALARM_SERVICE);

        if (alarmManager == null) {
            call.reject("AlarmManager unavailable");
            return;
        }

        Intent intent = new Intent(context, AdhanReceiver.class);
        intent.putExtra("requestCode", requestCode);

        int flags = PendingIntent.FLAG_UPDATE_CURRENT;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            flags |= PendingIntent.FLAG_IMMUTABLE;
        }

        PendingIntent pendingIntent = PendingIntent.getBroadcast(context, requestCode, intent, flags);

        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
                if (alarmManager.canScheduleExactAlarms()) {
                    AlarmManager.AlarmClockInfo clockInfo = new AlarmManager.AlarmClockInfo(timeInMillis, pendingIntent);
                    alarmManager.setAlarmClock(clockInfo, pendingIntent);
                } else {
                    alarmManager.setAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, timeInMillis, pendingIntent);
                }
            } else if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                AlarmManager.AlarmClockInfo clockInfo = new AlarmManager.AlarmClockInfo(timeInMillis, pendingIntent);
                alarmManager.setAlarmClock(clockInfo, pendingIntent);
            } else {
                alarmManager.setExact(timeInMillis, pendingIntent);
            }
            call.resolve();
        } catch (Exception e) {
            call.reject("Failed: " + e.getMessage());
        }
    }
}
