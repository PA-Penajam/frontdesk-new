module.exports = {
  apps: [
    {
      name: "frontdesk-new",
      cwd: "C:/pa-penajam/frontdesk-new",
      script: "node_modules/next/dist/bin/next",
      interpreter: "C:/Program Files/nodejs/node.exe",
      args: "start -p 3003",
      env: {
        NODE_ENV: "production",
        PORT: "3003"
      },
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      instances: 1,
      exec_mode: "fork"
    }
  ]
};
