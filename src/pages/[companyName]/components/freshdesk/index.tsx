import { useEffect } from 'react';

declare global {
  interface Window {
    fwSettings: {
      widget_id: number;
    };
    FreshworksWidget: any;
  }
}

const FreshdeskWidget: React.FC = () => {
  useEffect(() => {
    // Freshdesk widget settings
    window.fwSettings = {
      widget_id: 70000004031,
    };
    
    // Function to initialize Freshdesk widget
    (function() {
      if (typeof window.FreshworksWidget !== 'function') {
        const n: any = function(...args: any[]) {
          n.q.push(args);
        };
        n.q = [];
        window.FreshworksWidget = n;
      }
    })();

    // Create and append the Freshdesk widget script
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://widget.freshworks.com/widgets/70000004031.js';
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    // Clean up script when component unmounts
    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return null;
};

export default FreshdeskWidget;
