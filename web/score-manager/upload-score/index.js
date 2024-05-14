window.onload = function () {
  get_data();
};

var data = {
  subject: [],
  subject_name: [],
  full_score: []
};

var index = 0;

function get_data() {
  const settings = {
    async: true,
    crossDomain: true,
    url: server + '/subject/list?method=true',
    method: 'GET',
    headers: {},
    xhrFields: {
      withCredentials: true
    }
  };

  $.ajax(settings).done(function (response) {
    if (response.code == 200) {
      response.subject.forEach(e => {
        data['subject'].push(e['subject']);
        data['subject_name'].push(e['subject_name']);
        data['full_score'].push(e['full_score']);
      });
      insert_card();
    } else {
      notify(response.message, 'danger');
    }
  });
}

function insert_card() {
  index++;
  var code = ``,
    insert = ``;
  for (let i = 0; i < data['subject'].length; i++) {
    const subject = data['subject'][i];
    const s_name = data['subject_name'][i];
    const full = data['full_score'][i];
    code += `
      <div class="col-md-4 col-sm-12" id="score_${index}">
        <div class="input-group mb-3">
          <span class="input-group-text">${s_name}</span>
          <input type="number" min="0" max="${full}" class="form-control" placeholder="${s_name}分数" id="${index}_score_${subject}">
          <span class="input-group-text">分</span>
        </div>
      </div>
    `;
  }
  insert = `
    <div class="col-lg-12" id="${index}_card">
      <div class="card">
        <header class="card-header">
          <div class="card-title">成绩录入 - #${index}</div>
        </header>
        <div class="card-body">
          <div class="input-group mb-3">
            <span class="input-group-text" style="display: inline;">
              <p style="color: red;display: inline;">*</p>
              <p style="display: inline;">测试名称</p>
            </span>
            <input type="text" class="form-control" placeholder="请输入需要录入的测试的名称" required id="${index}_test_name">
          </div>
          <div class="row">
            <div class="col-md-6 col-sm-12">
              <div class="input-group mb-3">
                <span class="input-group-text">班级排名</span>
                <input type="number" min="1" class="form-control" placeholder="请输入本次测试的班级排名" id="${index}_class_array">
              </div>
            </div>
            <div class="col-md-6 col-sm-12">
              <div class="input-group mb-3">
                <span class="input-group-text">年级排名</span>
                <input type="number" min="1" class="form-control" placeholder="请输入本次测试的年级排名" id="${index}_grade_array">
              </div>
            </div>
          </div>
          <div class="row">
            <hr>
            <div class="col-12" style="text-align: center;">
              <b style="font-size: medium;">测试分数收集</b>
            </div>
            ${code}
          </div>
          <button type="button" class="btn btn-danger float-end" style="margin-right: 1rem;" onclick="delete_card(${index})">删除</button>
          <button type="reset" class="btn btn-secondary float-end" style="margin-right: 1rem;" id="reset_${index}">重置</button>
        </div>
      </div>
    </div>`;
  document.getElementById('card-group').insertAdjacentHTML('beforeend', insert);
}

function delete_card(id) {
  $.alert({
    title: '确认删除成绩卡片',
    content: '成绩卡片删除后成绩不会被保存，确定删除卡片吗？',
    type: 'danger',
    animation: 'scale',
    closeAnimation: 'right',
    buttons: {
      delete: {
        text: '确认删除卡片',
        btnClass: 'btn-danger',
        action: function () {
          this.setCloseAnimation('scale');
          document.getElementById(id + '_card').outerHTML = '';
        }
      },
      cancel: {
        text: '手滑了~',
        btnClass: 'btn-primary',
        action: function () {
          this.setCloseAnimation('scale');
        }
      }
    },
    backgroundDismiss: function () {
      return false;
    }
  });
}

document.getElementById('add-item').addEventListener('click', () => {
  insert_card();
});

var state = true;
document.getElementById('update').addEventListener('click', function () {
  let masker = mask_loading('数据更新中...');
  const btn = document.getElementById('update');
  btn.disabled = true;
  btn.innerText = '分析报告生成中...';
  var submit_state = true;
  setTimeout(() => {
    console.log('Ready to Upload scores.');
  }, 1000);
  for (let item = 1; item <= index; item++) {
    const card = document.getElementById(item + '_card');
    if (!card) {
      continue;
    } else {
      var name = '',
        class_array,
        grade_array,
        score = '';
      name = document.getElementById(item + '_test_name').value;
      if (name == '') {
        notify('记录' + item + ' - 请输入考试名称！', 'danger', 2500);
        submit_state = false;
        continue;
      } else {
        data.subject.forEach(sn => {
          score += sn + ',' + document.getElementById(item + '_score_' + sn).value + ';';
        });
        class_array = document.getElementById(item + '_class_array').value;
        grade_array = document.getElementById(item + '_grade_array').value;
        update(name, class_array, grade_array, score, item);
        if (state) {
          continue;
        } else {
          submit_state = false;
          continue;
        }
      }
    }
  }
  setTimeout(() => {
    console.log(submit_state);
    btn.disabled = false;
    btn.innerText = '提交成绩';
    if (submit_state) {
      location.reload();
    }
    mask_destroy(masker);
  }, 1000);
});

function update(test_name, class_array, grade_array, score, item) {
  const settings = {
    async: true,
    crossDomain: true,
    url: server + '/exam/add/record',
    method: 'POST',
    headers: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    data: {
      name: test_name,
      class: class_array,
      grade: grade_array,
      score: score
    },
    xhrFields: {
      withCredentials: true
    }
  };

  $.ajax(settings).done(function (response) {
    if (response.code == 200) {
      notify('记录' + item + '添加成功！', 'info');
      document.getElementById(item + '_card').outerHTML = '';
      state = true;
    } else {
      notify('记录' + item + '添加失败! 错误原因：' + response.message, 'danger', 2500);
      state = false;
    }
  });
}
