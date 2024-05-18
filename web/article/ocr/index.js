document.getElementById('inputGroupFile').addEventListener('change', function (event) {
  const file = event.target.files[0];
  if (file && file.type.startsWith('image/')) {
    const reader = new FileReader();
    reader.onload = function (e) {
      let upload_mask = mask_loading('上传中...');
      const base64String = e.target.result;
      document.getElementById('preview').innerHTML = `<img src="${base64String}" alt="Image preview" style="width:100%"/>`;
      setTimeout(() => {
        get_result(base64String, document.getElementById('ana').checked, upload_mask);
      }, 1000);
    };
    reader.readAsDataURL(file);
  } else {
    alert('请上传图片文件！');
  }
});

function get_result(b64, s, mask) {
  console.log(s);
  let type = 0;
  if (s) {
    type = 1;
  } else {
    type = 0;
  }
  const settings = {
    async: false,
    crossDomain: true,
    url: server + '/article/ocr/' + type,
    method: 'POST',
    headers: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    timeout: 0,
    data: {
      data: b64
    },
    xhrFields: {
      withCredentials: true
    }
  };

  $.ajax(settings).done(function (response) {
    if (response.code == 200) {
      // fill_data();
      notify('文本识别成功！', 'success');
    } else {
      notify(response.message, 'danger');
    }
  });
  setTimeout(() => {
    mask_destroy(mask);
  }, 1500);
}
