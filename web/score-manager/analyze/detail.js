window.onload = function () {
  document.title = '测试详情 - #' + getQueryParamFromURL('id');
  get_data();
  set_report();
};

var data = [];

var filler = [];

var chart_data = {
  subject: [],
  rate: [],
  color: []
};

function set_report() {
  const id = getQueryParamFromURL('id');
  const settings = {
    async: true,
    crossDomain: true,
    url: server + '/exam/mark-analyze/' + id,
    method: 'GET',
    headers: {},
    xhrFields: {
      withCredentials: true
    }
  };

  $.ajax(settings).done(function (response) {
    document.getElementById('report').srcdoc = response;
  });
}

function get_data() {
  const settings = {
    async: true,
    crossDomain: true,
    url: server + '/exam/detail',
    method: 'POST',
    headers: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    data: {
      id: getQueryParamFromURL('id')
    },
    xhrFields: {
      withCredentials: true
    }
  };

  $.ajax(settings).done(function (response) {
    if (response.code == 200) {
      document.getElementById('test_name').innerText = '#' + response.id + ' ' + response.name;
      data = response.detail;
      // document.getElementById('report').innerHTML = response.report;
      fill_data();
    } else {
      notify(response.message, 'danger');
    }
  });
}

function fill_data() {
  var code = ``;
  var sum = 0,
    full = 0;
  data.forEach(e => {
    if (e.score != 0) {
      chart_data.rate.push(e.score / e.full_score);
      chart_data.subject.push(e.subject_name);
      chart_data.color.push('rgba(' + e.color + ',0.75)');
      sum += e.score;
      full += e.full_score;
      filler.push(1);
    }
    code += `
      <div class="col-4" style="margin-bottom: 1rem;">
        <div class="input-group">
          <span class="input-group-text">${e.subject_name}</span>
          <input type="text" class="form-control" disabled value="${e.score}">
          <span class="input-group-text">得分率</span>
          <input type="text" class="form-control" disabled value="${(e.score / e.full_score) * 100}%">
          </div>
      </div>`;
  });
  filler.pop();
  filler.push(0);
  chart_data.rate.push(sum / full);
  chart_data.subject.push('总分');
  chart_data.color.push('rgba(150,150,150,0.75)');
  document.getElementById('single_score').innerHTML = code;
  document.getElementById('sum_score').value = sum;
  drawChart();
}

function drawChart() {
  new Chart($('#chart-polar'), {
    type: 'polarArea',
    data: {
      labels: chart_data.subject,
      datasets: [
        {
          label: 'Dataset',
          data: chart_data.rate,
          backgroundColor: chart_data.color
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top'
        },
        title: {
          display: false,
          text: '极区图'
        }
      }
    }
  });

  new Chart($('#chart-radar'), {
    type: 'radar',
    data: {
      labels: chart_data.subject,
      datasets: [
        {
          label: '本次测试数据',
          data: chart_data.rate,
          borderColor: 'rgba(0, 0, 0, 0)',
          backgroundColor: 'rgba(0, 120, 255, 0.75)'
        },
        {
          label: '',
          data: filler,
          borderColor: 'rgba(0, 0, 0, 0)',
          backgroundColor: 'rgba(0, 0, 0, 0)'
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: false,
          text: '雷达图'
        }
      }
    }
  });
}
