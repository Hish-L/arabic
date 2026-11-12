const pages = process.env.GITHUB_PAGES === 'true';
const basePath = pages ? '/arabic' : '';
/** @type {import('next').NextConfig} */
export default {
  ...(pages ? {output: 'export'} : {}),
  basePath,
  trailingSlash: true,
  images: {unoptimized: true},
  env: {NEXT_PUBLIC_BASE_PATH: basePath},
};
