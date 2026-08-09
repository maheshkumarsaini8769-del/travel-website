import {
  waLink,
  waDestinationMessage,
  waPackageMessage,
  waHotelMessage as waHotelMessageText,
  defaultWhatsAppMessage,
  contact,
} from '@/data/contact'

export const whatsappDefault = waLink(defaultWhatsAppMessage)
export const whatsappDestination = (name: string) => waLink(waDestinationMessage(name))
export const whatsappPackage = (name: string) => waLink(waPackageMessage(name))
export const waHotelMessage = (name: string) => waLink(waHotelMessageText(name))
export const whatsappHotel = (name: string) => waLink(waHotelMessageText(name))
export const whatsappSecondary = (msg: string) => waLink(msg, contact.whatsappSecondary)

export const telPrimary = `tel:${contact.phoneLinks[0]}`
export const telSecondary = `tel:${contact.phoneLinks[1]}`

export const isTouchDevice = () =>
  typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0)

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches
