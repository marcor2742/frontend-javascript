module.exports = {
  injectChanges: false,
  files: ["./**/*.{html,htm,css,js}"],
  watchOptions: { ignored: "node_modules" },
  server: {
    baseDir: ["./public", "./src"],
    middleware: []
  },
  port: 3000,
  reloadDelay: 0,
  reloadDebounce: 500,
  notify: false,
  open: false
};