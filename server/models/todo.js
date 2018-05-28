var mongoose = require('mongoose');

var Todo = mongoose.model('Todo', {
    text: {
        type: String,
        //Bắt buộc phải có thuộc tính này thì mới lưu:
        required: true,
        //Ít nhất phải có 1 ký tự
        minlength: 1,
        //Xóa khoản trắng thừa ở đầu và cuối text
        trim: true

        //Để tìm hiểu thêm các thuộc tính khác tìm: mongoose schemas
    },
    completed: {
        type: Boolean,
        default: false
    },
    completedAt: {
        type: Number,
        default: null
    }
});

module.exports = {Todo};