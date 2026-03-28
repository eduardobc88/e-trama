module.exports = {
  apps: [{
    name: 'SERVICE',
    script: 'server.js',
    instances: 1,
    exec_mode: 'cluster',
    watch_delay: 1000,
    env_development: {
      'NODE_ENV': 'development'
    },
    env_production: {
      'NODE_ENV': 'production',
    },
    ignore_watch: [
      'node_modules',
      'view',
      'migrations',
      'fractal-engine-ai-static',
      '*.git',
      '*.DS_Store',
      '*.log',
    ]
  }]
}
