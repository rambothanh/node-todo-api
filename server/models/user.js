const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');


// validate : Tìm mongoose validate để tìm hiểu thêm
// tìm npm validator để thêm thư viện validator dùng để xác thực

var UserSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true,
		minlength: 1,
		trim: true,
		
		unique: true, 
		
		validate: {
			validator: validator.isEmail,
		

			message: '{VALUE} is not a valid email'
		}
	},

	password: {

		type: String,
		require: true,
		minlength: 6

	},

	tokens: [{
		access: {
			type: String,
			required: true
		},

		token: {
			type: String,
			required: true
		}
	}]


});

UserSchema.methods.toJSON = function () {
	var user = this;
	//Chuyển đổi thành đối tượng
	var userObject = user.toObject();

	//_.pick: Chỉ lấy thuộc tính của object được chỉ định
	return _.pick(userObject,['_id','email']);

};

UserSchema.methods.generateAuthToken = function () {
	var user = this;
	var access = 'auth';
	var token = jwt.sign({_id: user._id.toHexString(), access},'abc123').toString();

	//Thêm access và token vào đối tượng
	//user.tokens.push(access, token); không có tác dụng
	user.tokens = user.tokens.concat([{access, token}]);
	
	//Save vào database
	return user.save().then(() => {
		return token;
	});

};

UserSchema.statics.findByToken = function (token) {
	//Các phương thức cá thể được gọi với tài liệu riêng lẻ
	//ví dụ như bên trên var user = this;
	//Các phương thức model được gọi với model như bên dưới
	var User = this;
	var decoded;

	try {
		//Xác nhận mã token (giải mã)
		decoded = jwt.verify(token, 'abc123');
	} catch (e) {
		//Nếu xác nhận token không đúng thì:
		// return new Promise((resolve, reject) => {
		// 	reject();

		// });
		// Viết gọn lại 3 dòng trên thành:
		return Promise.reject();
		//Đối số của reject này chính là thông báo lỗi (e)
		//của catch((e)) ở bên file server.js (phía trên chỗ comment
		// Lỗi 401 Unauthorized)
	}
	//Nếu token là đúng:
	return User.findOne({
		'_id': decoded._id,
		//Để truy vấn những giá trị lồng nhau trong Object
		//phải bọc lại bằng dấu ngoặc kép hoặc đơn
		//để cho mọi thứ nhất quán, _id bên trên cũng được 
		//để trong ngoặc luôn
		'tokens.token': token,
		'tokens.access': 'auth'
	});
};


UserSchema.statics.findByCredentials = function (email, password) {
	var user = this;
	return User.findOne({email}).then((user) => {
		//Nếu email không tồn tại
		if(!user) {
			//Sẽ tự động chuyển sang catch bên server.js
			return Promise.reject(); 
		};
		//Nếu có tồn tại email, tiến hành so sánh passwordhashed
		//và vì Bcrypt không hỗ trợ promise chỉ hỗ trợ callback
		//nên phải đưa nó vào trong promise
		
		return new Promise((resolve, reject) => {
			bcrypt.compare(password, user.password, (err, res) => {
				if(res){
					resolve(user);
				}else {
					reject();
				};
				
			});
		});
		
	});
};


//Sử dụng middleware của mongoose (cụ thể là pre), để thực 
//hiện một số thay đổi, trước khi save tài liệu và database
UserSchema.pre('save', function (next) {
	var user = this;

	//isModified Trả về true nếu tài liệu này đã được sửa đổi
	//Nếu password được sửa đổi, thì hash password, 
	//ngược lại thì trả về hàm next()
	if (user.isModified('password')) {
		//Tự Thêm salt và hash password
		bcrypt.genSalt(10, (err, salt) => {
			bcrypt.hash(user.password, salt, (err, hash) => {
				//Ghi đè mật khẩu bằng giá trị hash
				user.password = hash;
				next();
			});
		});


	} else {
		//Buộc phải gọi next() để thực hiện tác vụ 
		//liên quan tiếp theo, nếu không chương trình
		//sẽ bị treo mãi (hoặc lỗi)
		next();
	};
	
});


var User = mongoose.model('User',UserSchema);

module.exports = {User};