const config = {
  plugins: {
    "@tailwindcss/postcss": {
      plugins: [await import("tailwindcss-animate")],
    },
  },
};

export default config;
