var loader, verify_state = false
const f = document.querySelector("body > div > div.col-md-6.col-lg-5.col-xl-4.align-self-center > div > form");
const login_btn = document.querySelector("#register");

f.addEventListener('submit', function (e) {
  e.preventDefault()
  if (!verify_state) {
    document.querySelector("#slider-verification > div > div.ui-slider-text.ui-slider-no-select").style.color = "red"
    notify("您还没有验证哦！", "warning")
    return false
  }
  login_btn.innerHTML = "注册中...";
  login_btn.disabled = true;
  loader = $('button:submit').lyearloading({
    opacity: 0.2,
    spinnerSize: 'nm'
  });
  if (!f.checkValidity()) {
    e.preventDefault();
    e.stopPropagation();
    f.className += " was-validated"
    login_btn.innerHTML = "注册账号";
    login_btn.disabled = false;
    loader.destroy()
    return false;
  }
  else {
    var username = document.querySelector("#username").value
    var password = document.querySelector("#password").value
    register(username, password)
  }
});

function register(username, password) {
  const settings = {
    "async": false,
    "crossDomain": true,
    "url": server + "/user/register",
    "method": "POST",
    "headers": {
      "content-type": "application/x-www-form-urlencoded"
    },
    "data": {
      "username": username,
      "password": password
    },
    "xhrFields": {
      withCredentials: true
    }
  };

  $.ajax(settings).done(function (response) {
    if (response.code == 200) {
      $.notify({
        message: '注册成功，即将返回登录页面！',
      }, {
        type: 'success',
        placement: {
          from: 'top',
          align: 'right'
        },
        z_index: 10800,
        delay: 1500,
        animate: {
          enter: 'animate__animated animate__fadeInUp',
          exit: 'animate__animated animate__fadeOutDown'
        }
      })
      setTimeout(() => {
        window.open("../login/index.html", "_self");
      }, 2000);
    } else {
      $.notify({
        message: response.message,
      }, {
        type: 'danger',
        placement: {
          from: 'top',
          align: 'right'
        },
        z_index: 10800,
        delay: 1500,
        animate: {
          enter: 'animate__animated animate__fadeInUp',
          exit: 'animate__animated animate__fadeOutDown'
        }
      })
      login_btn.innerHTML = "注册账号";
      login_btn.disabled = false;
      loader.destroy()
    }
  });
}