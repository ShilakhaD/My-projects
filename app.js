const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const app = express();


const colors = [
  'red',
  'orange',
  'yellow',
  'green',
  'blue',
  'purple'
];

app.use(bodyParser.urlencoded({extended: false}));	
app.use(cookieParser());

app.set('view engine', 'pug'); //tells express engine which template engine to use

app.use((req, resp, next)=>{ //middleware
req.message = 'This message made it!';
next();
})

app.use((req, resp, next)=>{ //middleware
console.log(req.message);
next();
})

app.get('/', (req, resp)=>{
const name = req.cookies.username;
if (name) {
 resp.render("index", { name: name });
}
else{
	resp.redirect('/hello');
}
});

app.get('/cards', (req, resp)=>{
resp.render('card', {prompt: "Who is buried in Grant's tomb?", colors});
});

app.get('/hello', (req, resp)=>{
const name = req.cookies.username;
if(name){
resp.redirect("hello", { name: name });	
}
else{
resp.render('hello');
}
});

app.post('/hello', (req, resp)=>{
resp.cookie('username', req.body.username);
resp.redirect('/');
});

app.post('/goodbye', (req, resp)=>{
resp.clearCookie('username')
resp.redirect('/');
});

app.use(( req, resp, next)=>{
const err= new Error('Not Found');
err.status= 404;
next(err);
});

app.use((err, req, resp, next)=>{
resp.locals.error = err;
resp.status(err.status);
resp.render('error');
});


app.listen(3000, ()=>{
	console.log('The application is running on https://localhost:3000');
});