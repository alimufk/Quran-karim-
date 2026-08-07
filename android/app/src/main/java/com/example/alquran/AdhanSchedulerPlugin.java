package com.example.alquran;

import android.app.AlarmManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import android.widget.Toast;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

@CapacitorPlugin(name = "AdhanScheduler")
public class AdhanSchedulerPlugin extends Plugin {

    @PluginMethod
    public void scheduleAdhan(PluginCall call) {
        Long timeInMillis = call.getLong("timeInMillis");
        Integer requestCode = call.getInt("requestCode");

        if (timeInMillis == null || requestCode == null) {
            call.reject("Missing timeInMillis or requestCode");
            return;
        }

        Context context = getContext();
        AlarmManager alarmManager = (AlarmManager) context.getSystemService(Context.ALARM_SERVICE);

        if (alarmManager == null) {
            call.reject("AlarmManager is null");
            return;
        }

        Intent intent = new Intent(context, AdhanReceiver.class);
        int flags = PendingIntent.FLAG_UPDATE_CURRENT;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            flags |= PendingIntent.FLAG_IMMUTABLE;
        }

        PendingIntent pendingIntent = PendingIntent.getBroadcast(context, requestCode, intent, flags);

        try {
            // استخدام نظام AlarmClock لتخطي قيود أندرويد وإظهار أيقونة المنبه في الأعلى
            Intent showIntent = new Intent(context, MainActivity.class);
            PendingIntent showOperation = PendingIntent.getActivity(context, 0, showIntent, flags);
            AlarmManager.AlarmClockInfo alarmClockInfo = new AlarmManager.AlarmClockInfo(timeInMillis, showOperation);

            alarmManager.setAlarmClock(alarmClockInfo, pendingIntent);

            // إظهار رسالة تأكيد للمستخدم بتوقيت الجدولة
            SimpleDateFormat sdf = new SimpleDateFormat("HH:mm:ss", Locale.getDefault());
            String formattedTime = sdf.format(new Date(timeInMillis));

            if (getActivity() != null) {
                getActivity().runOnUiThread(() -> {
                    Toast.makeText(context, "⏰ تم ضبط أذان لوقت: " + formattedTime, Toast.LENGTH_SHORT).show();
                });
            }

            call.resolve();
        } catch (Exception e) {
            e.printStackTrace();
            call.reject("Failed to schedule alarm: " + e.getMessage());
        }
    }
}
