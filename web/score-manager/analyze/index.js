window.onload = function () {
  get_data();
};

var origin_data = [];

function get_data() {
  const settings = {
    async: true,
    crossDomain: true,
    url: server + '/exam/list/all',
    method: 'GET',
    headers: {},
    xhrFields: {
      withCredentials: true
    }
  };

  $.ajax(settings).done(function (response) {
    if (response.code == 200) {
      origin_data = response.data;
      fill_data(response.data);
    } else {
      notify(response.message, 'danger');
    }
  });
}

var inst;

function fill_data(data) {
  layui.use(['table', 'layer'], function () {
    var layer = layui.layer;
    var table = layui.table;
    var $ = layui.jquery;
    var cols = [
      { field: 'id', title: 'ID', align: 'center', unresize: true },
      { field: 'name', title: '测试名称', width: 250, sort: true },
      { field: 'date', title: '测试日期', width: 140, sort: true },
      {
        field: 'class',
        title: '班级排名',
        align: 'center',
        sort: true,
        edit: function (d) {
          return !d.LAY_DISABLED;
        }
      },
      {
        field: 'grade',
        title: '年级排名',
        align: 'center',
        sort: true,
        edit: function (d) {
          return !d.LAY_DISABLED;
        }
      },
      { field: 'score', title: '总分', align: 'center', sort: true },
      { fixed: 'right', title: '操作', toolbar: '#ToolBar', unresize: true, width: 270 }
    ];

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
      loading: true
    });
    table.on('tool(test_data)', function (obj) {
      var data = obj.data;
      var event = obj.event;

      if (event === 'update') {
        layer.confirm('确认更新排名信息？=>测试名称：' + data.name + '; 班级排名：' + data.class + '; 年级排名：' + data.grade + ';', function (index) {
          layer.close(index);
          update_data(data.id, data.class, data.grade);
        });
      } else if (event === 'del') {
        layer.confirm('确认删除记录吗？测试名称：' + data.name, function (index) {
          layer.close(index);
          delete_record(data.id, obj);
        });
      } else if (event === 'detail') {
        window.open('./detail.html?id=' + data.id, '_blank');
      }
    });
  });
}

function delete_record(id, obj) {
  let delete_mask = mask_loading('删除中...');
  const settings = {
    async: true,
    crossDomain: true,
    url: server + '/exam/delete/' + id,
    method: 'POST',
    headers: {},
    xhrFields: {
      withCredentials: true
    }
  };

  $.ajax(settings).done(function (response) {
    if (response.code == 200) {
      obj.del();
      notify('已删除记录' + id, 'success');
      get_data();
      mask_destroy(delete_mask);
    } else {
      notify(response.message, 'danger');
      mask_destroy(delete_mask);
    }
  });
}

function update_data(id, class_r, grade_r) {
  let update_mask = mask_loading('数据更新中...');
  const settings = {
    async: true,
    crossDomain: true,
    url: server + '/exam/update/' + id + '/3/' + class_r + '/' + grade_r,
    method: 'POST',
    headers: {},
    xhrFields: {
      withCredentials: true
    }
  };

  $.ajax(settings).done(function (response) {
    if (response.code == 200) {
      notify('已更新记录' + id, 'success');
      mask_destroy(update_mask);
    } else {
      notify(response.message, 'danger');
      get_data();
      mask_destroy(update_mask);
    }
  });
}
