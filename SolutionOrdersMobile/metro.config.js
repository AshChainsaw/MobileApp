const path = require('path');
const fs = require('fs');
const childProcess = require('child_process');
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function realpathOrResolve(p) {
  const abs = path.resolve(p);
  try {
    return fs.realpathSync.native(abs);
  } catch {
    return abs;
  }
}

const projectRoot = realpathOrResolve(__dirname);
// This repo is laid out as `MobileApp/<app>`. Watching the workspace root
// prevents Metro from losing track of files when pnpm resolves via symlinks.
const workspaceRoot = realpathOrResolve(path.resolve(projectRoot, '..'));

const defaultConfig = getDefaultConfig(projectRoot);

function tryGetPnpmStorePath() {
  try {
    const out = childProcess.execSync('pnpm store path', {
      cwd: projectRoot,
      stdio: ['ignore', 'pipe', 'ignore'],
      encoding: 'utf8',
    });
    const p = String(out).trim();
    return p.length ? p : null;
  } catch {
    return null;
  }
}

const pnpmStorePath = tryGetPnpmStorePath();

function getExistingPnpmStoreCandidates() {
  const candidates = new Set();

  // Common pnpm store locations on Windows
  const localAppData = process.env.LOCALAPPDATA;
  if (localAppData) {
    candidates.add(path.join(localAppData, 'pnpm', 'store'));
    candidates.add(path.join(localAppData, 'pnpm', 'store', 'v3'));
    candidates.add(path.join(localAppData, 'pnpm', 'store', 'v10'));
  }

  const userProfile = process.env.USERPROFILE;
  if (userProfile) {
    candidates.add(path.join(userProfile, '.pnpm-store'));
  }

  // De-duplicate + keep only directories that exist
  return [...candidates].filter((p) => {
    try {
      return fs.existsSync(p);
    } catch {
      return false;
    }
  });
}

const pnpmStoreCandidates = getExistingPnpmStoreCandidates();

function existingDirs(paths) {
  const out = [];
  const seen = new Set();
  for (const p of paths) {
    if (!p) continue;
    const abs = realpathOrResolve(p);
    if (seen.has(abs)) continue;
    try {
      const fsPath = path.resolve(p);
      if (fs.existsSync(fsPath)) {
        out.push(abs);
        seen.add(abs);
      }
    } catch {
      // ignore
    }
  }
  return out;
}

const ignoreRegex = new RegExp(
  [
    // Android / Gradle build outputs change constantly (Metro watcher ENOENT).
    `${escapeRegExp(path.sep)}android${escapeRegExp(path.sep)}.*${escapeRegExp(
      path.sep,
    )}(build|intermediates|generated|merged_.*|outputs)${escapeRegExp(path.sep)}`,
    `${escapeRegExp(path.sep)}\\.gradle${escapeRegExp(path.sep)}`,
    // General build artifacts
    `${escapeRegExp(path.sep)}build${escapeRegExp(path.sep)}`,
  ].join('|'),
);

const config = {
  watchFolders: existingDirs([
    projectRoot,
    workspaceRoot,
    path.join(projectRoot, 'node_modules'),
    path.join(workspaceRoot, 'node_modules'),
    ...(pnpmStorePath ? [pnpmStorePath] : []),
    ...pnpmStoreCandidates,
  ]),
  resolver: {
    ...defaultConfig.resolver,
    blockList: defaultConfig.resolver.blockList
      ? [defaultConfig.resolver.blockList, ignoreRegex]
      : [ignoreRegex],
    unstable_enableSymlinks: true,
    unstable_enablePackageExports: true,
    nodeModulesPaths: existingDirs([
      path.join(projectRoot, 'node_modules'),
      path.join(workspaceRoot, 'node_modules'),
    ]),
  },
};

module.exports = mergeConfig(defaultConfig, config);