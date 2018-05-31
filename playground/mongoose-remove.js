const {ObjectID} = require('mongodb');
const { mongoose } = require('./../server/db/mongoose');

const { Todo } = require('./../server/models/todo');

const { User } = require('./../server/models/user');


//Xóa tất cả
// Todo.remove({}).then((result) => {
// 	console.log(result);
// });

// Todo.findOneAndRemove
Todo.findOneAndRemove({_id: '5b0ffda2d9fb4529cc5d90be'}).then((todo) => {
	console.log(todo);
});

// Todo.findByIdAndRemove
Todo.findByIdAndRemove('5b0ffda2d9fb4529cc5d90be').then((todo) => {
	console.log(todo);
});