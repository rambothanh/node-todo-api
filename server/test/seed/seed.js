const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');
const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/user');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();
//Tạo mảng các User để test 
var users = [{
	_id: userOneId,
	email: 'rambothanh1985@gmail.com',
	password: 'userOnePass',
	tokens: [{
		access: 'auth',
		token: jwt.sign({_id: userOneId, access: 'auth'}, 'abc123').toString()	
	}]
}, {
	_id: userTwoId,
	email: 'thanhag@gmail.com',
	password: 'userTwoPass',
	
}];



//Tạo mảng các đối tượng todo, để test GET request
const todos = [{
	_id: new ObjectID(),
	text: 'First test todo',
		
},{
	_id: new ObjectID(),
	text: 'Second test todo',
	completed: true,
	completedAt: 888
}];

//Mỗi khi done được gọi thì sẽ remove data khỏi Todo và insert data
//mới vào
const populateTodos = (done) => {
	Todo.remove({}).then(() => {
		return Todo.insertMany(todos);
	}).then(() => done());
};

//Save vào database bằng insertMany không chạy middleware
//hashing password đã tạo, vì vậy nên phải thay đổi populateTodos
//một chút

const populateUsers = (done) => {
	User.remove({}).then(() => {
		var userOne = new User(users[0]).save(); 
		var userTwo = new User(users[1]).save();
		//khi gọi hàm save(), ta cũng đã có một hàm middleware
		//Và bằng cách sử dụng Promise, tất cả sẽ chờ
		//những hành động save và middleware đó
		return Promise.all([userOne, userTwo])
	}).then(() => done());
};



module.exports = {todos, populateTodos, users, populateUsers};