module.exports = {
  servers: {
    one: {
      host: '52.28.201.144',
      username: 'ubuntu',
      pem: '/\opt/\WeQu_V1/\WeQu.pem',
      // password:
      // or leave blank for authenticate from ssh-agent
    }
  },
  meteor: {
    name: 'app-test',
    path: '/\opt/\WeQu_V1',
    servers: {
      one: {}
    },
    buildOptions: {
      serverOnly: true,
    },
    env: {
      ROOT_URL: 'http://app.weq.io',
      MAIL_URL: 'smtp://postmaster@weq.io:Feedback12@smtp.office365.com:587',
      MONGO_URL:'mongodb://WeQuAdmin:JZR63MSg4KenTW38@preprod-shard-00-00-tdmtm.mongodb.net:27017,preprod-shard-00-01-tdmtm.mongodb.net:27017,preprod-shard-00-02-tdmtm.mongodb.net:27017/wequ?ssl=true&replicaSet=Preprod-shard-0&authSource=admin'
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
