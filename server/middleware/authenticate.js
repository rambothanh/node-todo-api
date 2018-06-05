var {User} = require('./../models/user');


var authenticate = (req, res, next) => {
	var token = req.header('x-auth');	

	User.findByToken(token).then((user) => {
		if(!user) {
			//Nếu mã token hợp lệ nhưng vì lý do nào đó, truy vấn
			//không thể tìm thấy một tài liệu phù hợp
			//để thông báo lỗi 401 giống bên dưới luôn
			//res.status(401).send(); hoặc:
			return Promise.reject();
			//Hàm sẽ dừng ở đây và xuống thẳng catch ở dưới
		}
		//user tìm thấy ở hàm findByToken cho vào req.user
		req.user = user;
		req.token = token;
		next(); //chuyển sang các router khác làm việc
	}).catch((e) => {
		//Lỗi 401 Unauthorized là lỗi về quyền truy cập 
		//khi mã token không hợp lệ
		res.status(401).send();
	});
};

module.exports = {authenticate};