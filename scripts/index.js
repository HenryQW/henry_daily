const moment = require('moment');
const Chart = require('chart.js');
const axios = require('axios');

const dateLabel = dateLabels();

function ready(fn) {
  if (
    document.attachEvent ?
      document.readyState === 'complete' :
      document.readyState !== 'loading'
  ) {
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

/** UI */
function clickableDiv() {
  document.getElementById('rss').onclick = function () {
    window.open('https://rss.henry.wang', '_blank');
  };

  document.getElementById('huginn').onclick = function () {
    window.open('https://bot.henry.wang', '_blank');
  };

  document.getElementById('docker').onclick = function () {
    window.open('https://hub.docker.com/r/wangqiru/ttrss/', '_blank');
  };

  document.getElementById('github').onclick = function () {
    window.open('https://github.com/henryqw', '_blank');
  };

  document.getElementById('email').onclick = function () {
    window.open('mailto:hi@henry.wang');
  };

  document.getElementById('linkedin').onclick = function () {
    window.open('https://www.linkedin.com/in/wangqiru/', '_blank');
  };
}

/** End of UI */

/** Data */
async function getData(type) {
  type = type.replace('Chart', '');
  const a = [];
  try {
    let result;
    if (process.env.NODE_ENV === 'production') {
      result = await axios.get(`https://api.henry.wang/api/v1/stat/${type}`);
    } else {
      result = await axios.get(`http://127.0.0.1:3000/api/v1/stat/${type}`);
    }
    result.data.forEach((e) => {
      a.push(parseInt(e.count));
    });

    // document.getElementById('rssSpinner').style.display = 'none';
  } catch (error) {
    Error(error);
  }
  return a;
}

/** End of Data */


/** Chart */
const charts = [{
  id: 'rssChart',
  data: {
    type: 'bar',
    data: {
      labels: dateLabel,
      datasets: [{
        label: '# of Feeds',
        data: [99, 148, 240, 281, 412, 372, 354],
        backgroundColor: [
          'rgba(26, 83, 92, 0.2)',
          'rgba(22, 96, 136, 0.2)',
          'rgba(78, 205, 196, 0.2)',
          'rgba(247, 155, 247, 0.2)',
          'rgba(255, 107, 107, 0.2)',
          'rgba(255, 230, 109, 0.2)',
          'rgba(211, 192, 205, 0.2)',
        ],
        borderColor: [
          'rgba(26, 83, 92, 1)',
          'rgba(22, 96, 136, 1)',
          'rgba(78, 205, 196, 1)',
          'rgba(247, 155, 247, 1)',
          'rgba(255, 107, 107, 1)',
          'rgba(255, 230, 109, 1)',
          'rgba(211, 192, 205, 1)',
        ],
        borderWidth: 1,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
    },
  },
},
{
  id: 'huginnChart',
  data: {
    type: 'line',
    data: {
      labels: dateLabel,
      datasets: [{
        label: '# of Events',
        data: [2000, 8000, 2500, 3500, 2800, 2200, 4900],
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
    },
  },
},
{
  id: 'dockerChart',
  data: {
    type: 'line',
    data: {
      labels: dateLabel,
      datasets: [{
        label: '# of Pulls',
        data: [250000, 280000, 290000, 300000, 310000, 320000, 330000],
        backgroundColor: 'rgba(13, 183, 237, 0.2)',
        borderColor: 'rgba(56, 77, 84, 1)',
        borderWidth: 1,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
    },
  },
},
];

function dateLabels() {
  const result = [];
  for (let i = 7; i >= 1; i--) {
    const date = moment()
      .subtract(i, 'days')
      .format('DD MMM');
    result.push(date);
  }
  return result;
}


function updateChart() {
  Chart.helpers.each(Chart.instances, async (instance) => {
    const chart = instance.chart.controller;
    chart.data.datasets[0].data = await getData(instance.chart.canvas.id);
    chart.update();
  });
  document.getElementById('chartSpinner').style.display = 'none';
}

function resizeChart() {
  for (let i = 0; i < charts.length; i++) {
    const canvas = document.getElementById(charts[i].id);

    const new_canvasWidth = Math.max(canvas.parentNode.clientWidth, 800);
    const new_canvasHeight = 300;

    if (
      new_canvasWidth !== canvas.width ||
      new_canvasHeight !== canvas.height
    ) {
      canvas.width = new_canvasWidth;
      canvas.height = new_canvasHeight;
      new Chart(canvas.getContext('2d'), charts[i].data);
    }
  }
}

let windowWidth = window.innerWidth;

let resizeTracker;
window.addEventListener(
  'resize',
  () => {
    if (windowWidth !== window.innerWidth) {
      clearTimeout(resizeTracker);
      resizeTracker = setTimeout(resizeChart(), 300);
      windowWidth = window.innerWidth;
    }
  },
  false,
);

/** Chart */

ready(() => {
  clickableDiv();
  resizeChart();
  updateChart();
});
