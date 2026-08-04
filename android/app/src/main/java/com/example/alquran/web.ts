import { WebPlugin } from '@capacitor/core';
import type { AdhanSchedulerPlugin } from './AdhanScheduler';

export class AdhanSchedulerWeb extends WebPlugin implements AdhanSchedulerPlugin {
  async scheduleAdhan(options: { timeInMillis: number; requestCode: number }): Promise<void> {
    console.log('Adhan scheduled on web fallback:', options);
  }
}
