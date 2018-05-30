const {ObjectID} = require('mongodb');
const { mongoose } = require('./../server/db/mongoose');

const { Todo } = require('./../server/models/todo');

const { User } = require('./../server/models/user');


//Id phải là hợp lệ mới cho ra kết quả hoặc ra null
//id không hợp lệ thì cho ra lỗi, để giải quyết vần đề 
//này ta cần ObjectID để kiểm tra id
// var id = '5b0d7e2fc807e532dc9e4c9d';


// if(!ObjectID.isValid(id)){
// 	console.log('Id not valid');
// };

// //ví dụ này sẽ xuất ra 1 mảng các đối tượng phù hợp =, để ý chữ 's'
// Todo.find({
//     _id: id
// }).then((todos) => {
//     console.log('Todos:', todos);
// });

// //Tìm một đối tượng, để ý chữ todo không có 's' , ví dụ này 
// //chỉ xuất ra một đối tượng duy nhất
// Todo.findOne({
//     _id: id
// }).then((todo) => {
//     console.log('Todo:', todo);
// });

//findByID cũng chỉ xuất 1 đối tượng
//recommend
// Todo.findById(id).then((todo) => {
//     if (!todo) {
//         console.log('Id not found');
//     } else {
//         console.log("Todo by ID", todo);
//     }
// }).catch((e) => console.log(e));
// 
//Tự làm với collection user - Phương pháp tối ưu nhất
User.findById('5b0c1cf31cfc9b2b008c8bd611').then((todo) => {
	if (!todo) {
		
		//Nến để return ở đây thì không cần else
		return console.log('Id not found');
	} 
	console.log('Todo',todo);
}, (e) => console.log(e));