const f = document.querySelector('body > div > div > div > div > div > form');
const cancel = document.querySelector('body > div > div > div > div > div > form > button.btn.btn-secondary');
const subBtn = document.querySelector('body > div > div > div > div > div > form > button');

f.addEventListener('submit', e => {
  e.preventDefault();
  subBtn.innerHTML = '请稍后...';
  subBtn.disabled = true;
  let change_mask = mask_loading('', 'button:submit');
  if (!f.checkValidity()) {
    e.stopPropagation();
    f.className += ' was-validated';
    subBtn.innerHTML = '修改密码';
    subBtn.disabled = false;
    mask_destroy(change_mask);
    return false;
  } else {
    var old = document.querySelector('#old-password').value;
    var newp = document.querySelector('#new-password').value;
    var c_newp = document.querySelector('#confirm-password').value;
    if (!(newp == c_newp)) {
      notify('两次输入的新密码不同，请检查后再提交！', 'warning', 2000);
      subBtn.innerHTML = '修改密码';
      subBtn.disabled = false;
      mask_destroy(change_mask);
      return false;
    } else {
      const settings = {
        async: true,
        crossDomain: true,
        url: server + '/user/change_password',
        method: 'POST',
        headers: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        data: {
          old_password: old,
          new_password: newp
        },
        xhrFields: {
          withCredentials: true
        }
      };

      $.ajax(settings).done(function (response) {
        body_loading_mask();
        if (response.code == 200) {
          notify('密码修改成功，将在2s后重新登录！', 'success', 1500);
          backtoLogin();
        } else {
          body_loading_mask_destroy();
          notify(response.message, 'danger');
          subBtn.innerHTML = '修改密码';
          subBtn.disabled = false;
          mask_destroy(change_mask);
        }
      });
    }
  }
});

function backtoLogin() {
  $.alert({
    title: '重新登录',
    content: '修改密码后需要重新登录，请确认重新登录。',
    type: 'info',
    animation: 'scale',
    closeAnimation: 'right',
    buttons: {
      exit: {
        text: '确认退出',
        btnClass: 'btn-danger',
        action: function () {
          this.setCloseAnimation('scale');
          window.open('../../login/index.html', '_self');
        }
      }
    },
    backgroundDismiss: function () {
      return false;
    }
  });
}

cancel.addEventListener('click', () => {
  window.history.back();
});
