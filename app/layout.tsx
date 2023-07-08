export const metadata = {
  title: 'ByoTube',
  description: 'Bring Your Own Tube',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <table>
          <tr>BYO Tube</tr>
          <tr>{children}</tr>
        </table>
      </body>
    </html>
  )
}
