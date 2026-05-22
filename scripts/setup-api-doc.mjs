// @ts-check
import fs from 'fs';
import path from 'path';
import { buildExamplesNav } from './example-nav-tree.mjs';

function docNavigation() {
  return [
    {
      title: 'Cookbook',
      group: 'doc',
      children: [
        {
          title: 'Autocomplete Component',
          path: '/Select/docs/cookbook/autocomplete-component',
        },
      ],
    },
    {
      title: 'Core Concepts',
      group: 'doc',
      children: [
        {
          title: 'Architecture',
          path: '/Select/docs/core-concepts/architecture',
        },
        {
          title: 'Select Options',
          path: '/Select/docs/core-concepts/select-options',
        },
        {
          title: 'Select State',
          path: '/Select/docs/core-concepts/select-state',
        },
        {
          title: 'Progressive Enhancement',
          path: '/Select/docs/core-concepts/progressive-enhancement',
        },
      ],
    },
    {
      title: 'Introduction',
      group: 'doc',
      children: [
        {
          title: 'Headless Select?',
          path: '/Select/docs/introduction',
        },
        {
          title: 'Getting Started',
          path: '/Select/docs/getting-started',
        },
      ],
    },
  ];
}

/**
 * @param {import('typedoc-plugin-markdown').MarkdownApplication} app
 */
export function load(app) {
  let publicPath = '';

  app.renderer.on('beginRender', () => {
    publicPath = (app.options.getValue('publicPath') || '').replace(/\/$/, '');
  });

  app.renderer.on('endPage', (page) => {
    if (!page.contents) return;

    // Remove .md and .mdx and preserve anchors
    page.contents = page.contents.replace(/(\[[^\]]*]\([^)\s]+?)\.(md|mdx)(#[^)]+)?\)/g, '$1$3)');
  });

  app.renderer.on('endRender', () => {
    const outputDir = app.options.getValue('out');
    const navJsonPath = path.join(outputDir.replace(/\/api$/, ''), 'navigation.json');
    if (!fs.existsSync(navJsonPath)) return;

    try {
      const originalRaw = fs.readFileSync(navJsonPath, 'utf-8');
      const navData = JSON.parse(originalRaw);

      const processNavItem = (item) => {
        if (item.path) {
          item.path = item.path.replace(/\.(md|mdx)$/, '');

          if (publicPath) {
            const normalized = item.path.startsWith('/') ? item.path : '/' + item.path;
            item.path = publicPath + normalized;
          }
        } else {
          item.group = 'api';
        }
        item.children?.forEach(processNavItem);
      };

      Array.isArray(navData) ? navData.forEach(processNavItem) : processNavItem(navData);

      if (Array.isArray(navData)) {
        const index = navData.findIndex((i) => i.title === 'hooks');
        if (index > -1) {
          navData.unshift(navData.splice(index, 1)[0]);
        }

        docNavigation().forEach((item) => {
          navData.unshift(item);
        });
      }

      const examplesPaths = buildExamplesNav('select/examples');
      if (examplesPaths) {
        // @ts-ignore
        examplesPaths.forEach((item) => {
          navData.push(item);
        });
      }

      const updatedRaw = JSON.stringify(navData, null, 2);
      if (updatedRaw !== originalRaw) {
        fs.writeFileSync(navJsonPath, updatedRaw, 'utf-8');
        console.log('navigation.json updated');
      } else {
        console.log('navigation.json unchanged — no write performed');
      }
    } catch (error) {
      console.error('Error processing navigation.json:', error);
    }
  });
}
