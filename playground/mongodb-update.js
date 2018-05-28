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
	
	// //Tìm kiếm google: mongodb update operators
	// db.collection('Todos').findOneAndUpdate({
	// 	_id: new ObjectID('5b0ad12ee0cb573ae0e02700')
	// }, {$set: {
	// 	completed: true
	// }}, {
	// 	//returnOriginal: false in giá trị sau khi update
	// 	//returnOriginal: true in giá trị trước khi update
	// 	returnOriginal: false
	// }).then( (result) => {
	// 	console.log(result);
	// });
	// 
	db.collection('Users').findOneAndUpdate({
		_id: new ObjectID('5b0aa9fba18b8d0a2041de92')
	}, {
		//$set gán giá trị mới
		$set: {
			name: "Nguyen Trong Thanh"
		},
		//$inc tăng giá trị của trường
		$inc: {
			age: 1
		}
	},{
		returnOriginal: false
	}).then( (result) => {
		console.log(result);
	});
	
	client.close();
	
});