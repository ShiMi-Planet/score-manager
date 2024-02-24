var data = {
  "top-bar-count": {
    "question_count": null,
    "subject_count": null,
    "test_count": null,
  },
  "top-bar-name": {
    "question_name": "错题本题目总数",
    "subject_name": "学科总数",
    "test_name": "已记录考试总数",
  },
  "top-bar-color": {
    "question_color": "primary",
    "subject_color": "success",
    "test_color": "danger",
  },
  "top-bar-icon": {
    "question_icon": "mdi-archive-refresh",
    "subject_icon": "mdi-school",
    "test_icon": "mdi-clipboard-text",
  },
  "top-bar": ['question_', 'subject_', 'test_'],

  "chart-labels": [],
  "chart-subject": [],
  "chart-name": [],
  "chart-color": {}, // 如果获取的颜色值为null，则自动为250,150,170
  "single-score": {}
}

window.onload = function () {
  get_data()
}

function get_data() {
  const settings = {
    "async": true,
    "crossDomain": true,
    "url": server + "/info",
    "method": "GET",
    "headers": {},
    "xhrFields": {
      withCredentials: true
    }
  };

  $.ajax(settings).done(function (response) {
    if (response.code == 200) {
      data["top-bar-count"].question_count = response.correct
      data["top-bar-count"].subject_count = response.subject
      data["top-bar-count"].test_count = response.test
      data["single-score"] = response.score
      data["chart-color"] = response.color
      data["chart-labels"] = response.test_date
      item = response.subject_check
      item.forEach(e => {
        data["chart-subject"].push(e["code"])
        data["chart-name"].push(e["name"])
      });
    } else {
      notify(response.message, "warning")
    }
    fill_topbar_data()
    draw_chart()
  });
}

function fill_topbar_data() {
  data["top-bar"].forEach(n => {
    var code = `
    <div class="col-md-4 col-xs-12">
      <div class="card bg-${data["top-bar-color"][n + "color"]} text-white">
        <div class="card-body">
          <div class="d-flex justify-content-between">
            <span class="avatar-md rounded-circle bg-white bg-opacity-25 avatar-box">
              <i class="mdi ${data["top-bar-icon"][n + "icon"]} fs-4"></i>
            </span>
            <span class="fs-4">${data["top-bar-count"][n + "count"]}</span>
          </div>
          <div class="text-end">${data["top-bar-name"][n + "name"]}</div>
        </div>
      </div>
    </div>`
    document.getElementById("top-bar").innerHTML += code;
  });
}

function draw_chart() {
  var $single_trend = jQuery('.js-chartjs-lines')[0].getContext('2d'),
    $multi_trend = jQuery('.js-chartjs-lines')[1].getContext('2d');

  var cal = [];
  for (let index = 0; index < data["chart-labels"].length; index++) {
    var sum = 0;
    data["chart-subject"].forEach(n => {
      sum += data["single-score"][n][index];
    });
    cal.push(sum);
  }
  new Chart($multi_trend, {
    type: "line",
    data: {
      labels: data["chart-labels"],
      datasets: [
        {
          label: '总分',
          data: cal,
          borderColor: "rgba(250,150,170,0.4)",
          backgroundColor: "rgba(250,150,170,0.8)",
          pointRadius: 5,
          pointHoverRadius: 10,
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: false,
          text: "总分走势折线图"
        }
      }
    }
  })

  var single_dataset = [];
  for (let i = 0; i < data["chart-subject"].length; i++) {
    const s = data["chart-subject"][i];
    const n = data["chart-name"][i];
    single_dataset.push({
      label: n,
      data: data["single-score"][s],
      borderColor: "rgba(" + data["chart-color"][s + "_color"] + ","
        + "0.4)",
      backgroundColor: "rgba(" + data["chart-color"][s + "_color"] + ","
        + "0.8)",
      pointRadius: 4,
      pointHoverRadius: 6,
    })
  }

  new Chart($single_trend, {
    type: "line",
    data: {
      labels: data["chart-labels"],
      datasets: single_dataset,
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: false,
          text: "单科成绩走势折线图"
        }
      }
    }
  })
}