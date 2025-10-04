"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { CardVariantEnum } from "@/components/Editor/Editor";

interface ZakekeDesign {
  designId: string;
  previewUrl: string;
  designData: any;
  svgData?: string;
  variant: CardVariantEnum;
  timestamp: number;
}

interface ZakekeEditorContextProps {
  designs: ZakekeDesign[];
  activeDesignIndex: number;
  setActiveDesignIndex: (index: number) => void;
  saveDesign: (design: ZakekeDesign) => void;
  removeDesign: (index: number) => void;
  loadDesigns: () => ZakekeDesign[];
  clearAllDesigns: () => void;
  updateDesign: (index: number, design: Partial<ZakekeDesign>) => void;
}

const ZakekeEditorContext = createContext<ZakekeEditorContextProps | undefined>(undefined);

export const ZakekeEditorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [designs, setDesigns] = useState<ZakekeDesign[]>([]);
  const [activeDesignIndex, setActiveDesignIndex] = useState(0);
  const [isClient, setIsClient] = useState(false);

  // Initialize client-side data
  useEffect(() => {
    setIsClient(true);
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem("zakekeDesigns");
      if (saved) {
        try {
          setDesigns(JSON.parse(saved));
        } catch (error) {
          console.error('Error parsing saved designs:', error);
        }
      }
    }
  }, []);

  // Save to localStorage whenever designs change (only on client)
  useEffect(() => {
    if (isClient && typeof window !== 'undefined') {
      localStorage.setItem("zakekeDesigns", JSON.stringify(designs));
    }
  }, [designs, isClient]);

  const saveDesign = (design: ZakekeDesign) => {
    setDesigns(prev => {
      const newDesigns = [...prev];
      newDesigns[activeDesignIndex] = design;
      return newDesigns;
    });
  };

  const removeDesign = (index: number) => {
    setDesigns(prev => prev.filter((_, i) => i !== index));
    if (activeDesignIndex >= designs.length - 1) {
      setActiveDesignIndex(Math.max(0, designs.length - 2));
    }
  };

  const loadDesigns = () => {
    return designs;
  };

  const clearAllDesigns = () => {
    setDesigns([]);
    setActiveDesignIndex(0);
    if (typeof window !== 'undefined') {
      localStorage.removeItem("zakekeDesigns");
    }
  };

  const updateDesign = (index: number, designUpdate: Partial<ZakekeDesign>) => {
    setDesigns(prev => {
      const newDesigns = [...prev];
      if (newDesigns[index]) {
        newDesigns[index] = { ...newDesigns[index], ...designUpdate };
      }
      return newDesigns;
    });
  };

  return (
    <ZakekeEditorContext.Provider value={{
      designs,
      activeDesignIndex,
      setActiveDesignIndex,
      saveDesign,
      removeDesign,
      loadDesigns,
      clearAllDesigns,
      updateDesign
    }}>
      {children}
    </ZakekeEditorContext.Provider>
  );
};

export const useZakekeEditorContext = () => {
  const context = useContext(ZakekeEditorContext);
  if (!context) {
    throw new Error("useZakekeEditorContext must be used within a ZakekeEditorProvider");
  }
  return context;
};