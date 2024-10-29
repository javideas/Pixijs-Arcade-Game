declare global {
    interface Window {
      electron: {
        onAltF11Pressed: (callback: () => void) => void;
      };
    }
  }
  
  export {};