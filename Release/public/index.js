window.onload = function () {
  check_state();
  set_username();
};

// document.querySelector("body > div > div > header > nav > ul > li:nth-child(2) > ul > li:nth-child(2) > a").addEventListener('click', (e) => {
//   window.open("./person/password/index.html", "newwindow")
// })

function check_state() {
  const settings = {
    async: false,
    crossDomain: true,
    url: server + "/user/state",
    method: "GET",
    headers: {},
    xhrFields: {
      withCredentials: true,
    },
  };

  $.ajax(settings).done(function (response) {
    if (!response.state == true) {
      body_loading_mask();
      notify("似乎还没有登录哦~", "warning");
      setTimeout(() => {
        window.open("./login/index.html", "_self");
      }, 2000);
    } else {
    }
  });
}

function set_username() {
  const settings = {
    async: false,
    crossDomain: true,
    url: server + "/user/getname",
    method: "GET",
    headers: {},
    xhrFields: {
      withCredentials: true,
    },
  };

  $.ajax(settings).done(function (response) {
    document.querySelector("#username").innerHTML = response.username;
  });
}
