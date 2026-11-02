import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { combine } from './date';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function setupNotifications() {
  try {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('reminders', {
        name: 'Event reminders',
        importance: Notifications.AndroidImportance.HIGH,
      });
    }
    const { status } = await Notifications.getPermissionsAsync();
    if (status !== 'granted') await Notifications.requestPermissionsAsync();
  } catch (e) {
    console.warn('Notification setup failed', e);
  }
}

const describeLead = (minutes) => {
  if (minutes <= 0) return 'Starting now!';
  if (minutes < 60) return `Starts in ${minutes} minutes!`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  const hPart = `${h} hour${h > 1 ? 's' : ''}`;
  return m ? `Starts in ${hPart} ${m} minutes!` : `Starts in ${hPart}!`;
};


export async function scheduleReminder(event) {
  if (!event.reminderEnabled || !event.reminderTime) return null;

  const fireAt = combine(event.date, event.reminderTime);
  const startsAt = combine(event.date, event.time);
  if (fireAt.getTime() <= Date.now()) return null;

  const minutes = Math.round((startsAt.getTime() - fireAt.getTime()) / 60000);

  try {
    return await Notifications.scheduleNotificationAsync({
      content: {
        title: event.name,
        body: describeLead(minutes),
        sound: true,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: fireAt,
        channelId: 'reminders',
      },
    });
  } catch (e) {
    console.warn('Could not schedule reminder', e);
    return null;
  }
}

export async function cancelReminder(id) {
  if (!id) return;
  try {
    await Notifications.cancelScheduledNotificationAsync(id);
  } catch (e) {
    // ignore
  }
}
