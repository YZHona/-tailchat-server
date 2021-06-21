module.exports = {
  etcd: ['http://127.0.0.1:2379'],
  comet: {
    port: 3000,
    rpc: {
      port: 12010,
    },
    instrument: {
      auth: {
        type: 'basic',
        username: 'pawchat',
        password: '$2y$10$jWQFcGpFl090TmkGH.ajcuXWkzK4WI8ER.5heX4MzZOz98Z9rHCWW', // bcrypt: pawchat
      }
    },
    socketAdapter: 'none', // "none" | "redis"
    redisCluster: [
      {
        host: 'localhost',
        port: 6379,
      },
    ]
  },
  logic: {
    rpc: {
      port: 12011,
    }
  },
  job: {},
};
