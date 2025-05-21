import { useEffect } from "react";

export default function useAntiCheat(setWarningMessage, reportViolation) {
  useEffect(() => {
    const raise = (msg) => setWarningMessage(msg);

    const handleVisibilityChange = async () => {
      if (document.hidden) {
        raise('You left the exam tab.')
        await reportViolation("The student left the exam tab.")
      };
    };
    const handleBlur = async () => {
      raise('You switched away from the exam window.')
      await reportViolation("The student switched away from the exam window.")
    };
    const handleFullscreenChange = async () => {
      if (!document.fullscreenElement) {
        raise('You exited fullscreen mode.');
        await reportViolation("The student exited fullscreen mode.")
      }
    };
    const handleContextMenu = (e) => {
      e.preventDefault();
      console.log("right click violation detected");
      // raise('Right-click is disabled.');
    };
    const handleCopyPaste = (e) => {
      e.preventDefault();
      console.log("copy paste violation detected");
      
      // raise('Copy/paste is disabled.');
    };
    

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('copy', handleCopyPaste);
    document.addEventListener('paste', handleCopyPaste);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('copy', handleCopyPaste);
      document.removeEventListener('paste', handleCopyPaste);
    };
  }, [setWarningMessage]);
}
