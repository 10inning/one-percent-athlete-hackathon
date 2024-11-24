// src/app/layout.tsx
import './globals.css';
import { FirebaseProvider } from '@/components/providers/FirebaseProvider';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <FirebaseProvider>
          {children}
        </FirebaseProvider>
      </body>
    </html>
  );
}