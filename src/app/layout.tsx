import '../index.css';
import { ReactNode } from 'react';
import Script from 'next/script';
import VisualEditsMessenger from '../visual-edits/VisualEditsMessenger';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Script
          id="orchids-browser-logs"
          src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/scripts/orchids-browser-logs.js"
          strategy="afterInteractive"
          data-orchids-project-id="68e06d64-d8fb-45ed-9998-76d86e85c598"
        />
        {children}
        <VisualEditsMessenger />
      </body>
    </html>
  );
}