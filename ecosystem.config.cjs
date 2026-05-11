module.exports = {
  apps: [{
    name: 'puppy-diary-api',
    script: 'server/index.js',
    cwd: '/opt/puppy-diary',
    env: {
      NODE_ENV: 'production',
      PORT: 3001,
    },
    autorestart: true,
    max_restarts: 10,
    restart_delay: 5000,
  }]
}
