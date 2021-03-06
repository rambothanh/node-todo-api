const expect = require('expect');

const request = require('supertest');

const {ObjectID} = require('mongodb');

const {app} = require ('./../server');

const {Todo} = require('./../models/todo');

const {User} = require('./../models/user');

const {todos, populateTodos, users, populateUsers} = require('./seed/seed');




//Cho mảng todos vào database mỗi khi done() được gọi
beforeEach(populateTodos);

beforeEach(populateUsers);


describe('POST /todos', () => {
	it('should create a new todo', (done) => {
		var text = "Test todo text";

		//sử dụng module supertest
		request(app)
			.post('/todos')
			.set('x-auth', users[0].tokens[0].token)
			.send({text})
			.expect(200)
			.expect((res) => {
				expect(res.body.text).toBe(text);  
			})
			.end((err, res) => {
				if (err) {
					return done(err);
				}

				Todo.find({text}).then((todos) => {
					expect(todos.length).toBe(1);
					expect(todos[0].text).toBe(text);
					done();
				}).catch((e) => done(e));
			})

	});


	it('should not create todo with invalid body data', (done) => {
		request(app)
			.post('/todos')
			.set('x-auth', users[0].tokens[0].token)
			.send({})
			.expect(400)
			.end((err,res) => {
				if (err) { return done(err);};

				Todo.find().then((todos) => {
					expect(todos.length).toBe(2);
				done();	
				}).catch((e) => done());
			});
	});


});

describe('GET /todos', () => {
	it('should get all todos', (done) => {
		request(app)
			.get('/todos')
			.set('x-auth', users[0].tokens[0].token)
			.expect(200)
			.expect((res) => {
				// users[0] chỉ tạo ra 1 todo thôi
				// vì trong seed ta đã define như thế
				expect (res.body.length).toBe(1);
			})
			.end(done);		
	})
})




describe('GET /todos/:id', () => {
	it('should return todo doc', (done) => {
		//_id.toHexString(): chuyển đối tượng _id thành String
		request(app)
			.get(`/todos/${todos[0]._id.toHexString()}`)
			.set('x-auth', users[0].tokens[0].token)
			.expect(200)
			.expect((res) => {
				//todo bên dưới được định nghĩa trong app.get của
				//file server.js
				expect(res.body.todo.text).toBe(todos[0].text);
				
			})
			.end(done);
	});

	it('should not return todo doc by other user', (done) => {
		//_id.toHexString(): chuyển đối tượng _id thành String
		request(app)
			.get(`/todos/${todos[1]._id.toHexString()}`)
			.set('x-auth', users[0].tokens[0].token)
			.expect(404)
			.end(done);
	});


	it('should return 404 if todo not found', (done) => {
		//Tạo một _id giả (không có trong database) để test
		var hexId = new ObjectID().toHexString();

		request(app)
			.get(`/dodos/${hexId}`)
			.set('x-auth', users[0].tokens[0].token)
			.expect(404)
			.end(done);
	});


	it('should return 404 if for non-object ids', (done) => {
		request(app)
			.get(`/dodos/121212asdf`)   //Request 121212asdf is non-object ids
			.set('x-auth', users[0].tokens[0].token)
			.expect(404)
			.end(done);
	});


});

describe('DELETE /todos/:id',() => {
	
	it('should remove a todo', (done) => {
		var hexId = todos[1]._id.toHexString();
		request(app)
			.delete(`/todos/${hexId}`)
			.set('x-auth', users[1].tokens[0].token)
			.expect(200)
			.expect((res) => {
				expect(res.body.todo._id).toBe(hexId);
			})
			.end((err, res) => {
				if (err) { return done(err)};


				//query database using findById toNotExist
				//expect(null).toNotExist(); <-- Phiên bản cũ
				//Bản mới bây giờ là expect(null).toBeFalsy();
				//
				
				Todo.findById(hexId).then((todo) => {
					//Kiểm tra xem todo thật sự là không tồn tại (Null)
					expect(todo).toBeFalsy();
					done();
				}).catch((e) => done(e));

			})

	});


	it('should not remove a todo by other user', (done) => {
		var hexId = todos[0]._id.toHexString();
		request(app)
			.delete(`/todos/${hexId}`)
			.set('x-auth', users[1].tokens[0].token)
			.expect(404)
			.end((err, res) => {
				if (err) { return done(err)};
				
				Todo.findById(hexId).then((todo) => {
					//Kiểm tra xem todo thật sự là không được xóa
					expect(todo).toBeTruthy();
					done();
				}).catch((e) => done(e));

			})

	});

	
	it('should return 404 if todo not found', (done) => {
		var hexId = new ObjectID().toHexString();

		request(app)
			.delete(`/dodos/${hexId}`)
			.set('x-auth', users[1].tokens[0].token)
			.expect(404)
			.end(done);

	});

	it('should return 404 if for non-object ids', (done) => {

		request(app)
			.delete(`/dodos/121212asdf`)   //Request 121212asdf is non-object ids
			.expect(404)
			.end(done);
	});

});

describe('PATCH /todos/:id', () => {

	it('should update the todo', (done) => {
		var hexId = todos[0]._id.toHexString();

		//Chuẩn bị text để update
		var text = "this should be the new text";

		request(app)
			.patch(`/todos/${hexId}`)
			.set('x-auth', users[0].tokens[0].token)
			.send({
				completed: true,
				text                  //viết tắt của text: text
			})
			.expect(200)
			.expect((res) => {
				expect(res.body.todo.text).toBe(text);
				expect(res.body.todo.completed).toBe(true);
				expect(typeof res.body.todo.completedAt).toBe('number');
		//Dòng bên trên expect(res.body.todo.completedAt).toBeA('number');
		//không còn dùng được nữa, phải dùng toBe().
			})
			.end(done)

	});


	it('should not update the todo by other user', (done) => {
		var hexId = todos[0]._id.toHexString();

		//Chuẩn bị text để update
		var text = "this should be the new text";

		request(app)
			.patch(`/todos/${hexId}`)
			.set('x-auth', users[1].tokens[0].token)
			.send({
				completed: true,
				text                  //viết tắt của text: text
			})
			.expect(404)
			.end(done)

	});


	it('should clear completedAt when todo is not completed', (done) => {

		var hexId = todos[1]._id.toHexString();

		//Chuẩn bị text để update
		var text = "this should be the new text-other";

		request(app)
			.patch(`/todos/${hexId}`)
			.set('x-auth', users[1].tokens[0].token)
			.send({
				completed: false,
				text                  //viết tắt của text: text
			})
			.expect(200)
			.expect((res) => {
				expect(res.body.todo.text).toBe(text);
				expect(res.body.todo.completed).toBe(false);
				expect(res.body.todo.completedAt).toBeFalsy();
		//Dòng bên trên expect(res.body.todo.completedAt).toNotExist();
		//không còn dùng được nữa, phải dùng toBeFalsy().
			})
			.end(done)


	});


});

describe('GET /users/me', () => {
	it('should return user if authenticated', (done) => {
		request(app)
			.get('/users/me')
			.set('x-auth', users[0].tokens[0].token)
			.expect(200)
			.expect((res) => {
				expect(res.body._id).toBe(users[0]._id.toHexString());
				expect(res.body.email).toBe(users[0].email);
			})
			.end(done);
	});

	it ('should return 401 if not authenticated', (done) => {
		request(app)
			.get('/users/me')
			.expect(401)
			.expect((res) => {
				expect(res.body).toEqual({});
			})
			.end(done);
	});
});

describe('POST /users', () => {
	it('should create a user', (done) => {
		var email = 'vidu@vidu.com';
		var password = 'TTT111';

		request(app)
			.post('/users')
			.send({email, password})
			.expect(200)
			.expect((res) => {
				//Kiểm tra sự tồn tại của x-auth trong header
				//và _id trong body
				//toExist đã được thay thế bằng toBeTruthy
				expect(res.headers['x-auth']).toBeTruthy();
				expect(res.body._id).toBeTruthy();
				expect(res.body.email).toBe(email);
			})
			.end((err) => {
				if(err){
					return done(err);
				}

				User.findOne({email}).then((user) => {
					//Kiểm tra xem user có tồn tại không
					expect(user).toBeTruthy();
					//Kiểm tra xem password có được hashing chưa
					// toNotBe không còn hoạt động, thay vào đó là:
					// expect(X).not.toBe(Y)
					expect(user.password).not.toBe(password);
					done();
				}).catch((e) => done(e));

			});


	});

	//trường hợp Post email và password không đúng
	it('should return validation errors if request invalid', (done) => {

		request(app)
			.post('/users')
			.send({
				email: 'thanh',
				password: '245345'
			})
			.expect(404)
			.end(done);

	});

	it ('should not create user if email in use', (done) => {
		request(app)
			.post('/users')
			.send({
				email: users[0].email,
				password: '245345'
			})
			.expect(404)
			.end(done);
	});
});


describe('POST /users/login', () => {

	it('should login user and return auth token', (done) => {
		request(app)
			.post('/users/login')
			.send({
				email: users[1].email,
				password: users[1].password
			})
			.expect(200)
			.expect((res) => {
				expect(res.headers['x-auth']).toBeTruthy();
			})
			.end((err, res) => {
				if(err){
					return	done(err);
				};

				User.findById(users[1]._id).then((user) => {
					//Tìm hiểu thêm về toContainEqual ở : expect jest
					// Hàm toInclude khồng sài được, chưa biết thay thế 
					//
					expect(user.toObject().tokens[1]).toMatchObject({
						access: 'auth',
						token: res.headers['x-auth']
					});
					//phải là tokens thứ 2 tokens[1] vì user[1] đã được
					//định nghĩa 1 token rồi
					// expect(user.tokens[1].access).toBe('auth');
					// expect(user.tokens[1].token).toBe(res.headers['x-auth']);
					done();
				}).catch((e) => done(e));
			});
	});

	it('should reject invalid login', (done) => {
		request(app)
			.post('/users/login')
			.send({
				email: 'thanhag@gmail.com',
				password: 'wrong password'
			})
			.expect(400)
			.expect((res) => {
				expect(res.headers['x-auth']).toBeFalsy();
			})
			.end((err, res) => {
				if(err){
					return	done(err);
				};

				User.findById(users[1]._id).then((user) => {
					// Không tạo được tokens nên chỉ có 1 tokens mà 
					// ta đã định nghĩa ban đầu ở seed
					expect(user.tokens.length).toBe(1);
					done();
				}).catch((e) => done(e));
			});
	});
});

describe('DELETE /users/me/token',() => {
	it('should remove auth token on logout', (done) => {
		request(app)
			.delete('/users/me/token')
			.set('x-auth', users[0].tokens[0].token)
			.expect(200)
			.end((err, res) => {
				if (err) {
					return done(err);
				};

				User.findById(users[0]._id).then((user) => {
					expect(user.tokens.length).toBe(0);
					done();
				}).catch((e) => done(e));

			})

	});
});