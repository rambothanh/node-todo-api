var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
// MONGODB_URI ở heroku, lấy bằng cách sử dụng lệnh
// heroku addons:create mongolab:sandbox --> Tạo addon mongolab gói miễn phí
// heroku config --> để lấy đường dẫn mongodb hoặc process.env.MONGODB_URI

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/TodoApp');

module.exports = {mongoose};