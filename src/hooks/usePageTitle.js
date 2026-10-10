import { useEffect } from 'react';

export default function usePageTitle(title, favicon = '/favicon.ico') {
  useEffect(() => {
    // Title change
    document.title = title;

    // Favicon change
    let link = document.querySelector("link[rel~='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    link.href = favicon;
  }, [title, favicon]);
}