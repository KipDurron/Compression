// import  show_graph_2  from './AlhgoritmOneOrder';

$(document).ready(function () {
    $('#submit-file').on("click",function(e){
        e.preventDefault();
        $('#files').parse({
            config: {
                delimiter: "auto",
                complete:  show_graph,
            }
        });
    });
});

function check_criterion(f_with_star, f){
    var eps = 1;
    if (Math.abs((f_with_star - f)) <= eps) {
        return true;
    } else {
        console.log(false);
        return false;
    }
}

function parse_result(data) {
    var f_with_star = data[0].join(",").split(";")[1];
    var t_temp = data[0].join(",").split(";")[0];
    var return_results = [[], []];//первый массив исходные дапнные, второй сжатые
    return_results[1].push([t_temp, f_with_star]);
    return_results[0].push(data[0].join(",").split(";"));
    var f_temp;
    for(i=1;i<data.length;i++){
        var row = data[i];
        var cells = row.join(",").split(";");
        t_temp = cells[0];
        f_temp = cells[1];
        if (!check_criterion(f_with_star, f_temp)) {
           console.log(f_with_star, f_temp);
            f_with_star = f_temp;
        }
        return_results[1].push([t_temp, f_with_star]);
        return_results[0].push(cells);//исходные данные

    }
    return return_results;
}

function show_graph(results) {
    // данные для графиков
    var data = parse_result(results.data);
    var all_data = [
        { data: data[0], label: "Исходные данные"},
        { data: data[1], label: "Сжатые данные"}
    ];
    var options = {
        axisLabels: {
            show: true
        },
        xaxes: [{
            axisLabel: 'Время',
        }],
        yaxes: [{
            position: 'left',
            axisLabel: 'Алгоритм 1 порядка экстраполирующий',
        }, {
            position: 'right',
            axisLabel: 'bleem'
        }]
    };
    $.plot($("#zero_graph"), all_data, options);
}


