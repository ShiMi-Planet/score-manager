window.onload = function () {
  get_data();
};

function get_data() {
  const settings = {
    async: true,
    crossDomain: true,
    url: server + '/article/list',
    method: 'GET',
    headers: {},
    xhrFields: {
      withCredentials: true
    }
  };

  $.ajax(settings).done(function (response) {
    if (response.code == 200) {
      fill_data(response.data);
    } else {
      notify(response.message, 'danger');
    }
  });
}

function fill_data(data) {
  layui.use(['table', 'layer'], function () {
    var layer = layui.layer;
    var table = layui.table;
    var $ = layui.jquery;
    var cols = [
      { field: 'id', title: 'ID', align: 'center', unresize: true },
      {
        field: 'image',
        title: '图像',
        sort: false,
        templet: function (e) {
          return `<img src="${e.image}" alt="">`;
        }
      },
      { field: 'article', title: '文本', sort: true },
      { fixed: 'right', title: '操作', toolbar: '#ToolBar', unresize: true, unresize: false }
    ];

    cols = cols.filter(function (col) {
      return col.field !== 'id';
    });

    inst = table.render({
      elem: '#history',
      toolbar: ['exports', 'print'],
      cols: [cols],
      data: data,
      skin: 'row',
      even: true,
      page: true,
      limit: 10,
      limits: [5, 10, 20, 50],
      totalRow: false,
      loading: true
    });
    table.on('tool(history)', function (obj) {
      var data = obj.data;
      var event = obj.event;

      if (event === 'detail') {
        window.open('./detail.html?id=' + data.id, '_blank');
      } 
      // else if (event === 'del') {
      //   layer.confirm('确认删除记录吗？识别结果：' + data.article, function (index) {
      //     layer.close(index);
      //     let delete_mask = mask_loading('记录删除中...');
      //     delete_record(data.id, obj, delete_mask);
      //   });
      // }
    });
  });
}

function delete_record(id, obj, mask) {
  const settings = {
    async: false,
    crossDomain: true,
    url: server + '/article/delete',
    method: 'POST',
    headers: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    data: {
      id: id
    }
  };

  $.ajax(settings).done(function (response) {
    if (response.code == 200) {
      obj.del();
      notify('记录删除成功！', 'success');
    } else {
      notify(response.message, 'warning');
    }
  });
  setTimeout(() => {
    destroy_mask(mask);
  }, 1000);
}
