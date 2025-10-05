'use client';

import { useRef, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { CardVariantEnum } from './Editor';

interface ZakekeEditorProps {
  handleOrder: Function;
}

interface ZakekeConfig {
  tokenOauth: string;
  productId: string;
  productName: string;
  currency: string;
  culture: string;
  quantity: number;
  cartButtonText: string;
  getProductInfo: () => any;
  addToCart: (zakekeData: any) => void;
  editAddToCart?: (zakekeData: any) => void;
  getProductPrice?: () => any;
  onBackClicked?: () => void;
  selectedAttributes?: Record<string, string>;
  hideVariants?: boolean;
  mobileVersion?: boolean;
}

declare global {
  interface Window {
    ZakekeDesigner: any;
  }
}

export const ZakekeEditor = ({ handleOrder }: ZakekeEditorProps) => {
  const t = useTranslations("Editor");
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [customizer, setCustomizer] = useState<any>(null);
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [cardVariant, setCardVariant] = useState(CardVariantEnum.Cherry);

  // Load Zakeke script
  useEffect(() => {
    // Check if we're in a browser environment
    if (typeof document === 'undefined') return;
    
    const script = document.createElement('script');
    script.src = 'https://portal.zakeke.com/scripts/integration/apiV2/customizer.js';
    script.async = true;
    script.onload = () => {
      setIsLoaded(true);
    };
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  // Initialize Zakeke customizer
  useEffect(() => {
    if (!isLoaded || !window.ZakekeDesigner || !containerRef.current) return;

    let zakekeCustomizer: any = null;

    try {
      zakekeCustomizer = new window.ZakekeDesigner();
      setCustomizer(zakekeCustomizer);

      const config: ZakekeConfig = {
        // OAuth token from environment variables
        tokenOauth: process.env.NEXT_PUBLIC_ZAKEKE_TOKEN || 'YOUR_ZAKEKE_TOKEN',
        
        // Product configuration from environment variables
        productId: process.env.NEXT_PUBLIC_ZAKEKE_PRODUCT_ID || 'business-card-001',
        productName: process.env.NEXT_PUBLIC_ZAKEKE_PRODUCT_NAME || 'Business Card',
        currency: 'USD',
        culture: 'en-US',
        quantity: 1,
        cartButtonText: t('addToCart') || 'Add to Cart',
        
        // Callbacks
        getProductInfo: () => {
          return {
            productId: 'business-card-001',
            productName: 'Business Card',
            price: 12.49,
            currency: 'USD',
            variants: [
              { id: CardVariantEnum.Cherry, name: 'Cherry Wood' },
              { id: CardVariantEnum.Sapeli, name: 'Sapeli Wood' },
              { id: CardVariantEnum.Rosewood, name: 'Rosewood' },
              { id: CardVariantEnum.Maple, name: 'Maple Wood' },
              { id: CardVariantEnum.BlackWalnut, name: 'Black Walnut' },
              { id: CardVariantEnum.Bamboo, name: 'Bamboo' },
            ]
          };
        },

        addToCart: (zakekeData: any) => {
          console.log('Adding to cart:', zakekeData);
          
          // Extract design data from Zakeke
          const cards = [{
            variant: cardVariant,
            url: zakekeData.previewUrl || zakekeData.designId,
            json: zakekeData.designData,
            svg: zakekeData.svgData,
            objects: zakekeData.objects
          }];

          // Call the existing handleOrder function
          handleOrder(cards);
        },

        editAddToCart: (zakekeData: any) => {
          console.log('Editing cart item:', zakekeData);
          // Handle edit functionality if needed
        },

        getProductPrice: () => {
          return {
            price: 12.49,
            currency: 'USD'
          };
        },

        onBackClicked: () => {
          // Handle back navigation
          if (typeof window !== 'undefined') {
            window.history.back();
          }
        },

        // Configuration options
        selectedAttributes: {
          variant: cardVariant
        },
        hideVariants: false,
        mobileVersion: window.innerWidth <= 768
      };

      // Create the iframe
      zakekeCustomizer.createIframe(config);
    } catch (error) {
      console.error('Error initializing Zakeke customizer:', error);
    }

    // Cleanup function
    return () => {
      if (zakekeCustomizer && typeof zakekeCustomizer.removeIframe === 'function') {
        try {
          zakekeCustomizer.removeIframe();
        } catch (error) {
          console.warn('Error removing Zakeke iframe:', error);
        }
      }
    };
  }, [isLoaded, handleOrder, cardVariant, t]);

  const handleVariantChange = (variant: CardVariantEnum) => {
    setCardVariant(variant);
    // Reinitialize customizer with new variant
    if (customizer && typeof customizer.removeIframe === 'function') {
      try {
        customizer.removeIframe();
        // The useEffect will reinitialize with the new variant
      } catch (error) {
        console.warn('Error removing iframe during variant change:', error);
      }
    }
  };

  return (
    <div style={{ width: '100%', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Variant selector */}
      <div style={{ padding: '20px', borderBottom: '1px solid #eee' }}>
        <h3>{t('selectVariant') || 'Select Wood Variant'}</h3>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {Object.values(CardVariantEnum).map((variant) => (
            <button
              key={variant}
              onClick={() => handleVariantChange(variant)}
              style={{
                padding: '8px 16px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                backgroundColor: cardVariant === variant ? '#007bff' : 'white',
                color: cardVariant === variant ? 'white' : 'black',
                cursor: 'pointer',
                textTransform: 'capitalize'
              }}
            >
              {variant.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Zakeke container */}
      <div 
        id="zakeke-container" 
        ref={containerRef}
        style={{ 
          flex: 1,
          width: '100%',
          minHeight: '600px'
        }}
      />

      {!isLoaded && (
        <div style={{ 
          position: 'absolute', 
          top: '50%', 
          left: '50%', 
          transform: 'translate(-50%, -50%)',
          textAlign: 'center'
        }}>
          <p>{t('loadingEditor') || 'Loading Zakeke Editor...'}</p>
        </div>
      )}
    </div>
  );
};