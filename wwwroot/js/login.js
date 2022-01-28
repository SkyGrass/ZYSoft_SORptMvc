$("#btnLogin").on('click', function () {
    $('#username').val('admin');
    $('#userpwd').val('admin');
    var username = $('#username').val();
    var userpwd = $('#userpwd').val();
    var t = $('.login_m')[0].offsetTop + 70;
    var l = $('.login_m')[0].offsetLeft + 70;

    if (isEmpty(username) || isEmpty(userpwd)) {
        layer.msg('请输入用户名\密码进行登录!', { icon: 2, offset: [t + 'px', l + 'px'] });
    } else {
        var loading = layer.msg('加载中', { icon: 16, shade: 0.01, offset: [t + 'px', l + 'px'] });
        $.ajax({
            type: "Get",
            url: "auth?userName=" + username + "&pwd=" + userpwd,
            success: function (result) {
                if (result.state == "success") {
                    if ($('#save_me').is(':checked')) {
                        window.localStorage.setItem('username', username)
                        window.localStorage.setItem('password', userpwd)
                    }
                    $.cookie('token', result.data, { expires: 1 });
                    window.location.href = "/home"
                } else {
                    layer.msg('查询发生错误!', { icon: 2 });
                }
                layer.close(loading);
            },
            error: function (data) {
                layer.close(loading);
                if (data.status == 401) {
                    data.statusText = "您尚未登录或授权丢失,请重新登录!";
                }
                layer.alert("操作发生错误!\r\n原因：" + data.statusText, { icon: 2 });
            }
        });
    }

});

var isEmpty = function (val) {
    return val == "" || val.length == 0 || val == null || val == void 0 || val == "null" || val == "undefined"
}

$(function () {
    var username = window.localStorage.getItem('username');
    var password = window.localStorage.getItem('password');

    $('#username').val(username)
    $('#userpwd').val(password)
})