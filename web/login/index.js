window.onload = () => {
  delCookie("session");
  valid_login(0)
}

var loader, login_state;
const f = document.querySelector("body > div > div.col-md-6.col-lg-5.col-xl-4.align-self-center > div > form");
const login_btn = document.querySelector("#login");

f.addEventListener('submit', function (e) {
  e.preventDefault();
  login_btn.innerHTML = "登录中...";
  login_btn.disabled = true;
  loader = $('button:submit').lyearloading({
    opacity: 0.2,
    spinnerSize: 'nm'
  });
  if (!f.checkValidity()) {
    e.stopPropagation();
    f.className += " was-validated"
    login_btn.innerHTML = "立即登录";
    login_btn.disabled = false;
    loader.destroy()
    return false;
  }
  else {
    var username = document.getElementById("username").value
    var password = document.getElementById("password").value
    var remember = document.querySelector("#rememberme").checked ? 1 : 0
    const settings = {
      "async": false,
      "crossDomain": true,
      "url": server + "/user/login",
      "method": "POST",
      "headers": {
        "content-type": "application/x-www-form-urlencoded"
      },
      "data": {
        "username": username,
        "password": password,
        "remember": remember
      },
      "xhrFields": {
        withCredentials: true
      }
    };

    $.ajax(settings).done(function (response) {
      login_btn.innerHTML = "立即登录";
      login_btn.disabled = false;
      loader.destroy()
      if (response.code == 200) {
        valid_login(1)
      } else {
        document.getElementById("password").value = ""
        notify(response.message, "danger")
      }
    });
  }
})

function get_login_state() {
  const settings = {
    "async": false,
    "crossDomain": true,
    "url": server + "/user/state",
    "method": "GET",
    "headers": {},
    "xhrFields": {
      withCredentials: true
    }
  };

  $.ajax(settings).done(function (response) {
    console.log(response.state)
    login_state = response.state
  });
}

function logout() {
  const settings = {
    "async": true,
    "crossDomain": true,
    "url": server + "/user/logout",
    "method": "GET",
    "headers": {},
    "xhrFields": {
      withCredentials: true
    }
  };

  $.ajax(settings).done(function (response) {
    console.log('success logout!');
  });
}

async function valid_login(step) {
  await get_login_state()
  if (step == 0) {
    if (login_state) {
      login_btn.innerHTML = "登录中...";
      login_btn.disabled = true;
      loader = $('button:submit').lyearloading({
        opacity: 0.2,
        spinnerSize: 'nm'
      });
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
              login_btn.innerHTML = "立即登录";
              login_btn.disabled = false;
              loader.destroy()
              logout()
            }
          },
          cancel: {
            text: '取消',
            btnClass: 'btn-default',
            action: function () {
              this.setCloseAnimation('scale');
              setTimeout(() => {
                window.open("../index.html", "_self");
              }, 1000);
            }
          }
        },
        backgroundDismiss: function () {
          return false;
        },
      });
    }
  }
  if (step == 1) {
    if (login_state) {
      notify("登录成功，即将进入首页！", "success")
      setTimeout(() => {
        window.open("../index.html", "_self");
      }, 2000);
    } else {
      notify("登录失败，错误原因：浏览器异常，建议刷新重试！", "warning")
    }
  }
}