// call all the required packages
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');
const url = 'your mongo db';
const imgModel = require('./models/upload');

//CREATE EXPRESS APP
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set('view engine', 'ejs');

//setup mongo
mongoose.connect(url, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useFindAndModify: false,
	useCreateIndex: true
});

//set up multer
const upload = multer({
	limits: { fileSize: 5000000 },
	fileFilter(req, file, cb) {
		if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
			//allowed file extensions
			return cb(new Error('please upload png,jpeg or jpg'));
		}
		cb(undefined, true);
	}
});

// Retriving the image
app.get('/', (req, res) => {
	imgModel.find({}, (err, items) => {
		if (err) {
			console.log(err);
		} else {
			res.render('index', { items: items });
		}
	});
});

// Uploading the image
app.post('/', upload.single('image'), (req, res, next) => {
	// res.send(req.file);
	var obj = {
		name: req.body.name,
		desc: req.body.desc,
		img: {
			data: req.file.buffer,
			contentType: req.file.mimetype
		}
	};
	imgModel.create(obj, (err, item) => {
		if (err) {
			console.log(err);
		} else {
			// item.save();
			res.redirect('/');
		}
	});
});

// multiple upload
// app.post('/uploadmultiple', upload.array('myFiles', 12), (req, res, next) => {
// 	const files = req.files;
// 	if (!files) {
// 		const error = new Error('Please choose files');
// 		error.httpStatusCode = 400;
// 		return next(error);
// 	}
// 	res.send(files[0]);
// });

app.listen(3000, () => console.log('Server started on port 3000'));
