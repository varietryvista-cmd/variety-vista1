module.exports = {
  apps: [
    {
      name: 'variety-vista',
      script: 'server.js',
      cwd: './', // Root of the project where server.js will be copied after build
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
    },
  ],
};
