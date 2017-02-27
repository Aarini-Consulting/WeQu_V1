module.exports = {
  servers: {
    one: {
      host: '52.28.201.144',
      username: 'ubuntu',
      pem: 'D:/WeQu_V1/WeQu.pem',
      // password:
      // or leave blank for authenticate from ssh-agent
    }
  },

  meteor: {
    name: 'app-test',
    path: 'D:/WeQu_V1',
    servers: {
      one: {}
    },
    buildOptions: {
      serverOnly: true,
      buildLocation: 'D:/build', // defaults to /tmp/<uuid>
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