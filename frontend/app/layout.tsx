import './globals.css';
import { AuthProvider } from './api/auth/context';

export const metadata = {
  title: 'Notes App',
  description: 'A modern notes application',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
 