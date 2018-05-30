var express = require('express');

var bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');

var {Todo} = require('./models/todo');

var {User} = require('./models/user');

//Nhỡ kỹ chữ O và ID viết hoa, rất dễ nhầm lẫn
var {ObjectID} = require('mongodb');

var app = express();
const port = process.env.PORT || 3000;

//Biến chuỗi thành json khi request đến
app.use(bodyParser.json());


app.post('/todos', (req, res) => {
	var todo = new Todo ({
		text: req.body.text
	});

 	//Save vào database
 	todo.save().then((doc)=> {
 		res.send(doc);
 	}, (e) => {
 		res.status(400).send(e);
 	});
});

app.get('/todos', (req,res) => {
	Todo.find().then((todos) => {
		res.send(todos);
	}, (e) => {
		res.status(400).send(e);
	});

});


//GET /todos/132154
//req.params.id: chính là '132154' trong request bên trên
app.get('/todos/:id',(req, res) => {
	//lấy id mà người dùng request cho vào biến id
	var id = req.params.id;
	//res.send(id);

	//Kiểm tra bến id, nếu Id không hợp lệ
	//thì trả về lỗi 404 và send null
	
	if (!ObjectID.isValid(id)) {
		return res.status(404).send();
	} 
		//Nếu Id hợp lệ thì findById
		Todo.findById(id).then((todo) => {
			//Nếu findById tìm không thấy thì trả về 400
			if (!todo) {
				return res.status(404).send();
			};
			//Nếu findById tìm thấy thì trả về todo
			res.send({todo});

		}).catch((e) => res.status(400).send());
	

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