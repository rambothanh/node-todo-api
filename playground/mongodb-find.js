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
	
	//Hiển thị tất cả Collection Todos thì find() không cần agrument
	//Chỉ hiển thị các giá trị có completed: false thì find({completed: false}
	//Hiện thị theo _id chính xác thì hơi đặc biệt, vì _id là đối tượng (object)
	//find({_id: new ObjectID('5b0aa4f1ac84160b6086b254')})
	// db.collection('Todos').find({
	// 	_id: new ObjectID('5b0ac220e0cb573ae0e026d6')
	// }).toArray().then((docs) => {
	// 	console.log('Todos');
	// 	console.log(JSON.stringify(docs, undefined, 2));
	// }, (err) => {
	// 	console.log('Unable to fetch Todos');
	// });
	// 
	//  
	// Đếm docs trong collection dùng count
	// db.collection('Todos').find().count().then((count) => {
	// 	console.log(`Todos count: ${count}`);
		
	// }, (err) => {
	// 	console.log('Unable to fetch Todos');
	// });
	// 
	// 
	// In user có tên Khanh trong Users
	db.collection('Users').find({name:'Khanh'}).toArray().then((docs) => {
		console.log('Users Khanh:');
		console.log(JSON.stringify(docs, undefined, 2));
	}, (err) => {
		console.log('Unable to fetch Users');
	});

	// 
	
	client.close();
});