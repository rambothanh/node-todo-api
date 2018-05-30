const expect = require('expect');

const request = require('supertest');

const {ObjectId} = require('mongodb');

const {app} = require ('./../server');

const {Todo} = require('./../models/todo');

const {User} = require('./../models/User');


//Tạo mảng các đối tượng, để test GET request
const todos = [{
	_id: new ObjectId(),
	text: 'First test todo'
},{
	_id: new ObjectId(),
	text: 'Second test todo'
}]


// //Cho vào datase giả định mảng todos
// beforeEach((done) => {
// 	Todo.remove({}).then(() => {
// 		return Todo.insertMany(todos);
// 	}).then(() => done());
// });

// describe('POST /todos', () => {
// 	it('should create a new todo', (done) => {
// 		var text = "Test todo text";

// 		//sử dụng module supertest
// 		request(app)
// 			.post('/todos')
// 			.send({text})
// 			.expect(200)
// 			.expect((res) => {
// 				expect(res.body.text).toBe(text);
// 			})
// 			.end((err, res) => {
// 				if (err) {
// 					return done(err);
// 				}

// 				Todo.find().then((todos) => {
// 					expect(todos.length).toBe(2);
// 					expect(todos[0].text).toBe(text);
// 					done();
// 				}).catch((e) => done(e));
// 			})

// 	});


// 	it('should not create todo with invalid body data', (done) => {
// 		request(app)
// 			.post('/todos')
// 			.send({})
// 			.expect(400)
// 			.end((err,res) => {
// 				if (err) { return done(err);};

// 				Todo.find().then((todos) => {
// 					expect(todos.length).toBe(0);
// 				}).catch((e) => done(e));
// 			})
// 	});


// });

// describe('GET /todos', () => {
// 	it('should get all todos', (done) => {
// 		request(app)
// 			.get('/todos')
// 			.expect(200)
// 			.expect((res) => {
// 				expect (res.body.length).toBe(2);
// 			})
// 			.end(done);		
// 	})
// })
// 
// 
// 

describe('GET /todos/:id', () => {
	it('should return todo doc', (done) => {
		return request(app)
			//_id.toHexString(): chuyển đối tượng _id thành String
			.get(`/todos/${todos[0]._id.toHexString()}`)
			.expect(200)
			.expect((res) => {
				expect(res.body.todos.text).toBe(todos[0].text);
				
			})
			.end(done);
	})
})