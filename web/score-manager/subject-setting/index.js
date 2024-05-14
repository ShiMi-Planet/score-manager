var data = {
  head: ['序号', '学科', '满分', '状态', '线条颜色'],
  s_list: [],
  body: []
};

window.onload = function () {
  get_data();
  fill_table_head();
  fill_table_body();
};

function get_data() {
  const settings = {
    async: true,
    crossDomain: true,
    url: server + '/subject/list',
    method: 'GET',
    headers: {},
    xhrFields: {
      withCredentials: true
    }
  };

  $.ajax(settings).done(function (response) {
    if (response.code == 200) {
      data['body'] = response.subject;
    } else {
      notify(response.message, 'danger');
    }
  });
}

function fill_table_head() {
  var head = ``;
  data['head'].forEach(e => {
    if (e == '编号') {
      head += `
        <th style="text-align: center; width: 4rem; ">
          <div class="th-inner sortable both">编号</div>
          <div class="fht-cell"></div>
        </th>`;
    } else if (e == '满分') {
      head += `
        <th style="text-align: center; width: 6rem; ">
          <div class="th-inner sortable both">满分</div>
          <div class="fht-cell"></div>
        </th>`;
    } else if (e == '线条颜色') {
      head += `
        <th style="text-align: center; width: 6rem; ">
          <div class="th-inner sortable both">线条颜色</div>
          <div class="fht-cell"></div>
        </th>`;
    } else if (e == '状态') {
      head += `
        <th style="text-align: center; width: 2rem; ">
          <div class="th-inner sortable both">状态</div>
          <div class="fht-cell"></div>
        </th>`;
    } else {
      head += `
        <th style="text-align: center;">
          <div class="th-inner ">${e}</div>
          <div class="fht-cell"></div>
        </th>`;
    }
  });
  document.getElementById('table-head').innerHTML = head;
}

function fill_table_body() {
  data['body'].forEach(e => {
    var tbody = ``;
    data['s_list'].push(e['subject']);
    var color = e['color'];
    if (color == null) {
      color = '250,150,170';
    }
    var color_r, color_g, color_b;
    color_r = color.split(',')[0];
    color_g = color.split(',')[1];
    color_b = color.split(',')[2];
    var hex = rgbToHex(color_r, color_g, color_b);
    var state;
    if (e['state']) {
      state = `<input class="form-check-input form-check-green" type="checkbox" id="${e['subject']}_check" checked>`;
    } else {
      state = `<input class="form-check-input form-check-green" type="checkbox" id="${e['subject']}_check">`;
    }
    tbody += `
    <tr>
      <th style="text-align: center; width: 4rem; ">${e['id']}</td>
      <td style="text-align: center;" id="${e['subject']}">${e['subject_name']}</td>
      <td style="text-align: center;">
        <input class="form-control" type="input" value="${e['full_score']}" id="${e['subject']}_score" style="width:6rem;text-align:center;margin:auto;"></input>
      </td>
      <td style="text-align: center;">
        <div class="form-check form-switch">
          ${state}
        </div>
      </td>
      <td style="text-align: center;">
        <input type="color" class="form-control" id="${e['subject']}_color" value="${hex}"/>
      </td>
    </tr>`;
    document.getElementById('table-body').innerHTML += tbody;
  });
}

function getColorValue(e) {
  var colorPicker = e;
  var colorValue = colorPicker.value;
  var rgbValue = hexToRgb(colorValue);
  return rgbValue;
}

function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? parseInt(result[1], 16) + ',' + parseInt(result[2], 16) + ',' + parseInt(result[3], 16) : null;
}

// function convertColor(rgbValue) {
//   return rgbToHex(parseInt(rgbValue.slice(4, 5)), parseInt(rgbValue.slice(7, 8)), parseInt(rgbValue.slice(10, 11)));
// }

function rgbToHex(r, g, b) {
  return '#' + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1);
}

document.querySelector('#update').addEventListener('click', () => {
  let update_mask = mask_loading('更新中...');
  const upBtn = document.querySelector('#update');
  var loader;
  upBtn.innerHTML = '更新中...';
  upBtn.disabled = true;
  loader = $('button:submit').lyearloading({
    opacity: 0.2,
    spinnerSize: 'nm'
  });
  var subject_list = '',
    state_list = '',
    score_list = '',
    color_list = '';
  data['s_list'].forEach(e => {
    subject_list += e + ',';
    state_list += document.getElementById(e + '_check').checked + ',';
    score_list += document.getElementById(e + '_score').value + ',';
    color_list += getColorValue(document.getElementById(e + '_color')) + ';';
  });

  const settings = {
    async: true,
    crossDomain: true,
    url: server + '/subject/update',
    method: 'POST',
    headers: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    data: {
      subject_list: subject_list,
      state_list: state_list,
      score_list: score_list,
      color_list: color_list
    },
    xhrFields: {
      withCredentials: true
    }
  };

  $.ajax(settings).done(function (response) {
    if (response.code == 200) {
      notify('数据更新成功！', 'success');
      upBtn.innerHTML = '更新数据';
      upBtn.disabled = false;
      mask_destroy(update_mask);
      setTimeout(() => {
        location.reload();
      }, 2000);
    } else {
      notify(response.message, 'danger');
      upBtn.innerHTML = '更新数据';
      upBtn.disabled = false;
      mask_destroy(update_mask);
    }
  });
});
