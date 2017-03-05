module.exports = {
  servers: {
    one: {
      host: '52.28.201.144',
      username: 'ubuntu',
      pem: '/home/rof/src/github.com/Aarini-Consulting/WeQu_V1/WeQu.pem',
      // password:
      // or leave blank for authenticate from ssh-agent
    }
  },
  meteor: {
    name: 'app-test',
    path: '/home/rof/src/github.com/Aarini-Consulting/WeQu_V1/',
    servers: {
      one: {}
    },
    buildOptions: {
      serverOnly: true,
    },
    env: {
      ROOT_URL: 'http://app-test.wequ.co',
      MONGO_URL: 'mongodb://localhost/app-test'
    },

    dockerImage: 'abernix/meteord',
    deployCheckWaitTime: 180
  },

  mongo: {
    oplog: true,
    port: 27017,
    servers: {
      one: {},
    },
  },
};
