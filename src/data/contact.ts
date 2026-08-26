export const contact = {
  brand: 'SUNSKY TOURISM',
  tagline: 'Travel made easy, memories made forever',
  headline: 'Explore More. Worry Less.',
  proprietor: 'DHARMPAL BAGOTIYA',
  proprietorTitle: 'Proprietor',
  phones: ['94620 18302', '94624 65726'],
  phoneLinks: ['+919462018302', '+919462465726'],
  whatsappPrimary: '919462018302',
  whatsappSecondary: '919462465726',
  email: 'sunskytourism.in@gmail.com',
  website: 'www.sunskytourism.in',
  address: 'W.No. 45, Industrial Area, Sikar',
  addressFull: 'W.No. 45, Industrial Area, Sikar, Rajasthan, India',
  latitude: '27.6094',
  longitude: '75.1399',
}

export const defaultWhatsAppMessage = 'Hello Sunsky Tourism, I want to know more about your travel packages.'

export const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  contact.addressFull
)}`

export const waLink = (message: string, phone: string = contact.whatsappPrimary) =>
  `https://wa.me/${phone}?text=${encodeURIComponent(message)}`

export const waLinkBase = `https://wa.me/${contact.whatsappPrimary}?text=`

export const waPackageMessage = (name: string, travellers: number = 0) => {
  const base = `Hello Sunsky Tourism, I want details about the ${name}.`
  return travellers > 0 ? `${base}\nNumber of travellers: ${travellers}` : base
}

export const waDestinationMessage = (name: string) =>
  `Hello Sunsky Tourism, I want to know more about travelling to ${name}.`

export const waHotelMessage = (name: string) =>
  `Hello Sunsky Tourism, I want to check availability and rates for ${name}. Please share details.`
