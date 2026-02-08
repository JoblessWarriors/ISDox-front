import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemePreferenceService {
  initializeTheme() {
    const savedTheme = localStorage.getItem('user-theme');
    console.log('Hei')
    console.log(savedTheme);
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  toggleDarkMode() {
    const element = document.documentElement;
    const isDark = element.classList.toggle('dark');

    localStorage.setItem('user-theme', isDark ? 'dark' : 'light');
  }
}
