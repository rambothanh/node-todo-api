var env = process.env.NODE_ENV || 'development';

if (env === 'development' || env === 'test') {
    var config = require('./config.json');

    //env lúc này  là 'development'
    var envConfig = config[env];

    //Object.keys(envConfig) sẽ lấy ra mảng các key của object envConfig
    //trường hợp này là: [ 'PORT', 'MONGODB_URI' ]

    Object.keys(envConfig).forEach((key) => {
        process.env[key] = envConfig[key];
    });

};
