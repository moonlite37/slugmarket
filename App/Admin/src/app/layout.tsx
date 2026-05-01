import * as React from 'react'

export const metadata = {
    title: 'Admin - Slug Market',
    icons: {
        icon: [
            { url: '/favicon.ico' },
        ]
    }
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    )
}
