import { notificationsCollection, type NotificationDoc } from './db'

export type NotificationType = NotificationDoc['type']

export async function notify(type: NotificationType, title: string, message: string, link?: string): Promise<void> {
  try {
    const col = await notificationsCollection()
    await col.insertOne({
      _id: crypto.randomUUID(),
      type,
      title,
      message,
      link,
      read: false,
      createdAt: Date.now(),
    })
  } catch {
    // notifications are best-effort
  }
}
