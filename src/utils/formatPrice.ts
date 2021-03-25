export function formatPrice(price: number): string {

  const priceFormatted = new Intl.NumberFormat('en-Us', {
    style: 'currency',
    currency: 'USD'
  }).format(price)

  return priceFormatted
}