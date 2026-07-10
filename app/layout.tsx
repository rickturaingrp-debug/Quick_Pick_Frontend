import "./globals.css";
import QueryProvider from "@/providers/QueryProvider";
import AuthProvider from "@/providers/AuthProvider";
import ToastProvider from "@/providers/ToastProvider";
import React from "react";

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body>
        <QueryProvider>
            <AuthProvider>
                {children}
                <ToastProvider />
            </AuthProvider>
        </QueryProvider>
        </body>
        </html>
    );
}
