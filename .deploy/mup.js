module.exports = {
  servers: {
    one: {
      host: '52.29.222.185',
      username: 'ubuntu',
      pem: 'C:/\Users/\yohandi/\WeQu_V1/\WeQu.pem',
    }
  },

  // Formerly named 'meteor'. Configuration for deploying the app
  app: {
    name: 'wequ',
    path: 'C:/\Users/\yohandi/\WeQu_V1',
    // (optional, default is meteor) Plugins can provide additional types
    type: 'meteor',
    docker: {
      // Change the image to 'kadirahq/meteord' if you
      // are using Meteor 1.3 or older
      // user 'zodern/meteor:root' otherwise
      image: 'aarinidev1/meteor-puppeteer',
	  
      // (optional) It is set to true when using a docker image
      // that supports it. Builds a new docker image containing the
      // app's bundle and npm dependencies to start the app faster and
      // make deploys more reliable and easier to troubleshoot
      prepareBundle:false
    },
	

    // list of servers to deploy to, from the 'servers' list
    servers: {
      one: {},
    },

    // All options are optional.
    buildOptions: {
      // Set to true to skip building mobile apps
      // but still build the web.cordova architecture. (recommended)
      serverOnly: true,

    },
    env: {
      ROOT_URL: 'https://app.weq.io',
	  MONGO_URL:'mongodb://WeQuAdmin:JZR63MSg4KenTW38@wequ-feedback-app-shard-00-00-tdmtm.mongodb.net:27017/wequ?ssl=true&replicaSet=WeQu-Feedback-App-shard-0&authSource=admin'
    },
    // The maximum number of seconds it will wait
    // for your app to successfully start (optional, default is 60)
    deployCheckWaitTime: 180,
  }
};



*/

//End of TEST mup
/*
module.exports = {
  servers: {
    one: {
      host: '52.29.222.185',
      username: 'ubuntu',
      pem: '/users/aarini/Documents/GitHub/WeQu_V1/WeQu.pem',
      // password:
      // or leave blank for authenticate from ssh-agent
    }
  },
  meteor: {
    name: 'wequ',
    path: '/users/aarini/Documents/GitHub/WeQu_V1',
    servers: {
      one: {}
    },
    buildOptions: {
      serverOnly: true,
    },
    env: {
      ROOT_URL: 'http://app.weq.io',
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

*/

