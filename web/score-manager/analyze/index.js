window.onload = function () {
  get_data()
}

var origin_data = []

function get_data() {
  const settings = {
    "async": false,
    "crossDomain": true,
    "url": server + "/exam/list/all",
    "method": "GET",
    "headers": {},
    "xhrFields": {
      withCredentials: true
    }
  };

  $.ajax(settings).done(function (response) {
    if (response.code == 200) {
      origin_data = response.data
      fill_data(response.data)
    } else {
      notify(response.message, "danger")
    }
  });
}

var inst

function fill_data(data) {
  layui.use(['table', 'layer'], function () {
    var layer = layui.layer;
    var table = layui.table;
    var $ = layui.jquery;
    var cols = [
      { field: 'id', title: "ID", align: "center", unresize: true },
      { field: 'name', title: "测试名称", width: 250, sort: true },
      { field: 'date', title: "测试日期", width: 140, sort: true },
      { field: 'class', title: "班级排名", align: "center", sort: true, edit: function (d) { return !d.LAY_DISABLED } },
      { field: 'grade', title: "年级排名", align: "center", sort: true, edit: function (d) { return !d.LAY_DISABLED } },
      { field: 'score', title: "总分", align: "center", sort: true },
      { fixed: 'right', title: "操作", toolbar: '#ToolBar', unresize: true, width: 200 },
    ]

    cols = cols.filter(function (col) {
      return col.field !== 'id';
    });

    inst = table.render({
      elem: '#test_data',
      toolbar: ['exports', 'print'],
      cols: [cols],
      data: data,
      editTrigger: 'dblclick',
      skin: 'row',
      even: true,
      page: true,
      limit: 10,
      limits: [5, 10, 20, 50],
      totalRow: false,
      loading: true,
    })
    table.on('tool(test_data)', function (obj) {
      var data = obj.data;
      var event = obj.event;

      if (event === 'update') {
        layer.confirm('确认更新排名信息？=>测试名称：' + data.name + '; 班级排名：' + data.class + '; 年级排名：' + data.grade + ';', function (index) {
          update_data(data.id, data.class, data.grade)
          layer.close()
        })
      } else if (event === 'del') {
        layer.confirm('确认删除记录吗？测试名称：' + data.name, function (index) {
          delete_record(data.id, obj)
          layer.close(index)
        });
      }
    });
  })
}

function delete_record(id, obj) {
  body_loading_mask()
  const settings = {
    "async": false,
    "crossDomain": true,
    "url": server + "/exam/delete/" + id,
    "method": "POST",
    "headers": {},
    "xhrFields": {
      withCredentials: true
    }
  };

  $.ajax(settings).done(function (response) {
    if (response.code == 200) {
      obj.del();
      notify("已删除记录" + id, "success")
      get_data()
      body_loading_mask_destroy()
    } else {
      notify(response.message, "danger")
      body_loading_mask_destroy()
    }
  });
}

function update_data(id, class_r, grade_r) {
  body_loading_mask()
  const settings = {
    "async": true,
    "crossDomain": true,
    "url": server + "/exam/update/" + id + "/3/" + class_r + "/" + grade_r,
    "method": "POST",
    "headers": {},
    "xhrFields": {
      withCredentials: true
    }
  };

  $.ajax(settings).done(function (response) {
    if (response.code == 200) {
      notify("已更新记录" + id, "success")
      body_loading_mask_destroy()
    } else {
      notify(response.message, "danger")
      get_data()
      body_loading_mask_destroy()
    }
  });
}