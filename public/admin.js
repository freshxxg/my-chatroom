/**
 * Created by Administrator on 2017/4/25 0025.
 */
//获取用户表
getUsers();
function getUsers(){
    $.ajax({
        type: 'get',
        url: '/api/getUsers',
        dataType: 'json',
        success: function(data){
            if(data.code == 200){
                console.log('kkkk', data);
                settable(data.data);
            } else{
                alert(data.msg)
            }
        }
    })
}
function settable(users) {
    for(var i in users){
        var d=users[i];
        $('.user-table').append('<tr><td>'+d.username+'</td><td>'+d.password+'</td><td>'+getNowFormatDate(d.createTime)+'</td><td><button class="btn btn-primary" onclick="edit()" data-toggle="modal" data-target="#myModal">编辑</button></td><td><button onclick="delete_user()" class="btn btn-danger">删除</button></td></tr>')
    }
}
function getNowFormatDate(date) {
    return date.split("T", 1)
}

//删除用户
function delete_user() {
    var username=$(event.target).parent().parent().children("td").get(0).innerHTML;
    $.ajax({
        type: 'get',
        url: '/api/delete?username=' + username,
        dataType: 'json',
        success: function(){
            alert('删除成功')
            location.href = '/admin';
        },
        error: function (error) {
            console.log("ERROR:   " + error);
        }
    })
}

//编辑用户
function edit() {
    initial_name=$(event.target).parent().parent().children("td").get(0).innerHTML;
    var initial_pass =$(event.target).parent().parent().children("td").get(1).innerHTML;
    $('#password').val(initial_pass);
    $('#username').val(initial_name);
}
function save() {
    var username = $('#username').val();
    var password = $('#password').val();
    if (username == '' || null) {
        alert("用户名不能为空");
        return false
    }
    if (password == '' || null) {
        alert("密码不能为空");
        return false
    }
    $.ajax({
        type: 'post',
        url: '/api/edit?username=' + username +  '&password=' +password +'&initial_name='+initial_name,
        dataType: 'json',
        success: function(){
            alert('编辑成功')
            location.href = '/admin';
        },
        error: function (error) {
            console.log("ERROR:   " + error);
        }
    })
}