window.onload = () => {
  let onload_mask = mask_loading('加载中...');
  let login_state = false;
  const valie_options = { method: 'GET', credentials: 'include' };

  fetch(server + '/user/state', valie_options)
    .then(response => response.json())
    .then(response => {
      console.log(response.state);
      login_state = response.state;
      valid_login(login_state);
    })
    .catch(err => console.error(err));
  // delCookie('session');
  load_verify();
  mask_destroy(onload_mask);
};

var verify_state = false;
const f = document.querySelector('body > div > div.col-md-6.col-lg-5.col-xl-4.align-self-center > div > form');
const login_btn = document.querySelector('#login');

f.addEventListener('submit', function (e) {
  e.preventDefault();
  if (!verify_state) {
    document.querySelector('#imgVer').style = 'width: fit-content; margin: auto; border: dashed; border-color: red;';
    notify('您还没有验证哦！', 'warning');
    return false;
  }
  login_btn.innerHTML = '登录中...';
  login_btn.disabled = true;
  var login_btn_mask = mask_loading('登录中...');
  if (!f.checkValidity()) {
    e.stopPropagation();
    f.className += ' was-validated';
    login_btn.innerHTML = '立即登录';
    login_btn.disabled = false;
    mask_destroy(login_btn_mask);
    return false;
  } else {
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;
    var remember = document.querySelector('#rememberme').checked ? 1 : 0;
    // login
    const options = {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        username: username,
        password: password,
        remember: remember
      }),
      credentials: 'include'
    };

    fetch(server + '/user/login', options)
      .then(response => response.json())
      .then(response => {
        if (response.code == 200 && response.login == true) {
          notify('登录成功，即将进入首页！', 'success');
          setTimeout(() => {
            window.open('../index.html', '_self');
          }, 2000);
        } else {
          login_btn.innerHTML = '立即登录';
          login_btn.disabled = false;
          mask_destroy(login_btn_mask);
          document.getElementById('password').value = '';
          notify(response.message, 'danger');
        }
      })
      .catch(err => console.error(err));
  }
});

function logout() {
  const options = { method: 'GET', credentials: 'include' };

  fetch(server + '/user/logout', options)
    .then(response => response.json())
    .then(response => {
      if (response.code != 200) {
        notify(response.message, 'danger');
        return;
      } else {
        return;
      }
    })
    .catch(err => console.error(err));
}

function valid_login(state) {
  console.log(state);
  if (state) {
    login_btn.innerHTML = '登录中...';
    login_btn.disabled = true;
    // var login_btn_mask = mask_loading('加载中...');
    $.alert({
      title: '继续登录',
      content: '检测到您已登录，是否退出登录？',
      type: 'orange',
      animation: 'scale',
      closeAnimation: 'right',
      buttons: {
        exit: {
          text: '确认退出',
          btnClass: 'btn-danger',
          action: function () {
            this.setCloseAnimation('scale');
            login_btn.innerHTML = '立即登录';
            login_btn.disabled = false;
            // mask_destroy(login_btn_mask);
            logout();
          }
        },
        cancel: {
          text: '取消',
          btnClass: 'btn-default',
          action: function () {
            this.setCloseAnimation('scale');
            setTimeout(() => {
              window.open('../index.html', '_self');
            }, 1000);
          }
        }
      },
      backgroundDismiss: function () {
        return false;
      }
    });
  }
}

function load_verify() {
  imgVer({
    el: '$("#imgVer")',
    width: '260',
    height: '116',
    img: [
      '/images/gallery/1.jpg',
      '/images/gallery/2.jpg',
      '/images/gallery/3.jpg',
      '/images/gallery/4.jpg',
      '/images/gallery/5.jpg',
      '/images/gallery/6.jpg',
      '/images/gallery/7.jpg',
      '/images/gallery/8.jpg',
      '/images/gallery/9.jpg',
      '/images/gallery/10.jpg'
    ],
    success: function () {
      verify_state = true;
      document.querySelector('body > div > div.col-md-6.col-lg-5.col-xl-4.align-self-center > div > form > div:nth-child(3)').outerHTML = '';
    },
    error: function () {
      setTimeout(() => {
        load_verify();
      }, 1500);
    }
  });
}
