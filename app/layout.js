import Navbar from "@/app/components/Navbar";
import "./globals.css"

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <head>
                <title>Pocket Doctor</title>
            </head>
            <body className="h-screen">
                <drk className="__drk __main_entry">
                    <Navbar />
                    {children}
                </drk>
            </body>
        </html>
    );
}
