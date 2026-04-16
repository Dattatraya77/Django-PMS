
var _project_labels = project_labels_list;

// Overdue tasks bar chart
var _total_tasks_data = total_tasks_data_list;

const total_tasks_chart = Highcharts.chart('total-tasks-canvas', {
    chart: {
        type: 'column',
    },
    title: {
        text: 'Total Tasks'
    },
    subtitle: {
        text: 'Total task count Vs Project'
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
            text: 'Total task count'
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
        data: _total_tasks_data,
    }]
});


// Number of projects Vs project status pie chart
var _project_data = project_data;
const project_status_pie_chart = Highcharts.chart('project-status-canvas', {
    chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie',
    },
    title: {
        text: 'Projects'
    },
    subtitle: {
        text: 'Projects Vs Project status'
    },
    tooltip: {
        headerFormat: '<span style="font-size: 0.8em">{point.key}</span><br/>',
        pointFormat: '<span style="color:{point.color}">●</span> <b>{point.y} project(s)</b><br/>',
        shared: false,
        useHTML: true
    },
    plotOptions: {
        pie: {
            innerSize: 100,
            depth: 45,
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
                enabled: true,
                format: '<b>{point.name}</b>:{point.y}',
            },
            showInLegend: true
        },

    },
    series: [{
        colorByPoint: true,
        name: 'Project',
        data: _project_data
    }]
});


// Number of tasks Vs assignee chart
var _task_assignee_labels = task_assignee_labels;
var _task_assignee_data = task_assignee_data;

const task_assignee_chart = Highcharts.chart('task-assignee-canvas', {
    chart: {
        type: 'lollipop',
    },
    title: {
        text: 'Total Tasks'
    },
    subtitle: {
        text: 'Total tasks Vs Assignee'
    },
    xAxis: {
        categories: _task_assignee_labels,
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
            text: 'Task count'
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
        name: 'Assignee',
        data: _task_assignee_data,
    }]
});


// Upcoming tasks by assignee this week chart
var _this_week_task_assignee_labels = this_week_task_assignee_labels;
var _this_week_task_assignee_data = this_week_task_assignee_data;

const this_week_task_assignee_chart = Highcharts.chart('tasks-assignee-this-week-canvas', {
    chart: {
        type: 'lollipop',
    },
    title: {
        text: 'Upcoming Tasks'
    },
    subtitle: {
        text: 'Upcoming tasks Vs Assignee this week'
    },
    xAxis: {
        categories: _this_week_task_assignee_labels,
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
            text: 'Task count'
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
        name: 'Assignee this week',
        data: _this_week_task_assignee_data,
    }]
});