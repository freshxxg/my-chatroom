//  hat模块生成不重复ID
const hat = require('hat');
const rack = hat.rack();
const url = require("url");
const queryString  = require("querystring");
const Note = require('./model/leaveMessage');
const User = require('./model/user');
const Record = require('./model/record');
var flag = false;
module.exports = function(app){
  app.get('/', function(req, res, next) {
    res.render('index',{alerttext : ""})
  });

  app.get('/message', function(req, res, next) {
     var queryUrl = url.parse(req.url).query;
      var vistorname =  queryString.parse(queryUrl).vistorname || '';
      var username = queryString.parse(queryUrl).username || '';
      if(vistorname != '' && vistorname != null){
        flag = true;
      };
      Note.find({
          "vistorname" : vistorname
      },function(err,docs){
          var newname = vistorname;
          if(vistorname.length>3){
             newname = vistorname.slice(0,3)+ '...';
          }
          res.render('message', {
            vistorname: vistorname,
            showname:newname,
            username: username,
            message:docs
          })
      })
  })
//  用户登录
app.get('/login',function(req,res){
  var username = req.param('username');
  var password = req.param('password');

  User.find({
    "username" : username
  },function(err,docs){
    if(docs==''||docs==null){
      console.log("用户名不存在!")
      res.json({code: 10001, message:'用户名不存在'})
    }else {
      if(docs[0].password == password){
      res.json({code: 200, data: docs[0]})
      }else {
        console.log("密码错误!")
        res.json({code:10001, message:'密码错误!'})
      }
    }
  })
});
//  注册用户
app.get('/api/inputdata',function(req,res){

  var username = req.param('username');
  var password = req.param('password');
  User.find({
    "username" : username
  },function(err,docs){
    if(docs==''||docs==null){
      var UID = rack()
      User.create({
        "username" : username,
        "password" : password,
        "UID" : UID
      })
      res.json({code:'200', message:'注册成功'})
    } else {
      console.log("用户名已存在")
      res.json({code: '10001', message:'用户名已存在'})
    }
  })
});

//管理员首页
    app.get('/admin',function (req, res) {
        res.render('admin', {});
    });
//聊天记录管理
    app.get('/admin/record',function (req, res) {
        res.render('man-record', {});
    });
//管理员登录
    app.get('/admin/login',function (req, res) {
        res.render('login', {});
    });
//获取用户
    app.get('/api/getUsers', (req, res) =>{
        User.find()
        .exec()
        .then((doc) =>{
        if(doc.length == 0 || doc == null){
        res.json({code:403, message:'暂无数据'})
    }else{
        res.json({code:200, data:doc})
    }
}, (err) =>{
        res.json({code:10001, data:[], message:err})
    })
});
//获取聊天记录表
    app.get('/api/getRecord',function(req,res){
        var username = req.param('username');
        var name = {};
        if(username){
            name= {username:username};
        }
        Record.find(name)
            .exec()
            .then((doc) =>{
            if(doc.length == 0 || doc == null){
            res.json({code:403, message:'暂无数据'})
        }else{
            res.json({code:200, data:doc})
        }
    }, (err) =>{
            res.json({code:10001, data:[], message:err})
        })
    });

//编辑用户
    app.post('/api/edit',function(req,res){
        var initial_name = req.param('initial_name');
        var username = req.param('username');
        var password = req.param('password');
        User.findOneAndUpdate({"username" : initial_name},{$set:{username:username,password:password}})
            .exec()
            .then((doc)=>{
                res.json({code: 200, message: '编辑成功',data:doc})
            },(err)=>{
                res.json({code: 10001, message: err})
            })
    });

    //删除用户
    app.get('/api/delete',function(req,res){
        var username = req.param('username');
        User.findOneAndRemove({"username" : username})
            .exec()
            .then((doc)=>{
                if(doc){
                    res.json({code: 200, message: '删除成功',data:doc});
                 }else{
                    res.json({code: 403, message: '用户不存在'});
                 }
            },(err)=>{
                res.json({code: 10001, message: err})
        })
    });

//保存聊天记录
    app.get('/api/save/record',function(req,res){
        var username = req.param('username');
        var content = req.param('content');
        Record.find({
            "username" : username
        },function(err,docs){
            if(1 == 1){
                var UID = rack()
                Record.create({
                    "username" : username,
                    "content" : content,
                    "UID" : UID
                })
                res.json({code:'200', message:'新增成功'})
            } else {
                res.json({code: '10001', message:err})
            }
        })
    });

app.get('/chatroom', function(req, res) {
  var queryUrl = url.parse(req.url).query;
  var username = ''
  var username =  queryString.parse(queryUrl).username;
  if(username != '' && username != null){
    flag = true;
  };
  User.find({
      "username" : username
  },function(err,docs){
    if(docs == '' || docs == null) {
      flag = false
    }
   else { username = docs[0].username }
  })
  setTimeout(function(){
    if(flag){
    res.render('chatroom',{ username : username })
  }
  else {res.redirect('error')}
  },200)
});

//保存留言信息
app.post('/api/savenote', (req, res, next) => {
  let msg = { username, vistorname, note } = req.body;
  User.find({ 'username': msg.username})
  .exec()
  .then((doc) => {
    if(doc.length !== 0){
      Note.create(msg);
      res.json({code: 200, message: msg});
    } else{
      res.json({code: 10001, message: '不存在该用户'})
    }
  })
});

//获取留言
app.get('/api/getleavemsg', (req, res, next) => {
  var queryUrl = url.parse(req.url).query;
  var vistorname = queryString.parse(queryUrl).vistorname || '';
  Note.find({'vistorname': vistorname})
    .exec()
    .then((doc) => {
      if(doc.length == 0){
        res.json({code: '10001', msg: '还未有人给你留言哦'})
      } else{
        res.render('message', {message:doc});
      }
    })
})
}