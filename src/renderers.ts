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
        <div class="ambient-orb-1"></div>
        <div class="ambient-orb-2"></div>
        <div class="ambient-orb-3"></div>
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
      `.html, {
      scripts: `
        // Liquid Glass Interactive Mouse Tracking
        (function() {
          const cards = document.querySelectorAll('article, .content-card, .block-card');

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
        })();
      `,
    }),

    navigation: withAssets((data: NavigationDTO) => html`
        <nav class="theme-nav">
          <div class="theme-nav__container">
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
          .theme-nav__container {
            max-width: 1400px;
            margin: 0 auto;
            padding: 0 40px;
          }

          .theme-nav__link {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .theme-nav__link-glow {
            position: absolute;
            inset: -4px;
            background: radial-gradient(circle, rgba(0, 122, 255, 0.4) 0%, transparent 70%);
            border-radius: 16px;
            opacity: 0;
            transition: opacity 0.3s ease;
            filter: blur(12px);
            z-index: -1;
          }

          .theme-nav__link.is-active .theme-nav__link-glow,
          .theme-nav__link:hover .theme-nav__link-glow {
            opacity: 1;
          }

          .theme-nav__link-text {
            position: relative;
            z-index: 1;
          }

          @media (max-width: 768px) {
            .theme-nav__container {
              padding: 0 20px;
            }
          }
        `,
      }),

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

    // Content renderers
    article: {
      render: (data: any, ctx: any) => html`
        <article class="page-article">
          ${when(!!data.title, html`<h1 class="article-title">${data.title}</h1>`)}
          ${when(!!data.meta, html`
            <div class="article-meta" style="color: var(--text-tertiary); margin-bottom: 2rem; font-size: 0.875rem;">
              ${data.meta?.author ? `By ${data.meta.author}` : ''}
              ${data.meta?.date ? ` · ${data.meta.date}` : ''}
            </div>
          `)}
          <div class="article-content">
            ${raw(ctx.renderAll(data.children || []))}
          </div>
        </article>
      `.html,
    },

    newsArticle: {
      render: (data: any, ctx: any) => html`
        <article class="news-article content-card">
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
            ${raw(ctx.renderAll(data.children || []))}
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
      `.html, {
        styles: css`
          .news-card {
            text-decoration: none;
            display: block;
            height: 100%;
            overflow: hidden;
            background: rgba(255, 255, 255, 0.95);
            border: 1px solid rgba(0, 0, 0, 0.08);
          }

          .news-card:hover {
            background: rgba(255, 255, 255, 1);
          }

          .news-card-inner {
            height: 100%;
            display: flex;
            flex-direction: column;
          }

          .news-card-image-wrapper {
            position: relative;
            overflow: hidden;
            border-radius: calc(var(--radius) - 4px);
            margin-bottom: 1rem;
          }

          .news-card-image {
            margin: 0;
            aspect-ratio: 16 / 9;
            position: relative;
          }

          .news-card-image img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.6s var(--spring-smooth);
          }

          .news-card-overlay {
            position: absolute;
            inset: 0;
            background: linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.3) 100%);
            opacity: 0;
            transition: opacity 0.4s ease;
          }

          .news-card:hover .news-card-image img {
            transform: scale(1.08);
          }

          .news-card:hover .news-card-overlay {
            opacity: 1;
          }

          .news-card-content {
            flex: 1;
            display: flex;
            flex-direction: column;
          }

          .news-card-category {
            display: inline-block;
            padding: 6px 14px;
            background: linear-gradient(135deg, var(--primary), var(--accent));
            color: white;
            font-size: 0.75rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            border-radius: 8px;
            margin-bottom: 0.75rem;
            width: fit-content;
            box-shadow: 0 4px 12px rgba(0, 122, 255, 0.3);
          }

          .news-card-title {
            margin: 0 0 0.75rem;
            font-size: 1.25rem;
            line-height: 1.3;
            color: #1a1a2e;
            background: none;
            -webkit-background-clip: unset;
            -webkit-text-fill-color: #1a1a2e;
            background-clip: unset;
            text-shadow: none;
          }

          .news-card-excerpt {
            color: #4a5568;
            margin-bottom: 1rem;
            flex: 1;
            line-height: 1.6;
            font-size: 0.95rem;
          }

          .news-card-footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: auto;
            padding-top: 0.75rem;
            border-top: 1px solid rgba(0, 0, 0, 0.08);
          }

          .news-card-date {
            color: #718096;
            font-size: 0.875rem;
          }

          .news-card-arrow {
            font-size: 1.25rem;
            color: var(--primary);
            transition: transform 0.3s var(--spring-smooth);
          }

          .news-card:hover .news-card-arrow {
            transform: translateX(4px);
          }

          /* Override block-card padding for news cards */
          .news-card.block-card {
            padding: 1.25rem;
          }
        `,
      }),

    newsList: withAssets((data: any, ctx: any) => html`
        <div class="news-list-wrapper">
          <div class="news-list">
            ${raw(ctx.renderAll(data.items || []))}
          </div>
        </div>
      `.html, {
        styles: css`
          .news-list-wrapper {
            width: 100%;
            margin: 0 auto;
          }

          .news-list {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 1.5rem;
            width: 100%;
          }

          @media (max-width: 900px) {
            .news-list {
              grid-template-columns: 1fr;
              gap: 1.25rem;
            }
          }
        `,
      }),

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
              background: var(--glass-bg);
              backdrop-filter: blur(var(--glass-blur));
              -webkit-backdrop-filter: blur(var(--glass-blur));
              border: 1px solid var(--glass-border);
              border-radius: 16px;
              margin-bottom: 12px;
              overflow: hidden;
            }
            .accordion-header {
              width: 100%;
              display: flex;
              justify-content: space-between;
              align-items: center;
              padding: 1.25rem 1.5rem;
              background: none;
              border: none;
              color: var(--text-primary);
              font-size: 1rem;
              font-weight: 600;
              cursor: pointer;
              transition: all 0.3s ease;
            }
            .accordion-header:hover {
              background: rgba(255, 255, 255, 0.05);
            }
            .accordion-header svg {
              transition: transform 0.3s ease;
            }
            .accordion-item.is-open .accordion-header svg {
              transform: rotate(180deg);
            }
            .accordion-content {
              max-height: 0;
              overflow: hidden;
              transition: max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            }
            .accordion-item.is-open .accordion-content {
              max-height: 1000px;
            }
            .accordion-body {
              padding: 0 1.5rem 1.5rem;
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
              gap: 8px;
              margin-bottom: 1.5rem;
              background: var(--glass-bg);
              backdrop-filter: blur(var(--glass-blur));
              -webkit-backdrop-filter: blur(var(--glass-blur));
              border: 1px solid var(--glass-border);
              border-radius: 16px;
              padding: 8px;
            }
            .tab-button {
              flex: 1;
              padding: 12px 20px;
              background: none;
              border: none;
              border-radius: 12px;
              color: var(--text-secondary);
              font-weight: 600;
              cursor: pointer;
              transition: all 0.3s ease;
            }
            .tab-button:hover {
              color: var(--text-primary);
              background: rgba(255, 255, 255, 0.1);
            }
            .tab-button.is-active {
              color: white;
              background: linear-gradient(135deg, var(--primary), var(--accent));
              box-shadow: 0 4px 20px rgba(0, 122, 255, 0.4);
            }
            .tab-panel {
              display: none;
              background: var(--glass-bg);
              backdrop-filter: blur(var(--glass-blur));
              -webkit-backdrop-filter: blur(var(--glass-blur));
              border: 1px solid var(--glass-border);
              border-radius: 20px;
              padding: 2rem;
            }
            .tab-panel.is-active {
              display: block;
              animation: fadeIn 0.3s ease;
            }
            @keyframes fadeIn {
              from { opacity: 0; transform: translateY(8px); }
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
