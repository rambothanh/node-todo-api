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
	
	// //deleteMany
	// db.collection('Todos').deleteMany({text: 'eat lunch'}).then((result) => {
	// 	console.log(result);
	// }, (err) => {
	// 	console.log (err);
	// });
	//
	// //deleteOne : xóa 1 item đầu tiên phù hợp
	// db.collection('Todos').deleteOne({text: 'eat lunch'}).then((result) => {
	// 	console.log(result);
	// });
	// //
	//find one and delete : findOneAndDelete
	db.collection('Todos').findOneAndDelete({completed: false}).then((result) => {
		console.log(result);
	});
	
	
	
});