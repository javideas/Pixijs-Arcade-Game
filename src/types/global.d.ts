// src/types/global.d.ts
declare global {
    interface Window {
      electron: {
        onAltF11Pressed: (callback: () => void) => void;
        // Add other methods or properties as needed
      };
    }
  }
  
  export {};