export const metadata = {
  title: 'Instagram',
  description: 'View this profile on Instagram',
  icons: {
    icon: 'https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png',
  },
  openGraph: {
    title: 'Instagram',
    description: 'See photos and videos from this user',
    url: 'https://instagram.com',
    siteName: 'Instagram',
    images: [
      {
        url: 'https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png',
        width: 800,
        height: 600,
      },
    ],
    type: 'website',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  )
}
