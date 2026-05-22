import fs from 'fs';
import path from 'path';

const IGNORED_DIRS = new Set(['node_modules', '.angular', '.svelte-kit', 'dist', 'build']);

export function buildExamplesNav(pathPrefix) {
  const rootDir = path.join(process.cwd(), 'examples');
  if (!fs.existsSync(rootDir) || !fs.statSync(rootDir).isDirectory()) {
    return null;
  }

  return scan(rootDir, pathPrefix, rootDir);
}

function scan(dirPath, pathPrefix, rootDir) {
  const packageJsonPath = path.join(dirPath, 'package.json');
  const packageExists = fs.existsSync(packageJsonPath);

  if (packageExists) {
    const name = path.basename(dirPath);
    return {
      title: name,
      path: dirPath,
      label: 'pro',
    };
  }

  const entries = fs
    .readdirSync(dirPath, { withFileTypes: true })
    .filter((f) => f.isDirectory() && !IGNORED_DIRS.has(f.name));

  const children = entries
    .map((item) => {
      const childPath = path.join(dirPath, item.name);
      const child = scan(childPath, pathPrefix, rootDir);

      if (!child) return null;

      if (Array.isArray(child)) {
        return {
          title: item.name,
          group: 'example',
          children: child,
        };
      }

      if (child.label === 'pro') {
        // Calculate relative path from rootDir
        const relativePath = path.relative(rootDir, childPath);
        return {
          title: item.name,
          group: 'example',
          path: '/' + path.join(pathPrefix, relativePath),
        };
      }

      return {
        title: item.name,
        group: 'example',
        children: child,
      };
    })
    .filter(Boolean);

  return children;
}
