import { defineTheme, html, css, raw, when, withScripts, withAssets } from '@micropress/theme-sdk';
import type {
  HeaderDTO,
  NavigationDTO,
  FooterDTO,
  PageContentDTO,
  NewsArticleDTO,
  NewsCardDTO,
  ContentBlock
} from '@micropress/theme-sdk';

export default defineTheme({
  config: {
    id: 'micropress-theme-liquid-glass',
    name: 'Liquid Glass',
    version: '1.0.0',
  },

  renderers: {
    header: withAssets((data: HeaderDTO) => html`
        <div class="header-hero">
          <div class="header-hero__bg">
            <div class="header-hero__sheen"></div>
            <div class="header-hero__orb header-hero__orb--1"></div>
            <div class="header-hero__orb header-hero__orb--2"></div>
            <div class="header-hero__orb header-hero__orb--3"></div>
            <div class="header-hero__mesh"></div>
          </div>
          <div class="ambient-orb-1"></div>
          <div class="ambient-orb-2"></div>
          <div class="ambient-orb-3"></div>
          <header class="theme-header">
            <div class="theme-header__inner page-width">
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
            </div>
          </header>
        </div>
      `.html, {
      scripts: `
        // Liquid Glass Interactive Mouse Tracking
        (function() {
          const cards = document.querySelectorAll('article, .content-card, .block-card, .news-card');

          cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
              const rect = card.getBoundingClientRect();
              const x = ((e.clientX - rect.left) / rect.width) * 100;
              const y = ((e.clientY - rect.top) / rect.height) * 100;

              card.style.setProperty('--mouse-x', x + '%');
              card.style.setProperty('--mouse-y', y + '%');
            });

            card.addEventListener('mouseleave', () => {
              card.style.setProperty('--mouse-x', '50%');
              card.style.setProperty('--mouse-y', '50%');
            });
          });

          // Add subtle parallax to floating orbs based on mouse position
          let mouseX = 0;
          let mouseY = 0;

          document.addEventListener('mousemove', (e) => {
            mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
            mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
          });

          function animateOrbs() {
            document.documentElement.style.setProperty('--mouse-x', (50 + mouseX * 5) + '%');
            document.documentElement.style.setProperty('--mouse-y', (50 + mouseY * 5) + '%');
            requestAnimationFrame(animateOrbs);
          }

          animateOrbs();
          
          // Navigation toggle for compact viewports
          const toggle = document.querySelector('.theme-header__toggle');
          const nav = document.querySelector('.theme-nav');

          if (toggle && nav) {
            const closeNav = () => {
              nav.classList.remove('is-open');
              toggle.setAttribute('aria-expanded', 'false');
            };

            toggle.addEventListener('click', () => {
              const willOpen = !nav.classList.contains('is-open');
              nav.classList.toggle('is-open', willOpen);
              toggle.setAttribute('aria-expanded', String(willOpen));
            });

            window.addEventListener('resize', () => {
              if (window.innerWidth > 900) {
                closeNav();
              }
            });

            document.addEventListener('keydown', (event) => {
              if (event.key === 'Escape') closeNav();
            });
          }
        })();
      `,
    }),

    navigation: withAssets((data: NavigationDTO) => html`
        <nav class="theme-nav">
          <div class="theme-nav__container page-width">
            <ul class="theme-nav__list">
              ${raw(data.items.map(item => html`
                <li class="theme-nav__item">
                  <a
                    href="${item.href}"
                    class="theme-nav__link ${item.active ? 'is-active' : ''}"
                  >
                    <span class="theme-nav__link-text">${item.label}</span>
                    <span class="theme-nav__link-glow"></span>
                  </a>
                </li>
              `.html).join(''))}
            </ul>
          </div>
        </nav>
      `.html, {
        styles: css`
          .theme-nav__container { width: 100%; }
          .theme-nav__list { list-style: none; margin: 0; padding: 0; }
          .theme-nav__link-glow { display: none; }
        `,
      }),

    footer: {
      render: (data: FooterDTO) => html`
        <div class="footer-hero">
          <div class="footer-hero__bg">
            <div class="footer-hero__orb footer-hero__orb--1"></div>
            <div class="footer-hero__orb footer-hero__orb--2"></div>
            <div class="footer-hero__glow"></div>
          </div>
          <footer class="theme-footer">
            <div class="theme-footer__inner page-width">
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
            </div>
          </footer>
        </div>
      `.html,
    },

    // Content renderers
    article: {
      render: (data: any, ctx: any) => html`
        <article class="page-article page-width">
          ${when(!!data.title, html`<h1 class="article-title">${data.title}</h1>`)}
          ${when(!!data.meta, html`
            <div class="article-meta" style="color: var(--text-tertiary); margin-bottom: 2rem; font-size: 0.875rem;">
              ${data.meta?.author ? `By ${data.meta.author}` : ''}
              ${data.meta?.date ? ` · ${data.meta.date}` : ''}
            </div>
          `)}
          <div class="article-content">
            ${raw(ctx.renderAll(data.blocks || []))}
          </div>
        </article>
      `.html,
    },

    newsArticle: {
      render: (data: any, ctx: any) => html`
        <article class="news-article content-card page-width">
          ${when(!!data.featuredImage, html`
            <div class="news-featured-image block-image" style="margin-bottom: 2rem;">
              <img src="${data.featuredImage?.src}" alt="${data.featuredImage?.alt || ''}" />
            </div>
          `)}
          <h1 class="news-title">${data.title}</h1>
          <div class="news-meta" style="color: var(--text-tertiary); margin-bottom: 2rem;">
            ${data.author ? `By ${data.author}` : ''}
            ${data.date ? ` · ${data.date}` : ''}
            ${data.category ? ` · ${data.category}` : ''}
          </div>
          <div class="news-content">
            ${raw(ctx.renderAll(data.blocks || []))}
          </div>
        </article>
      `.html,
    },

    newsCard: withAssets((data: any) => html`
        <a href="${data.href}" class="news-card block-card">
          <div class="news-card-inner">
            ${when(!!data.image, html`
              <div class="news-card-image-wrapper">
                <div class="news-card-image block-image">
                  <img src="${data.image}" alt="${data.title}" />
                  <div class="news-card-overlay"></div>
                </div>
              </div>
            `)}
            <div class="news-card-content">
              ${when(!!data.category, html`
                <span class="news-card-category">${data.category}</span>
              `)}
              <h3 class="news-card-title">${data.title}</h3>
              ${when(!!data.excerpt, html`
                <p class="news-card-excerpt">${data.excerpt}</p>
              `)}
              <div class="news-card-footer">
                <span class="news-card-date">${data.date || ''}</span>
                <span class="news-card-arrow">→</span>
              </div>
            </div>
          </div>
        </a>
      `.html, {}),

    newsList: withAssets((data: any, ctx: any) => html`
        <div class="news-list-wrapper page-width">
          <div class="news-list">
            ${raw(ctx.renderAll(data.items || []))}
          </div>
        </div>
      `.html, {}),

    // Block renderers
    blocks: {
      heading: {
        render: (block: any) => {
          const tag = `h${block.level || 2}`;
          return html`<${tag} class="block-heading">${block.text}</${tag}>`.html;
        },
      },

      paragraph: {
        render: (block: any) => html`
          <p class="block-paragraph">${raw(block.content || block.text || '')}</p>
        `.html,
      },

      image: {
        render: (block: any) => html`
          <figure class="block-image">
            <img
              src="${block.src || block.url}"
              alt="${block.alt || ''}"
              loading="lazy"
            />
            ${when(block.caption, html`
              <figcaption style="padding: 1rem; text-align: center; color: var(--text-secondary);">
                ${block.caption}
              </figcaption>
            `)}
          </figure>
        `.html,
      },

      button: {
        render: (block: any) => html`
          <a
            href="${block.href || '#'}"
            class="btn ${block.variant || ''}"
            ${block.target ? `target="${block.target}"` : ''}
          >
            ${block.label || block.text}
          </a>
        `.html,
      },

      card: {
        render: (block: any, ctx: any) => html`
          <div class="block-card">
            ${when(block.title, html`<h3>${block.title}</h3>`)}
            ${raw(ctx.renderAll(block.children || []))}
          </div>
        `.html,
      },

      alert: {
        render: (block: any) => html`
          <div class="block-alert block-alert--${block.variant || 'info'}">
            ${raw(block.content || block.text || '')}
          </div>
        `.html,
      },

      badge: {
        render: (block: any) => html`
          <span class="block-badge">${block.text || block.label}</span>
        `.html,
      },

      bulletList: {
        render: (block: any, ctx: any) => html`
          <ul class="block-list">
            ${raw(ctx.renderAll(block.items || []))}
          </ul>
        `.html,
      },

      orderedList: {
        render: (block: any, ctx: any) => html`
          <ol class="block-list">
            ${raw(ctx.renderAll(block.items || []))}
          </ol>
        `.html,
      },

      listItem: {
        render: (block: any, ctx: any) => html`
          <li>${raw(ctx.renderAll(block.children || []))}</li>
        `.html,
      },

      horizontalRule: {
        render: () => html`
          <div class="section-divider"></div>
        `.html,
      },

      accordion: withAssets<any>(
        (block: any, ctx: any) => html`
          <div class="block-accordion" data-accordion>
            ${raw((block.items || []).map((item: any, index: number) => html`
              <div class="accordion-item">
                <button class="accordion-header" data-accordion-trigger="${index}">
                  <span>${item.title}</span>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor">
                    <path d="M6 8l4 4 4-4" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                </button>
                <div class="accordion-content" data-accordion-content="${index}">
                  <div class="accordion-body">
                    ${raw(ctx.renderAll(item.children || []))}
                  </div>
                </div>
              </div>
            `.html).join(''))}
          </div>
        `.html,
        {
          styles: css`
            .block-accordion { margin: 2rem 0; }
            .accordion-item {
              background: rgba(255, 255, 255, 0.05);
              backdrop-filter: blur(var(--glass-blur));
              -webkit-backdrop-filter: blur(var(--glass-blur));
              border: 1px solid var(--outline);
              border-radius: 16px;
              margin-bottom: 12px;
              overflow: hidden;
            }
            .accordion-header {
              width: 100%;
              display: flex;
              justify-content: space-between;
              align-items: center;
              padding: 1.1rem 1.25rem;
              background: none;
              border: none;
              color: var(--text-primary);
              font-size: 1rem;
              font-weight: 700;
              cursor: pointer;
              transition: background var(--anim-fast);
            }
            .accordion-header:hover {
              background: rgba(255, 255, 255, 0.06);
            }
            .accordion-header svg {
              transition: transform var(--anim-fast);
            }
            .accordion-item.is-open .accordion-header svg {
              transform: rotate(180deg);
            }
            .accordion-content {
              max-height: 0;
              overflow: hidden;
              transition: max-height var(--anim-slow);
            }
            .accordion-item.is-open .accordion-content {
              max-height: 1000px;
            }
            .accordion-body {
              padding: 0 1.25rem 1.25rem;
              color: var(--text-secondary);
            }
          `,
          scripts: `
            document.querySelectorAll('[data-accordion]').forEach(accordion => {
              accordion.querySelectorAll('[data-accordion-trigger]').forEach(trigger => {
                trigger.addEventListener('click', () => {
                  const item = trigger.closest('.accordion-item');
                  const wasOpen = item.classList.contains('is-open');
                  accordion.querySelectorAll('.accordion-item').forEach(i => i.classList.remove('is-open'));
                  if (!wasOpen) item.classList.add('is-open');
                });
              });
            });
          `,
        }
      ),

      tabs: withAssets<any>(
        (block: any, ctx: any) => html`
          <div class="block-tabs" data-tabs>
            <div class="tabs-header">
              ${raw((block.items || []).map((item: any, index: number) => html`
                <button
                  class="tab-button ${index === 0 ? 'is-active' : ''}"
                  data-tab-trigger="${index}"
                >
                  ${item.title}
                </button>
              `.html).join(''))}
            </div>
            <div class="tabs-content">
              ${raw((block.items || []).map((item: any, index: number) => html`
                <div
                  class="tab-panel ${index === 0 ? 'is-active' : ''}"
                  data-tab-panel="${index}"
                >
                  ${raw(ctx.renderAll(item.children || []))}
                </div>
              `.html).join(''))}
            </div>
          </div>
        `.html,
        {
          styles: css`
            .block-tabs { margin: 2rem 0; }
            .tabs-header {
              display: flex;
              gap: 10px;
              margin-bottom: 1.25rem;
              background: rgba(255, 255, 255, 0.05);
              border: 1px solid var(--outline);
              border-radius: 16px;
              padding: 8px;
              backdrop-filter: blur(var(--glass-blur));
              -webkit-backdrop-filter: blur(var(--glass-blur));
            }
            .tab-button {
              flex: 1;
              padding: 12px 16px;
              background: none;
              border: none;
              border-radius: 12px;
              color: var(--text-secondary);
              font-weight: 700;
              cursor: pointer;
              transition: background var(--anim-fast), color var(--anim-fast), transform var(--anim-fast);
            }
            .tab-button:hover {
              color: var(--text-primary);
              transform: translateY(-2px);
            }
            .tab-button.is-active {
              color: white;
              background: linear-gradient(135deg, var(--primary), var(--accent));
              box-shadow: 0 4px 20px rgba(0, 122, 255, 0.4);
            }
            .tab-panel {
              display: none;
              background: rgba(255, 255, 255, 0.04);
              backdrop-filter: blur(var(--glass-blur));
              -webkit-backdrop-filter: blur(var(--glass-blur));
              border: 1px solid var(--outline);
              border-radius: 20px;
              padding: 1.5rem;
            }
            .tab-panel.is-active {
              display: block;
              animation: fadeIn 0.2s ease-out;
            }
            @keyframes fadeIn {
              from { opacity: 0; transform: translateY(6px); }
              to { opacity: 1; transform: translateY(0); }
            }
          `,
          scripts: `
            document.querySelectorAll('[data-tabs]').forEach(tabs => {
              tabs.querySelectorAll('[data-tab-trigger]').forEach(trigger => {
                trigger.addEventListener('click', () => {
                  const index = trigger.getAttribute('data-tab-trigger');
                  tabs.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('is-active'));
                  tabs.querySelectorAll('.tab-panel').forEach(panel => panel.classList.remove('is-active'));
                  trigger.classList.add('is-active');
                  tabs.querySelector(\`[data-tab-panel="\${index}"]\`).classList.add('is-active');
                });
              });
            });
          `,
        }
      ),
    },
  },
});
