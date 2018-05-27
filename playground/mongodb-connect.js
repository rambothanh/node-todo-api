//const MongoClient = require('mongodb').MongoClient;

// //ví dụ về lấy một thuộc tính trong Oject
// var user = {name: "Thanh", age: 33};
// var {name} = user;
// console.log(name); //sẽ in ra màn hình "Thanh"
// 
// Ví dụ trên cho thấy:
// const MongoClient = require('mongodb').MongoClient;
// có thể thay bằng dòng bên dưới:
// const {MongoClient} = require('mongodb');
//
// cũng có thể lấy một lượt  nhiều thuộc tính (hoặc đối tượng) như bên dưới

const {MongoClient, ObjectID} = require('mongodb');

// //Lấy ra dãy số ID, chưa biết để làm gì
// var obj = new ObjectID();
// console.log(obj);



MongoClient.connect('mongodb://localhost:27017/TodoApp',(err, client) => {
	if (err) {
		return console.log('Unable to connect to MongoDB server', err);
	};
	//Nếu xảy ra lỗi thì hàm callback đã return ra lỗi và không chạy 
	//dòng bên dưới này => Không cần thiết dùng cú pháp else if
	console.log('Connected to MongoDB server');

	//Cập nhật của module mondodb V3 phải thêm dòng này
	const db = client.db('TodoApp');

	// db.collection('Todos').insertOne({
	// 	text: 'Some thing to do',
	// 	completed: false
	// }, (err, result) => {
	// 	if (err) {
	// 		return console.log('Unable to insert Todos', err);
	// 	}
	// 	//result.ops chứa tất cả các tài liệu đã insert
	// 	//thông số thứ 2 undefined là bộ lọc
	// 	//Thông số thứ 3 là hiển thị thụt đầu dòng 2 bật
	// 	console.log(JSON.stringify(result.ops, undefined, 2));

	// });
	
	//Insert new document into Users collection (name, age, location)
	db.collection('Users').insertOne({
		name: 'Khanh',
		age: 33,
		location: 'Bien Hoa'
	}, (err, result) => {
		if (err) {
			return console.log('Unable to insert Users',err);

		};
		//In ra ID 
		console.log(result.ops[0]._id);
		//In ra ngày tạo
		console.log(result.ops[0]._id.getTimestamp());
		//console.log(JSON.stringify(result.ops, undefined, 2));
	});



	//Ngắt kết nối với MongoDB
	client.close();
});