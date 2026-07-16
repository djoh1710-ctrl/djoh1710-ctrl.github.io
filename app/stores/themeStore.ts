import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Theme {
  type: string;
  color: string;
  text: string;
}

const AvailableThemes: Theme[] = [{
  type: 'light',
  color: '#F4F1EA',
  text: '#1A1A1A',
}, {
  type: 'dark',
  color: '#0B0E14',
  text: '#E8E6E3',
}];

interface ThemeStore {
  themes: Theme[];
  theme: Theme;
  nextTheme: () => void;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      themes: [...AvailableThemes],
      theme: AvailableThemes[0],
      nextTheme: () => {
        const themes = get().themes;
        const activeThemeIndex = themes.findIndex(theme => theme.type === get().theme.type);
        const nextThemeIndex = (activeThemeIndex + 1) % themes.length;
        set(() => ({ theme: themes[nextThemeIndex] }));
      },
    }),
    {
      name: "theme-storage",
      // Persist only the theme *type* (light/dark), not its color. Colors
      // always come fresh from AvailableThemes so palette updates apply to
      // returning visitors instead of being frozen at whatever was cached
      // on their first visit.
      partialize: (state) => ({ themeType: state.theme.type }),
      merge: (persistedState, currentState) => {
        const persisted = persistedState as { themeType?: string } | undefined;
        const matchedTheme = AvailableThemes.find((theme) => theme.type === persisted?.themeType);
        return {
          ...currentState,
          theme: matchedTheme ?? currentState.theme,
        };
      },
    }
  )
);