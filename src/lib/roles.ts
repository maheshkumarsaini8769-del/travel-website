export type AdminRole = 'superadmin' | 'manager' | 'booking-staff' | 'content-manager'

export const ROLE_LABELS: Record<AdminRole, string> = {
  superadmin: 'Super Admin',
  manager: 'Manager',
  'booking-staff': 'Booking Staff',
  'content-manager': 'Content Manager',
}

export const ROLE_PERMISSIONS: Record<AdminRole, string[]> = {
  superadmin: ['*'],
  manager: [
    'dashboard.view', 'bookings.*', 'customers.*', 'packages.*', 'leads.*', 'payments.*', 'reports.*',
  ],
  'booking-staff': ['dashboard.view', 'bookings.view', 'bookings.edit', 'customers.view', 'customers.edit', 'leads.view', 'leads.edit'],
  'content-manager': ['dashboard.view', 'packages.*', 'destinations.*', 'cms.*', 'reviews.*', 'images.*'],
}
