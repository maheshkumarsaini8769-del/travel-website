const i = (name: string) => `/images/${name}.jpg`

export const heroImages = {
  luxury: i('hero'),
}

export const destinationImages: Record<string, string> = {
  jaipur: i('jaipur'),
  udaipur: i('udaipur'),
  jaisalmer: i('jaisalmer'),
  jodhpur: i('jodhpur'),
  delhi: i('delhi'),
  goa: i('goa'),
  kashmir: i('kashmir'),
  himachal: i('himachal'),
  dubai: i('dubai'),
  international: i('international'),
}

export const destinationGalleries: Record<string, string[]> = {
  jaipur: [i('jaipur'), i('jaipur-1'), i('jaipur-2'), i('jaipur-3')],
  udaipur: [i('udaipur'), i('udaipur-1'), i('udaipur-2'), i('udaipur-3')],
  jaisalmer: [i('jaisalmer'), i('jaisalmer-1'), i('jaisalmer-2'), i('jaisalmer-3')],
  jodhpur: [i('jodhpur'), i('jodhpur-1'), i('jodhpur-2'), i('jodhpur-3')],
  delhi: [i('delhi'), i('delhi-1'), i('delhi-2'), i('delhi-3')],
  goa: [i('goa'), i('goa-1'), i('goa-2'), i('goa-3')],
  kashmir: [i('kashmir'), i('kashmir-1'), i('kashmir-2'), i('kashmir-3')],
  himachal: [i('himachal'), i('himachal-1'), i('himachal-2'), i('himachal-3')],
  dubai: [i('dubai'), i('dubai-1'), i('dubai-2'), i('dubai-3')],
  international: [i('international'), i('intl-1'), i('intl-2'), i('intl-3')],
}

export const serviceImages = {
  flights: i('svc-flights'),
  hotels: i('svc-hotels'),
  tours: i('svc-tours'),
  holidays: i('svc-holidays'),
  visa: i('svc-visa'),
  transport: i('svc-transport'),
}

export const aboutImages = {
  planning: i('about-planning'),
  experience: i('about-experience'),
  premium: i('about-premium'),
}

export const packageImages: Record<string, string> = {
  'rajasthan-heritage': i('jaipur'),
  'goa-holiday': i('goa'),
  'kashmir-escape': i('kashmir'),
  'dubai-experience': i('dubai'),
  'himachal-adventure': i('himachal'),
}

export const packageGalleries: Record<string, string[]> = {
  'rajasthan-heritage': [i('jaipur'), i('jaisalmer'), i('udaipur'), i('raj-camp')],
  'goa-holiday': [i('goa'), i('goa-1'), i('goa-2'), i('goa-3')],
  'kashmir-escape': [i('kashmir'), i('kashmir-1'), i('kashmir-2'), i('kashmir-3')],
  'dubai-experience': [i('dubai'), i('dubai-1'), i('dubai-2'), i('dubai-3')],
  'himachal-adventure': [i('himachal'), i('himachal-1'), i('himachal-2'), i('himachal-3')],
}

export const ctaImages = {
  cinematic: i('cta'),
  about: i('cta'),
}

export const hotelImages = {
  jaipur: i('hotel-jaipur'),
  udaipur: i('hotel-udaipur'),
  jaisalmer: i('hotel-jaisalmer'),
  goa: i('hotel-goa'),
  kashmir: i('hotel-kashmir'),
  manali: i('hotel-manali'),
}

export const fallbackImages = {
  hero: i('hero'),
  destination: i('jaipur'),
  service: i('svc-tours'),
  about: i('about-experience'),
  package: i('jaipur'),
}
