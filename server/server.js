
require('./config/config.js');

const express = require('express');

const bodyParser = require('body-parser');

const _ = require('lodash');

const {mongoose} = require('./db/mongoose');

var {Todo} = require('./models/todo');

var {User} = require('./models/user');

//Nhỡ kỹ chữ O và ID viết hoa, rất dễ nhầm lẫn
var {ObjectID} = require('mongodb');

var {authenticate} = require('./middleware/authenticate');

var app = express();
const port = process.env.PORT || 3000;

//Biến chuỗi thành json khi request đến
app.use(bodyParser.json());

app.post('/todos', authenticate, (req, res) => {
	var todo = new Todo ({
		text: req.body.text,
		//Lấy _id của user đang thực hiện req post này
		//để đưa vào _creator
		_creator: req.user._id
	});

 	//Save vào database
 	todo.save().then((doc)=> {
 		res.send(doc);
 	}, (e) => {
 		res.status(400).send(e);
 	});
});

app.get('/todos',authenticate, (req,res) => {
	//Tìm những todos có _creator là _id của user đang req
	Todo.find({
		_creator: req.user._id
	}).then((todos) => {
		res.send(todos);
	}, (e) => {
		res.status(400).send(e);
	});

});

 
//GET /todos/132154
//req.params.id: chính là '132154' trong request bên trên
app.get('/todos/:id',authenticate,(req, res) => {
	//lấy id mà người dùng request cho vào biến id
	var id = req.params.id;
	//res.send(id);

	//Kiểm tra bến id, nếu Id không hợp lệ
	//thì trả về lỗi 404 và send null
	
	if (!ObjectID.isValid(id)) {
		return res.status(404).send();
	} 
		//Nếu Id hợp lệ thì findOne (để có thể xác nhận người dùng
		// nếu không cần xác nhận người dùng thì có thể dùng
		// findById)
		Todo.findOne({
			_id: id,
			_creator: req.user._id
		}).then((todo) => {
			//Nếu findById tìm không thấy thì trả về 400
			if (!todo) {
				return res.status(404).send();
			};
			//Nếu findById tìm thấy thì trả về todo
			res.send({todo});

		}).catch((e) => res.status(400).send());
	

});

//Xóa , làm tương tụ như: //GET /todos/132154
app.delete('/todos/:id',authenticate, async (req, res) => {
	const id = req.params.id;

	if (!ObjectID.isValid(id)) {
		return res.status(404).send();
	};

	try {
		
		 //Nếu không có thêm phần xác thực người dùng thì có thể
		 //dùng findByIdAndRemove, nhưng nên dùng: findOneAndRemove
		const todo = await Todo.findOneAndRemove({
			_id: id,
			_creator: req.user._id
		});

		if (!todo) {
				return res.status(404).send();
		};

		res.send({todo});
	} catch (e) {
		res.status(400).send()
	}
});

//Tạo router update
app.patch('/todos/:id',authenticate,(req, res) => {
	var id = req.params.id;
	//_.pick: Chỉ lấy thuộc tính của object được chỉ định
	var body = _.pick(req.body, ['text','completed']);

	if (!ObjectID.isValid(id)) {
		return res.status(404).send();
	};

	//Nếu body có completed là true và đó là boolean
	if (_.isBoolean(body.completed) && body.completed) {
		//Date().getTime() lấy số mili giây từ 01/01/1970 đến nay
		body.completedAt = new Date().getTime();
	} else {
		body.completed = false;
		body.completedAt = null
	};
	//returnOriginal: false hoặc new: true là tương đương nhau
	Todo.findOneAndUpdate({
		_id: id,
		_creator: req.user._id
	}, {$set: body}, {new: true}).then((todo) => {
		if (!todo) { return res.status(404).send()};


		res.send({todo});
	}).catch((e) => res.status(400).send());


});

//Làm cái này lúc test bằng postman, request POST 1 cái json
//quên dấu "," vậy mà test đi test lại mất cả ngày mới thấy 
app.post('/users', async (req, res) => {
    try {
		 //_.pick: Chỉ lấy thuộc tính của object được chỉ định
		const body = _.pick(req.body, ['email','password']);

		//Tạo đối tượng user theo model User theo thông
		//tin được cung cấp bởi req (body bên trên)
		const user = new User(body);

		//Save user bên trên vào database (collection users)
		await user.save();
		const token = await user.generateAuthToken();
		res.header('x-auth',token).send(user);
    } catch (e) {
    	res.status(404).send(e);
    }
});


//Route riêng tư, phải có mã token mới truy cập được
app.get('/users/me',authenticate, (req, res) => {
	res.send(req.user);
});


app.post('/users/login', async (req, res) => {
	
	try {
		const body = _.pick(req.body, ['email','password']);
		//Xác nhận user có tồn tại hay không bằng hàm middleware 
		//tự tạo findByCredentials
		const user = await User.findByCredentials(body.email, body.password);
		const token = await user.generateAuthToken();
		res.header('x-auth',token).send(user);
	} catch (e) {
		res.status(400).send();
	};
	
	
});

//Sử dụng async - await 
app.delete('/users/me/token', authenticate, async (req, res) => {
	try {
		await req.user.removeToken(req.token);
		res.status(200).send();
	} catch (e) {
		res.status(400).send();
	};
});



app.listen(port , () => {
	console.log (`Started at port ${port}`);

});

module.exports = {app};


// //Tạo đối tượng mới theo model Todo
// var newTodo = new Todo({ 
//     text: 'Cook dinn  er'
// });

// //save newTodo vào database
// newTodo.save().then((doc) => {
//     console.log('Save Todo', doc);
// }, (e) => {
//     console.log('Unable to save Todo', e);
// });

// var otherTodo = new Todo({
//     text: ' edit this video  ',
   
// });

// otherTodo.save().then((doc) => {
//     console.log(JSON.stringify(doc, undefined, 2));
// }, (e) => {
//     console.log('Unable to save Todo', e);
// });




// var newUser = new User({
//  email: "rambothanh1985@gmail.com"
// });

// newUser.save().then((doc) => {
// 	console.log(JSON.stringify(doc, undefined, 2));
// }, (e) => {
// 	console.log('Unable to save User',e);
// });