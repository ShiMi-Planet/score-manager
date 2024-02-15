var mask_body;

function setCookie(cname, cvalue, exmins) {
    var d = new Date();
    d.setTime(d.getTime() + (exmins * 60 * 1000));
    var expires = "expires=" + d.toGMTString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}

function delCookie(cname) {
    document.cookie = cname + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
}

function notify(content, level, duration) {
    if (!duration) duration = 1500;
    $.notify({
        message: content,
    }, {
        type: level,
        placement: {
            from: 'top',
            align: 'right'
        },
        z_index: 10800,
        delay: duration,
        animate: {
            enter: 'animate__animated animate__fadeInUp',
            exit: 'animate__animated animate__fadeOutDown'
        }
    })
}

function body_loading_mask() {
    mask_body = $('body').lyearloading({
        opacity: 0.2,
        spinnerSize: 'lg'
    });
}

function body_loading_mask_destroy() {
    mask_body.destroy()
}

function getQueryParamFromURL(name) {
    search = location.href.split("?")[1];
    if (search == null) {
      return null;
    }
    search_list = search.split("&");
    list = [];
    for (let index = 0; index < search_list.length; index++) {
      list[index] = search_list[index].split("=");
    }
    try {
      for (let index = 0; index < list.length; index++) {
        if (list[index][0] == name) {
          return list[index][1];
        } else {
          continue;
        }
      }
      throw `Fetch none of ${name}`;
    } catch (e) {
      console.warn(e);
      return null;
    }
  }

/*
,
"xhrFields": {
withCredentials: true
}
*/