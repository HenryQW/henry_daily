require('regenerator-runtime/runtime');

const Chart = require('chart.js');
const axios = require('axios');

function ready(fn) {
  if (
    document.attachEvent
      ? document.readyState === 'complete'
      : document.readyState !== 'loading'
  ) {
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

function clickableDiv() {
  document.getElementById('rss').onclick = function () {
    location.href = 'https://rss.wangqiru.com';
  };

  document.getElementById('huginn').onclick = function () {
    location.href = 'https://bot.wangqiru.com';
  };
}

function updateChart() {
  Chart.helpers.each(Chart.instances, async (instance) => {
    const chart = instance.chart.controller;
    chart.data.datasets[0].data = await getData(instance.chart.canvas.id);
    chart.update();
  });
  document.getElementById('chartSpinner').style.display = 'none';
}

const getData = async function getData(type) {
  type = type.replace('Chart', '');
  const a = [];
  try {
    const result = await axios.get(`https://api.henry.wang/api/v1/stat/${type}`,);

    result.data.forEach((e) => {
      a.push(parseInt(e.count));
    });

    // document.getElementById('rssSpinner').style.display = 'none';
  } catch (error) {
    Error(error);
  }
  return a;
};

const charts = [
  {
    id: 'rssChart',
    data: {
      type: 'bar',
      data: {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange', 'Red'],
        datasets: [
          {
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
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
              },
            },
          ],
        },
      },
    },
  },
  {
    id: 'huginnChart',
    data: {
      type: 'line',
      data: {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [
          {
            label: '# of Events',
            data: [764, 821, 803, 678, 372, 328, 759],
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
              },
            },
          ],
        },
      },
    },
  },
];

function resizeChart() {
  for (let i = 0; i < charts.length; i++) {
    const canvas = document.getElementById(charts[i].id);

    const new_canvasWidth = Math.max(canvas.parentNode.clientWidth, 800);
    const new_canvasHeight = 300;

    if (new_canvasWidth != canvas.width || new_canvasHeight != canvas.height) {
      canvas.width = new_canvasWidth;
      canvas.height = new_canvasHeight;
      new Chart(canvas.getContext('2d'), charts[i].data);
    }
  }
}

ready(() => {
  clickableDiv();
  resizeChart();
  updateChart();
});

let resizeTracker;
window.addEventListener(
  'resize',
  () => {
    clearTimeout(resizeTracker);
    resizeTracker = setTimeout(resizeChart, 300);
  },
  false,
);
