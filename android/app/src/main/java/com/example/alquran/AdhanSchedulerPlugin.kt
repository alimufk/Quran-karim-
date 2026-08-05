package com.example.alquran

import android.app.AlarmManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.os.Build
import android.util.Log
import com.getcapacitor.Plugin
import com.getcapacitor.PluginCall
import com.getcapacitor.PluginMethod
import com.getcapacitor.annotation.CapacitorPlugin

@CapacitorPlugin(name = "AdhanScheduler")
class AdhanSchedulerPlugin : Plugin() {

    @PluginMethod
    fun scheduleAdhan(call: PluginCall) {
        val timeInMillis = call.getLong("timeInMillis")
        val reqCode = call.getInt("requestCode", 1001) ?: 1001

        if (timeInMillis == null) {
            call.reject("Time in milliseconds is required")
            return
        }

        val context = context
        val alarmManager = context.getSystemService(Context.ALARM_SERVICE) as? AlarmManager

        val intent = Intent(context, AdhanReceiver::class.java).apply {
            action = "com.example.alquran.PLAY_ADHAN"
        }

        val flags = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        } else {
            PendingIntent.FLAG_UPDATE_CURRENT
        }

        val pendingIntent = PendingIntent.getBroadcast(context, reqCode, intent, flags)

        alarmManager?.let {
            try {
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                    it.setExactAndAllowWhileIdle(
                        AlarmManager.RTC_WAKEUP,
                        timeInMillis,
                        pendingIntent
                    )
                } else {
                    it.setExact(
                        AlarmManager.RTC_WAKEUP,
                        timeInMillis,
                        pendingIntent
                    )
                }
                Log.d("AdhanScheduler", "تمت جدولة الأذان بـ Kotlin بنجاح للوقت: $timeInMillis")
                call.resolve()
            } catch (e: SecurityException) {
                Log.e("AdhanScheduler", "خطأ في إذن المنبهات: ${e.message}", e)
                call.reject("Permission error: ${e.message}")
            }
        } ?: call.reject("AlarmManager is unavailable")
    }
}
