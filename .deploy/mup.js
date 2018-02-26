module.exports = {
  servers: {
    one: {
      host: '52.29.222.185',
      username: 'ubuntu',
      pem: 'C:/\Users/\Ritushree/\Documents/\GitHub/\WeQu_V1/\WeQu.pem',
      // password:
      // or leave blank for authenticate from ssh-agent
    }
  },
  meteor: {
    name: 'wequ',
    path: 'C:/\Users/\Ritushree/\Documents/\GitHub/\WeQu_V1',
    servers: {
      one: {}
    },
    buildOptions: {
      serverOnly: true,
    },
    env: {
      ROOT_URL: 'http://app.wequ.co',
      MAIL_URL: 'smtp://postmaster@wequ.co:Feedback12@smtp.office365.com:587',
	  MONGO_URL: 'mongodb://WeQuAdmin:JZR63MSg4KenTW38@wequ-feedback-app-shard-00-00-tdmtm.mongodb.net:27017/wequ?ssl=true&replicaSet=WeQu-Feedback-App-shard-0&authSource=admin'
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
