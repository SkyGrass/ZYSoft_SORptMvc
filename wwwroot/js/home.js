
if (errorInfo != "") {
    layer.alert(errorInfo, { icon: 2 }, function () {
        window.location.href = "/login";
    });
}

$('#user').html(userName);
const querys = columns.filter(function (col) {
    return col.query == true
})
if (querys.length > 0) {
    querys.forEach(q => {
        $('#q').append($("<div style='margin:5px;width: 250px;'><label for='" + q.data + "'>"
            + q.title + "</label> <input id='txt_" + q.data + "' style='width:100%' placeholder='请输入" + q.title + "' name='"
            + q.data + "' type='text' value='' /></div>"))


        $('#txt_' + q.data).keydown(function (event) {
            if (event.keyCode == "13") {
                $('#btnQuery').click();
            }
        })

    })
}
$('#q').append("<div style='margin:5px;width: 250px;'><div style='color:#fff;margin-bottom: .5rem;'>操作区</div>" +
    "<input type='button' value='查询' id='btnQuery' style='margin-right:5px' />"
    + "<input type='button' value='导出查询结果' id='btnExport' />"
    + "</div>")


const container = document.getElementById('table');
const hot = new Handsontable(container, {
    data: [],
    height: 'auto',
    width: '100%',
    language: 'zh-CN',
    colHeaders: true,
    columns,
    manualColumnMove: true,
    manualColumnResize: true,
    filters: true,
    className: 'htCenter',
    dropdownMenu: ['filter_by_condition', 'filter_action_bar'],
    licenseKey: 'non-commercial-and-evaluation'
});

$('#btnQuery').click(function () {
    var loading = layer.msg('加载中', { icon: 16, shade: 0.01 });

    hot.loadData([])
    $("#rowcount").html('0')
    $.ajax({
        type: "POST",
        url: "query",
        data: urltoJSON($('#q').serialize()),
        headers: { 'Authorization': 'Bearer ' + $.cookie('token') },
        success: function (result) {
            if (result.state == "success") {
                hot.loadData(result.data)
                $("#rowcount").html(result.data.length)
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
            layer.alert("操作发生错误!\r\n原因：" + data.statusText, { icon: 2 }, function () {
                window.location.href = "/login";
            });
        }
    });
})

$('#btnExport').click(function () {
    const rows = hot.getSourceData();
    if (rows.length <= 0) {
        layer.msg('没有要导出的查询结果', { icon: 2 });
    } else {
        layer.confirm('确认要导出查询结果吗?', { btn: ['确定', '取消'], title: "提示" }, function () {
            var table = hot.toHTML();
            table = table.replace(/<td/g, "<td STYLE='MSO-NUMBER-FORMAT:\\@@'");
            tableToExcel(table)
        });
    }
})

$('#cpw').click(function () {
    layer.open({
        type: 1,
        title: '修改密码',
        area: ['340px', '285px'],
        anim: 2,
        content: "<div style='margin:10px'>"
            + "<div style='margin:10px'><label>新密码</label><input id='npwd' type='password' value='' style='width:100%'></div>"
            + "<div style='margin:10px'><label>确认密码</label><input id='cnpwd' type='password' value='' style='width:100%'></div>"
            + "</div>",
        btn: ['确定', '取消'],
        yes: function (index, layero) {
            var npwd = $('#npwd', layero).val();
            var cnpw = $('#cnpwd', layero).val();
            if (npwd.trim().length > 0 && cnpw.trim().length > 0) {
                if (npwd == cnpw) {
                    layer.close(index);
                } else {
                    layer.msg('新密码与确认密码不一致', { icon: 2 });
                }
            } else {
                layer.msg('请输入新密码和确认密码', { icon: 2 });
            }
        },
        btn2: function (index, layero) {
            layer.close(index)
        }
    });
})

$('#exit').click(function () {
    layer.confirm('确认要退出当前账号吗?', { btn: ['确定', '取消'], title: "提示" }, function () {
        window.location.href = "/login";
        $.cookie('token', null);
    });

})

setTimeout(function () {
    const height = $(window).height() - $('#footer').height() - $('#header').height() - $('#rowcount').height() - 115

    hot.updateSettings({
        height
    })
}, 300)

window.onresize = function () {
    const height = $(window).height() - $('#footer').height() - $('#header').height() - $('#rowcount').height() - 115

    hot.updateSettings({
        height
    })
}

var urltoJSON = function (url) {
    var arr = url.split('&');
    var p = {}
    arr.forEach(a => {
        var k = a.split('=')[0]
        var v = a.split('=')[1]
        p[k] = v;
    })
    return p;
}

//base64转码
var base64 = function (s) {
    return window.btoa(unescape(encodeURIComponent(s)));
};
//替换table数据和worksheet名字
var format = function (s, c) {
    return s.replace(/{(\w+)}/g,
        function (m, p) {
            return c[p];
        });
}
function tableToExcel(dom, sheetName) {
    var uri = 'data:application/vnd.ms-excel;base64,';
    var template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel"' +
        'xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>'
        + '<x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines /></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets>'
        + '</x:ExcelWorkbook></xml><![endif]-->' +
        '</head><body ><table class="excelTable">{table}</table></body></html>';

    var ctx = { worksheet: sheetName || 'sheet1', table: dom };
    window.open(uri + base64(format(template, ctx)));
}