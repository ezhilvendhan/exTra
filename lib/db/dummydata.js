'use strict';

var mongoose = require('mongoose'),
    User = mongoose.model('User');

//Clear old things, then add things in
// User.find({}).remove(function() {
// 	User.create({
// 		userid: 'user001',
// 		email: 'user001@g.com',
// 		fname: 'User',
// 		lname: '001',
// 		password: 'sha1$7944f5d6$1$7bc4c84949c7b621b2d7a81c4c8b65d044e04cf7',
// 		role: '',
// 		expense: [{
// 			name: 'groceries',
// 			description: 'Fairprice',
// 			amount: 100.56,
// 			date: "2013-01-12",
// 			time: "10:13"
// 		},
// 		{
// 			name: 'Travel',
// 			description: 'Taxi',
// 			amount: 10.00,
// 			date: "2012-01-12",
// 			time: "17:03"
// 		},
// 		{
// 			name: 'Books',
// 			description: 'Some book',
// 			amount: 56.56,
// 			date: "2013-01-01",
// 			time: "12:00"
// 		}]
// 	}, {
// 		userid: 'user002',
// 		email: 'user002@g.com',
// 		fname: 'User',
// 		lname: '002',
// 		password: 'sha1$7944f5d6$1$7bc4c84949c7b621b2d7a81c4c8b65d044e04cf7',
// 		role: 'admin'
// 	}, function(err) {
// 			console.log('finished populating users');
// 		}
// 	);
// });