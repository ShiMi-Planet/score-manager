var loader,
  verify_state = false;
const f = document.querySelector('body > div > div.col-md-6.col-lg-5.col-xl-4.align-self-center > div > form');
const login_btn = document.querySelector('#register');

$(document).ready(function () {
  load_verify();
});

f.addEventListener('submit', function (e) {
  let register_mask = mask_loading('注册中...');
  e.preventDefault();
  login_btn.innerHTML = '注册中...';
  login_btn.disabled = true;
  if (!verify_state) {
    mask_destroy(register_mask);
    // document.querySelector('#slider-verification > div > div.ui-slider-text.ui-slider-no-select').style.color = 'red';
    notify('您还没有验证哦！', 'warning');
    login_btn.innerHTML = '注册账号';
    login_btn.disabled = false;
    return false;
  }

  if (!f.checkValidity()) {
    e.preventDefault();
    e.stopPropagation();
    f.className += ' was-validated';
    login_btn.innerHTML = '注册账号';
    login_btn.disabled = false;
    mask_destroy(register_mask);
    return false;
  } else {
    var username = document.querySelector('#username').value;
    var password = document.querySelector('#password').value;
    register(username, password, register_mask);
  }
});

function register(username, password, mask) {
  const settings = {
    async: true,
    crossDomain: true,
    url: server + '/user/register',
    method: 'POST',
    headers: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    data: {
      username: username,
      password: password
    },
    xhrFields: {
      withCredentials: true
    }
  };

  $.ajax(settings).done(function (response) {
    if (response.code == 200) {
      notify('注册成功，即将进入首页！', 'success');
      setTimeout(() => {
        window.open('../index.html', '_self');
      }, 2000);
    } else {
      notify(response.message, 'warning');
      login_btn.innerHTML = '注册账号';
      login_btn.disabled = false;
      mask_destroy(mask);
    }
  });
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
