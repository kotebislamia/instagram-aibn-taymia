export const metadata = {
  title: 'Instagram',
  description: 'View this profile on Instagram',
  openGraph: {
    title: 'Instagram',
    description: 'See photos and videos from this user',
    images: ['https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png'],
    type: 'website',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
