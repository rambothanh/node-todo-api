var express = require('express');

var bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');

var {Todo} = require('./models/todo');

var {User} = require('./models/User');

var app = express();

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

app.listen(3000 , () => {
	console.log ('Started on port 3000');
});


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