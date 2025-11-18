export interface User {
  id: number
  firstName: string
  lastName: string
  email: string
  status: 'active' | 'inactive' // you can restrict to these two values
  createdAt: string // ISO date string
  updatedAt: string
  address: {
    street: string
    city: string
    zip: string
    country: string
  }
  account: {
    balance: number
    currency: string
  }
}
