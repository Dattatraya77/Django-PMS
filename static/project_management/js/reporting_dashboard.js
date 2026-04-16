
var _project_labels = project_labels_list;

// Overdue tasks bar chart
var _overdue_tasks_data = overdue_tasks_data_list;

const overdue_tasks_chart = Highcharts.chart('overdue-tasks-canvas', {
    chart: {
        type: 'column',
    },
    title: {
        text: 'Overdue Tasks'
    },
    subtitle: {
        text: 'Overdue task count Vs Project'
    },
    xAxis: {
        categories: _project_labels,
        crosshair: true,
        min: 0,
        max: 4,
        scrollbar: {
            enabled: true
        },
        tickLength: 0
    },
    yAxis: {
        min: 0,
        title: {
            text: 'Overdue task count'
        }
    },
    tooltip: {
        headerFormat: '<span style="font-size: 0.8em">{point.key}</span><br/>',
        pointFormat: '<span style="color:{point.color}">●</span> <b>{point.y} task(s)</b><br/>',
        shared: false,
        useHTML: true
    },
    plotOptions: {
        series: {
            dataLabels: {
                enabled: true,
                color:'blue',
                format: '{point.y}',
            }
        }
    },
    series: [{
        colorByPoint: true,
        name: 'Project',
        data: _overdue_tasks_data,
    }]
});


// Incomplete tasks bar chart
var _incomplete_tasks_data = incomplete_tasks_data_list;

const incomplete_tasks_chart = Highcharts.chart('incomplete-tasks-canvas', {
    chart: {
        type: 'column',
    },
    title: {
        text: 'Incomplete Tasks'
    },
    subtitle: {
        text: 'Incomplete task count Vs Project'
    },
    xAxis: {
        categories: _project_labels,
        crosshair: true,
        min: 0,
        max: 4,
        scrollbar: {
            enabled: true
        },
        tickLength: 0
    },
    yAxis: {
        min: 0,
        title: {
            text: 'Incomplete task count'
        }
    },
    tooltip: {
        headerFormat: '<span style="font-size: 0.8em">{point.key}</span><br/>',
        pointFormat: '<span style="color:{point.color}">●</span> <b>{point.y} task(s)</b><br/>',
        shared: false,
        useHTML: true
    },
    plotOptions: {
        series: {
            dataLabels: {
                enabled: true,
                color:'blue',
                format: '{point.y}',
            }
        }
    },
    series: [{
        colorByPoint: true,
        name: 'Project',
        data: _incomplete_tasks_data,
    }]
});


// Upcoming tasks bar chart
var _upcoming_tasks_data = upcoming_tasks_data_list;

const upcoming_tasks_chart = Highcharts.chart('upcoming-tasks-canvas', {
    chart: {
        type: 'column',
    },
    title: {
        text: 'Upcoming Tasks'
    },
    subtitle: {
        text: 'Upcoming task count Vs Project'
    },
    xAxis: {
        categories: _project_labels,
        crosshair: true,
        min: 0,
        max: 4,
        scrollbar: {
            enabled: true
        },
        tickLength: 0
    },
    yAxis: {
        min: 0,
        title: {
            text: 'Upcoming task count'
        }
    },
    tooltip: {
        headerFormat: '<span style="font-size: 0.8em">{point.key}</span><br/>',
        pointFormat: '<span style="color:{point.color}">●</span> <b>{point.y} task(s)</b><br/>',
        shared: false,
        useHTML: true
    },
    plotOptions: {
        series: {
            dataLabels: {
                enabled: true,
                color:'blue',
                format: '{point.y}',
            }
        }
    },
    series: [{
        colorByPoint: true,
        name: 'Project',
        data: _upcoming_tasks_data,
    }]
});


// Completed tasks bar chart
var _completed_tasks_data = completed_tasks_data_list;

const completed_tasks_chart = Highcharts.chart('completed-tasks-canvas', {
    chart: {
        type: 'column',
    },
    title: {
        text: 'Completed Tasks'
    },
    subtitle: {
        text: 'Completed task count Vs Project'
    },
    xAxis: {
        categories: _project_labels,
        crosshair: true,
        min: 0,
        max: 4,
        scrollbar: {
            enabled: true
        },
        tickLength: 0
    },
    yAxis: {
        min: 0,
        title: {
            text: 'Completed task count'
        }
    },
    tooltip: {
        headerFormat: '<span style="font-size: 0.8em">{point.key}</span><br/>',
        pointFormat: '<span style="color:{point.color}">●</span> <b>{point.y} task(s)</b><br/>',
        shared: false,
        useHTML: true
    },
    plotOptions: {
        series: {
            dataLabels: {
                enabled: true,
                color:'blue',
                format: '{point.y}',
            }
        }
    },
    series: [{
        colorByPoint: true,
        name: 'Project',
        data: _completed_tasks_data,
    }]
});