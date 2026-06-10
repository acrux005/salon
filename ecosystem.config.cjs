/** Uruchom: pm2 start ecosystem.config.cjs (ładuje .env z katalogu projektu). */
module.exports = {
  apps: [
    {
      name: "salon-next",
      cwd: "/www/wwwroot/salon.odart.pl",
      script: "node",
      args: "start-with-env.js",
      interpreter: "none",
      env: { NODE_ENV: "production" },
    },
  ],
};
