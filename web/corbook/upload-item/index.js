class UploadAdapter {
  constructor(loader) {
    this.loader = loader;
    // this.filePromise = this.loader.file();
  }
  upload() {
    return new Promise((resolve, reject) => {
      const data = new FormData();
      let file = [];
      console.log(this.loader);
      console.log(this.loader.file);
      this.loader.file.then(res => {
        file = res;
        data.append('image', file); //传递给后端的参数，参数名按照后端需求进行填写
        $.ajax({
          async: true,
          crossDomain: true,
          url: image_server, //后端的上传接口
          type: 'POST',
          data: data,
          dataType: 'json',
          mimeType: 'multipart/form-data',
          processData: false,
          contentType: false,
          success: function (response) {
            if (response.code == 200) {
              resolve({
                default: response.data.url
              });
            } else {
              notify(response.msg, 'danger');
              // reject(response.msg);
            }
            // mask_destroy(this.loader);
          }
        });
      });
    });
  }
  abort() {}
}

let editor_question, editor_answer, editor_lose;

// Question Editor
ClassicEditor.create(document.querySelector('#editor_question'), {
  language: 'zh-cn'
})
  .then(initializedEditor => {
    editor_question = initializedEditor;
    editor_question.plugins.get('FileRepository').createUploadAdapter = loader => {
      // let q_loader = mask_loading('Loading...', '#editor_question');
      return new UploadAdapter(loader);
    };
  })
  .catch(error => {
    console.error(error);
  });

function GetQuestionContent() {
  if (editor_question) {
    const content = editor_question.getData();
    console.log(content);
    return content;
  } else {
    notify('题目编辑器加载异常！建议保存文本后刷新页面再次尝试！', 'warning');
    return null;
  }
}

// Answer Editor
ClassicEditor.create(document.querySelector('#editor_answer'), {
  language: 'zh-cn'
})
  .then(initializedEditor => {
    editor_answer = initializedEditor;
    editor_answer.plugins.get('FileRepository').createUploadAdapter = loader => {
      // let a_loader = mask_loading('Loading...', '#editor_answer');
      return new UploadAdapter(loader);
    };
  })
  .catch(error => {
    console.error(error);
  });

function GetAnswerContent() {
  if (editor_answer) {
    const content = editor_answer.getData();
    console.log(content);
    return content;
  } else {
    notify('解析与答案编辑器加载异常！建议保存文本后刷新页面再次尝试！', 'warning');
    return null;
  }
}

// Lose Editor
ClassicEditor.create(document.querySelector('#editor_lose'), {
  language: 'zh-cn'
})
  .then(initializedEditor => {
    editor_lose = initializedEditor;
    editor_lose.plugins.get('FileRepository').createUploadAdapter = loader => {
      // let l_loader = mask_loading('Loading...', '#editor_lose');
      return new UploadAdapter(loader);
    };
  })
  .catch(error => {
    console.error(error);
  });

function GetLoseAnaContent() {
  if (editor_lose) {
    const content = editor_lose.getData();
    console.log(content);
    return content;
  } else {
    notify('失分点编辑器加载异常！建议保存文本后刷新页面再次尝试！', 'warning');
    return null;
  }
}

let state = 0;
window.onload = function () {
  let onload_mask = mask_loading('加载中...');
  subject_fill();
  test_fill();
  mask_destroy(onload_mask);
};

function subject_fill() {
  const settings = {
    async: true,
    crossDomain: true,
    url: server + '/subject/list?method=true',
    method: 'GET',
    headers: {},
    xhrFields: {
      withCredentials: true
    }
  };

  $.ajax(settings).done(function (response) {
    if (response.code == 200) {
      state += 1;
      const li = response.subject;
      li.forEach(e => {
        var code = `<option value="${e.subject}">${e.subject_name}</option>`;
        document.getElementById('subject_select').innerHTML += code;
      });
    } else {
      notify(response.massage, 'danger');
    }
  });
}

function test_fill() {
  const settings = {
    async: true,
    crossDomain: true,
    url: server + '/exam/list/all',
    method: 'GET',
    headers: {},
    xhrFields: {
      withCredentials: true
    }
  };

  $.ajax(settings).done(function (response) {
    if (response.code == 200) {
      state += 1;
      const li = response.data;
      li.forEach(e => {
        var code = `<option value="${e.id}">${e.name} - ${e.date}</option>`;
        document.getElementById('test_select').innerHTML += code;
      });
    } else {
      notify(response.massage, 'danger');
    }
  });
}

function reset() {
  let reset_mask = mask_loading('重置中...');
  if (editor_question || editor_answer || editor_lose) {
    editor_question.setData('');
    editor_answer.setData('');
    editor_lose.setData('');
    document.querySelector('#subject_select').value = 0;
    document.querySelector('#test_select').value = 0;
    mask_destroy(reset_mask);
  } else {
    mask_destroy(reset_mask);
    notify('编辑器加载异常！建议保存文本后刷新页面再次尝试！', 'warning');
  }
}

function save() {
  let save_mask = mask_loading('保存中...');
  const question = GetQuestionContent();
  const answer = GetAnswerContent();
  const ana = GetLoseAnaContent();
  const subject = document.querySelector('#subject_select').value == 0 ? null : document.querySelector('#subject_select').value;
  const test_id = document.querySelector('#test_select').value == 0 ? null : document.querySelector('#test_select').value;
  const settings = {
    async: true,
    crossDomain: true,
    url: server + '/corbook/add',
    method: 'POST',
    headers: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    data: {
      subject: subject,
      question: question,
      answer: answer,
      test_id: test_id,
      lose_analyze: ana
    },
    xhrFields: {
      withCredentials: true
    }
  };

  $.ajax(settings).done(function (response) {
    if (response.code == 200) {
      notify('记录添加成功！', 'success');
      setTimeout(() => {
        location.reload();
      }, 2000);
    } else {
      notify(response.message, 'danger');
      mask_destroy(save_mask);
    }
  });
}
