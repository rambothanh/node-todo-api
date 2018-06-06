const {SHA256} = require('crypto-js');

const jwt = require('jsonwebtoken');

const bcrypt = require('bcryptjs');

var password = '123abc';

//Băm mật khẩu bằng bcryptjs
//Đối số đầu tiền là số vòng (càng lớn càng bảo mật,
//nhưng đánh đổi với hiệu năng)
// bcrypt.genSalt(10, (err, salt) => {
// 	bcrypt.hash(password, salt, (err, hash) => {
// 		console.log(hash);
// 	});
// });


var hashedPassword = '$2a$10$a4T033FkyAX2dkrJRxMRr.fgjXQd8iuHwvIsl9WKmHQCS5e2HtSDm';

//So sánh giá trị băm với password
bcrypt.compare('123abC', hashedPassword, (err, res) => {
	console.log(res);
});

// var data = {
// 	id: 10
// };

// var token = jwt.sign(data,'123abc');

// console.log(token);

// var decoded = jwt.verify(token, '123abc');
// console.log(decoded); 

// var message = 'I am user number 3    ';

// var hash = SHA256(message).toString();

// console.log(message);
// console.log(hash); 