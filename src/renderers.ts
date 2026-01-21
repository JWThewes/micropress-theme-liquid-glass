import { defineTheme, html, css, raw, when } from '@micropress/theme-sdk';
import type { HeaderDTO, NavigationDTO, FooterDTO } from '@micropress/theme-sdk';

export default defineTheme({
  config: {
    id: 'micropress-theme-liquid-glass',
    name: 'Liquid Glass',
    version: '1.0.0',
  },

  renderers: {
    header: {
      render: (data: HeaderDTO) => html`
        <header class="theme-header">
          <a href="/" class="theme-header__brand">
            ${data.logo
              ? html`<img src="${data.logo.src}" alt="${data.logo.alt}" class="theme-header__logo" />`
              : html`<span class="theme-header__title">${data.siteName}</span>`
            }
          </a>
          ${when(data.showMenuToggle, html`
            <button class="theme-header__toggle" aria-label="Toggle menu" aria-expanded="false">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>
          `)}
        </header>
      `.html,
    },

    navigation: {
      render: (data: NavigationDTO) => html`
        <nav class="theme-nav">
          <ul class="theme-nav__list">
            ${raw(data.items.map(item => html`
              <li class="theme-nav__item">
                <a
                  href="${item.href}"
                  class="theme-nav__link ${item.active ? 'is-active' : ''}"
                >
                  ${item.label}
                </a>
              </li>
            `.html).join(''))}
          </ul>
        </nav>
      `.html,
    },

    footer: {
      render: (data: FooterDTO) => html`
        <footer class="theme-footer">
          <div class="theme-footer__content">
            <p class="theme-footer__copyright">&copy; ${data.year} ${data.copyright}</p>
            ${when(data.links.length > 0, html`
              <nav class="theme-footer__nav">
                ${raw(data.links.map(link => html`
                  <a href="${link.href}" class="theme-footer__link">${link.label}</a>
                `.html).join(''))}
              </nav>
            `)}
          </div>
        </footer>
      `.html,
    },
  },
});
