var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const connectDB = require('./config/db');
const session = require("express-session");
var app = express();
app.use(session({
  secret: "MY_SECRET_KEY",
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 // 1 giờ
  }
}));
var indexRouter = require('./routes/index');
var hotroRouter = require('./routes/hotro');
var errorRouter = require('./routes/error');
var chuyenmonRouter = require('./routes/chuyenmon');
var vechungtoiRouter = require('./routes/vechungtoi');
var sanphamRouter = require('./routes/sanpham');
var chitietRouter = require('./routes/chitiet');
var taikhoanRouter = require('./routes/taikhoan');
var giohangRouter = require('./routes/giohang');
var donhangRouter = require('./routes/orders');
var nhomsanphamRouter = require('./routes/nhomsanpham');
var loginRouter = require('./routes/login');

const port = process.env.PORT || 3000;

// Kết nối DB
connectDB();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/hotro', hotroRouter);
app.use('/error', errorRouter);
app.use('/chuyenmon', chuyenmonRouter);
app.use('/vechungtoi', vechungtoiRouter);
app.use('/sanpham',sanphamRouter);
app.use('/chitiet',chitietRouter);
app.use('/taikhoan',taikhoanRouter);
app.use('/giohang',giohangRouter);
app.use('/donhang',donhangRouter);
app.use('/nhomsanpham',nhomsanphamRouter);
app.use('/login',loginRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
module.exports = app;
