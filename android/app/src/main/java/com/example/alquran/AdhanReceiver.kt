package com.example.alquran

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.media.AudioAttributes
import android.media.AudioManager
import android.media.MediaPlayer
import android.net.Uri
import android.os.PowerManager
import android.util.Log

class AdhanReceiver : BroadcastReceiver() {
    companion object {
        private var mediaPlayer: MediaPlayer? = null
    }

    override fun onReceive(context: Context, intent: Intent) {
        Log.d("AdhanReceiver", "تم استقبال إشارة أذان الصلاة بواسطة Kotlin!")

        // 1. إيقاظ الجهاز والشاشة فوراً
        val powerManager = context.getSystemService(Context.POWER_SERVICE) as? PowerManager
        val wakeLock = powerManager?.newWakeLock(
            PowerManager.PARTIAL_WAKE_LOCK or PowerManager.ACQUIRE_CAUSES_WAKEUP,
            "QuranApp:AdhanWakeLockKotlin"
        )
        wakeLock?.acquire(3 * 60 * 1000L) // إبقاء الهاتف مستيقظاً لمدة 3 دقائق

        // 2. تشغيل ملف الصوت adhan.mp3 المدمج كمنبه صارم
        try {
            mediaPlayer?.let {
                if (it.isPlaying) it.stop()
                it.release()
            }
            mediaPlayer = null

            val soundResId = context.resources.getIdentifier("adhan", "raw", context.packageName)
            if (soundResId != 0) {
                val soundUri = Uri.parse("android.resource://${context.packageName}/$soundResId")
                mediaPlayer = MediaPlayer().apply {
                    setAudioAttributes(
                        AudioAttributes.Builder()
                            .setUsage(AudioAttributes.USAGE_ALARM)
                            .setContentType(AudioAttributes.CONTENT_TYPE_MUSIC)
                            .build()
                    )
                    setDataSource(context, soundUri)
                    setAudioStreamType(AudioManager.STREAM_ALARM)
                    prepare()
                    start()
                }
                Log.d("AdhanReceiver", "تم تشغيل صوت الأذان بكتلن بنجاح!")
            } else {
                Log.e("AdhanReceiver", "ملف الصوت adhan غير موجود في res/raw")
            }
        } catch (e: Exception) {
            Log.e("AdhanReceiver", "خطأ في تشغيل صوت الأذان: ${e.message}", e)
        }
    }
}
