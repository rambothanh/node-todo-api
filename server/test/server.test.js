const expect = require('expect');

const request = require('supertest');

const {app} = require ('./../server');

var {Todo} = require('./../models/todo');

var {User} = require('./../models/User');

//Giả định database trống
beforeEach((done) => {
	Todo.remove({}).then(() => done());
});

describe('POST /todos', () => {
	it('should create a new todo', (done) => {
		var text = "Test todo text";

		//sử dụng module supertest
		request(app)
			.post('/todos')
			.send({text})
			.expect(200)
			.expect((res) => {
				expect(res.body.text).toBe(text);
			})
			.end((err, res) => {
				if (err) {
					return done(err);
				}

				Todo.find().then((todos) => {
					expect(todos.length).toBe(1);
					expect(todos[0].text).toBe(text);
					done();
				}).catch((e) => done(e));
			})

	});


	it('should not create todo with invalid body data', (done) => {
		request(app)
			.post('/todos')
			.send({})
			.expect(400)
			.end((err,res) => {
				if (err) { return done(err)};

				Todo.find().then((todos) => {
					expect(todos.length).toBe(0);
				}).catch((e) => done(e));
			})
	});


});