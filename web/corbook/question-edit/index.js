window.onload = function () {
  get_data();
};

var origin_data = [];

function get_data() {
  const settings = {
    async: false,
    crossDomain: true,
    url: server + '/corbook/list',
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
      { field: 'question', title: '错题题目', unresize: true, width: 300, templet: '#question_show' },
      { field: 'subject_name', title: '科目', width: 120, sort: true },
      { field: 'date', title: '录入时间', align: 'center', unresize: true, sort: true, width: 200 },
      { field: 'test', title: '关联测试' },
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

      if (event === 'del') {
        layer.confirm('确认删除记录吗？错题内容：' + data.question, function (index) {
          let del_mask = mask_loading('删除中...');
          layer.close(index);
          delete_record(data.id, obj, del_mask);
        });
      } else if (event === 'detail') {
        window.open('./detail.html?id=' + data.id, '_blank');
      }
    });
  });
}

function delete_record(id, obj, mask) {
  const settings = {
    async: false,
    crossDomain: true,
    url: server + '/corbook/delete',
    method: 'POST',
    headers: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    data: {
      id: id
    },
    xhrFields: {
      withCredentials: true
    }
  };

  $.ajax(settings).done(function (response) {
    if (response.code == 200) {
      obj.del();
      notify('已删除记录' + id, 'success');
      get_data();
    } else {
      notify(response.message, 'danger');
    }
  });
  setTimeout(() => {
    mask_destroy(mask);
  }, 1500);
}

function update_data(id, class_r, grade_r) {
  body_loading_mask();
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
      body_loading_mask_destroy();
    } else {
      notify(response.message, 'danger');
      get_data();
      body_loading_mask_destroy();
    }
  });
}
