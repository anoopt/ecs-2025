// Not in use, but can be used to get the theme color from the global UI fabric state object

import { getTheme } from '@uifabric/styling';

const ThemeState = (window as any).__themeState__;

// Get theme from global UI fabric state object if exists, if not fall back to using uifabric    
export function getThemeColor(slot: string): any {
    if (ThemeState && ThemeState.theme && ThemeState.theme[slot]) {
        return ThemeState.theme[slot];
    }
    const theme: any = getTheme();
    return theme[slot];
}

/* 
    ThemeState.theme returns an object with properties that represent the theme slots and their values.
    This function will nest all of those under the "palette" property of the theme object.
*/
export function getCurrentTheme(): any {
    if (ThemeState && ThemeState.theme) {
        return {
            palette: ThemeState.theme
        };
    }
    return getTheme();
}