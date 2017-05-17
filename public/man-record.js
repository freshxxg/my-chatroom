/**
 * Created by Administrator on 2017/5/15 0015.
 */
//获取聊天记录表
var url =window.location.href;
if(url == 'http://localhost:8989/admin/record'){
    getRecord();
}else{
    function getRequest() {
        var url = window.location.search; //获取url中"?"符后的字串
        var theRequest = new Object();
        if (url.indexOf("?") != -1) {
            var str = url.substr(1);
            strs = str.split("&");
            for(var i = 0; i < strs.length; i ++) {
                theRequest[strs[i].split("=")[0]]=decodeURI(strs[i].split("=")[1]);
            }
        }
        return theRequest;
    }
    var username =getRequest().username;
    $.ajax({
        type: 'get',
        url: '/api/getRecord?username=' + username,
        dataType: 'json',
        success: function(data){
            if(data.code == 200){
                setRecord(data.data);
            } else{
                alert('暂无数据')
            }
        }
    })

}
function getRecord(){
    $.ajax({
        type: 'get',
        url: '/api/getRecord',
        dataType: 'json',
        success: function(data){
            if(data.code == 200){
                setRecord(data.data);
            } else{
                alert(data.msg)
            }
        }
    })
}
//查询
function find(){
    var  username = $('#user-key').val();
    location.href =  '/admin/record?username=' + username;;
}
//表格写入
function setRecord(users) {
    for(var i in users){
        var d=users[i];
        $('.record-table').append('<tr><td>'+d.username+'</td><td>'+getNowFormatDate(d.createTime)+'</td><td>'+d.content+'</td><td><input class="btn btn-primary" style="margin: auto" type="button" value="see details" onclick="look()" data-toggle="modal" data-target="#myModal"></input></td></tr>')
    }
}
//转换时间格式
function getNowFormatDate(date) {
    return date.split("T", 1)
}


//查看
function look() {
    var username =$(event.target).parent().parent().children("td").get(0).innerHTML;
    var time = $(event.target).parent().parent().children("td").get(1).innerHTML;
    var content =  $(event.target).parent().parent().children("td").get(2).innerHTML;
    $('#name').text(username);
    $('#time').text(time);
    $('#content').text(content);

}
