import { registerPlugin } from '@capacitor/core';

export interface AdhanSchedulerPlugin {
  scheduleAdhan(options: { timeInMillis: number; requestCode: number }): Promise<void>;
}

const AdhanScheduler = registerPlugin<AdhanSchedulerPlugin>('AdhanScheduler', {
  web: () => import('./web').then(m => new m.AdhanSchedulerWeb()),
});

export default AdhanScheduler;
