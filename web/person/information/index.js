window.onload = function () {
  const settings = {
    async: true,
    crossDomain: true,
    url: server + '/user/getname',
    method: 'GET',
    headers: {},
    xhrFields: {
      withCredentials: true
    }
  };

  $.ajax(settings).done(function (response) {
    document.querySelector('#profile_username').value = response.username;
  });
  get_data();
};

var data = {
  'top-bar-count': {
    question_count: null,
    subject_count: null,
    test_count: null
  },
  'top-bar-name': {
    question_name: '错题本题目总数',
    subject_name: '学科总数',
    test_name: '已记录考试总数'
  },
  'top-bar-color': {
    question_color: 'primary',
    subject_color: 'success',
    test_color: 'danger'
  },
  'top-bar-icon': {
    question_icon: 'mdi-archive-refresh',
    subject_icon: 'mdi-school',
    test_icon: 'mdi-clipboard-text'
  },
  'top-bar': ['question_', 'subject_', 'test_']
};

function get_data() {
  const settings = {
    async: true,
    crossDomain: true,
    url: server + '/info',
    method: 'GET',
    headers: {},
    xhrFields: {
      withCredentials: true
    }
  };

  $.ajax(settings).done(function (response) {
    if (response.code == 200) {
      data['top-bar-count'].question_count = response.correct;
      data['top-bar-count'].subject_count = response.subject;
      data['top-bar-count'].test_count = response.test;
    } else {
      notify(response.message, 'warning');
    }
    fill_topbar_data();
  });
}

function fill_topbar_data() {
  data['top-bar'].forEach(n => {
    var code = `
    <div class="col-md-4 col-xs-12">
      <div class="card bg-${data['top-bar-color'][n + 'color']} text-white">
        <div class="card-body">
          <div class="d-flex justify-content-between">
            <span class="avatar-md rounded-circle bg-white bg-opacity-25 avatar-box">
              <i class="mdi ${data['top-bar-icon'][n + 'icon']} fs-4"></i>
            </span>
            <span class="fs-4">${data['top-bar-count'][n + 'count']}</span>
          </div>
          <div class="text-end">${data['top-bar-name'][n + 'name']}</div>
        </div>
      </div>
    </div>`;
    document.getElementById('top-bar').innerHTML += code;
  });
}

function logout() {
  let logout_mask = mask_loading('退出登录中...');
  const settings = {
    async: true,
    crossDomain: true,
    url: server + '/user/logout',
    method: 'GET',
    headers: {},
    xhrFields: {
      withCredentials: true
    }
  };

  $.ajax(settings).done(function (response) {
    if (response.code == 200) {
      notify('登出成功！', 'success');
      setTimeout(() => {
        window.parent.open('/login/index.html', '_self');
      }, 2000);
    } else {
      notify(response.message, 'danger');
      mask_destroy(logout_mask);
    }
  });
}
