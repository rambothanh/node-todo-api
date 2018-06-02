const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');


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

}

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

}

var User = mongoose.model('User',UserSchema);

module.exports = {User};