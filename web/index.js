window.onload = function () {
  check_state();
};

function check_state() {
  const settings = {
    async: false,
    crossDomain: true,
    url: server + '/user/state',
    method: 'GET',
    headers: {},
    xhrFields: {
      withCredentials: true
    }
  };

  $.ajax(settings).done(function (response) {
    if (response.state != true) {
      let false_login = mask_loading('加载中...');
      notify('似乎还没有登录哦~', 'warning');
      setTimeout(() => {
        mask_destroy(false_login);
        window.open('./login/index.html', '_self');
      }, 2000);
    } else {
      set_username();
    }
  });
}

function set_username() {
  const settings = {
    async: false,
    crossDomain: true,
    url: server + '/user/getname',
    method: 'GET',
    headers: {},
    xhrFields: {
      withCredentials: true
    }
  };

  $.ajax(settings).done(function (response) {
    document.querySelector('#username').innerHTML = response.username;
  });
}
