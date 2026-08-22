export function applyAdminAppearance(config: { primaryColor: string; accentColor: string; fontFamily: string }) {
  const root = document.documentElement;
  root.style.setProperty('--app-primary', config.primaryColor);
  root.style.setProperty('--app-accent', config.accentColor);
  root.style.setProperty('--app-font', config.fontFamily);
}
