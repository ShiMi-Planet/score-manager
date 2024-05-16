window.onload = function () {
  fill_basic();
  fill_ana();
};

function fill_basic() {
  const settings = {
    async: true,
    crossDomain: true,
    url: server + '/article/detail/' + getQueryParamFromURL('id'),
    method: 'GET',
    headers: {},
    xhrFields: {
      withCredentials: true
    }
  };

  $.ajax(settings).done(function (response) {
    if (response.code == 200) {
      document.getElementById('preview').innerHTML = `<img src="${response.img}" alt="Image preview" style="width:auto;max-height:30rem"/>`;
      document.getElementById('ocr').value = response.article;
    } else {
      notify(response.message, 'danger');
    }
  });
}

function fill_ana() {
  const settings = {
    async: true,
    crossDomain: true,
    url: server + '/article/ana/' + getQueryParamFromURL('id'),
    method: 'GET',
    headers: {},
    xhrFields: {
      withCredentials: true
    }
  };

  $.ajax(settings).done(function (response) {
    document.getElementById('re').srcdoc = response;
  });
}
