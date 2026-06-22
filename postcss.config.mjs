// Tailwind v4 ships its PostCSS plugin as a separate package and bundles
// autoprefixer + import resolution, so those are no longer listed here.
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
