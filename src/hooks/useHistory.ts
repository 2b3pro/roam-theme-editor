import { useCallback, useRef, useState, useEffect } from 'react';
import type { ColorPalette, TypographySettings } from '../types/theme';

const MAX_HISTORY = 30;

export interface ThemeSnapshot {
  lightPalette: ColorPalette;
  darkPalette: ColorPalette;
  typography: TypographySettings;
}

export function useThemeHistory() {
  const [past, setPast] = useState<ThemeSnapshot[]>([]);
  const [future, setFuture] = useState<ThemeSnapshot[]>([]);
  const isUndoingRef = useRef(false);
  const lastSnapshotRef = useRef<string>('');

  const pushSnapshot = useCallback((snapshot: ThemeSnapshot) => {
    // Skip if we're in the middle of an undo/redo operation
    if (isUndoingRef.current) {
      isUndoingRef.current = false;
      return;
    }

    // Skip if snapshot is the same as the last one
    const snapshotStr = JSON.stringify(snapshot);
    if (snapshotStr === lastSnapshotRef.current) {
      return;
    }

    // Save the current state before updating
    if (lastSnapshotRef.current) {
      const prevSnapshot = JSON.parse(lastSnapshotRef.current) as ThemeSnapshot;
      setPast((prev) => [...prev.slice(-MAX_HISTORY + 1), prevSnapshot]);
    }

    lastSnapshotRef.current = snapshotStr;
    setFuture([]); // Clear future when new change is made
  }, []);

  const undo = useCallback((): ThemeSnapshot | null => {
    if (past.length === 0) return null;

    const previous = past[past.length - 1];
    isUndoingRef.current = true;

    // Move current to future
    if (lastSnapshotRef.current) {
      const current = JSON.parse(lastSnapshotRef.current) as ThemeSnapshot;
      setFuture((prev) => [current, ...prev]);
    }

    setPast((prev) => prev.slice(0, -1));
    lastSnapshotRef.current = JSON.stringify(previous);
    return previous;
  }, [past]);

  const redo = useCallback((): ThemeSnapshot | null => {
    if (future.length === 0) return null;

    const next = future[0];
    isUndoingRef.current = true;

    // Move current to past
    if (lastSnapshotRef.current) {
      const current = JSON.parse(lastSnapshotRef.current) as ThemeSnapshot;
      setPast((prev) => [...prev, current]);
    }

    setFuture((prev) => prev.slice(1));
    lastSnapshotRef.current = JSON.stringify(next);
    return next;
  }, [future]);

  const canUndo = past.length > 0;
  const canRedo = future.length > 0;

  return {
    pushSnapshot,
    undo,
    redo,
    canUndo,
    canRedo,
  };
}

// Hook for keyboard shortcuts
export function useUndoRedoShortcuts(
  onUndo: () => void,
  onRedo: () => void,
  enabled: boolean = true
) {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if focus is in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const modKey = isMac ? e.metaKey : e.ctrlKey;

      if (modKey && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        onUndo();
      } else if (modKey && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        onRedo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onUndo, onRedo, enabled]);
}
