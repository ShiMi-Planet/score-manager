var mask_body;

function setCookie(cname, cvalue, exmins) {
  var d = new Date();
  d.setTime(d.getTime() + exmins * 60 * 1000);
  var expires = 'expires=' + d.toGMTString();
  document.cookie = cname + '=' + cvalue + '; ' + expires;
}

function getCookie(cname) {
  var name = cname + '=';
  var ca = document.cookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i].trim();
    if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
  }
  return '';
}

function delCookie(cname) {
  document.cookie = cname + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT';
}

function notify(content, level, duration) {
  if (!duration) duration = 1500;
  $.notify(
    {
      message: content
    },
    {
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
    }
  );
}

function mask_loading(message, item) {
  if (item == null) {
    item = 'body';
  }
  var l = $(item).lyearloading({
    opacity: 0.5, // 遮罩层透明度，为0时不透明
    backgroundColor: '#424242', // 遮罩层背景色
    imgUrl: '', // 使用图片时的图片地址
    textColorClass: 'text-success', // 文本文字的颜色
    spinnerColorClass: 'text-success', // 加载动画的颜色(不使用图片时有效)
    spinnerSize: 'lg', // 加载动画的大小(不使用图片时有效，示例：sm/nm/md/lg，也可自定义大小，如：25px)
    spinnerText: message, // 文本文字
    zindex: 9999 // 元素的堆叠顺序值
  });
  return l;
}

function mask_destroy(l) {
  l.destroy();
}

function getQueryParamFromURL(name) {
  search = location.href.split('?')[1];
  if (search == null) {
    return null;
  }
  search_list = search.split('&');
  list = [];
  for (let index = 0; index < search_list.length; index++) {
    list[index] = search_list[index].split('=');
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
