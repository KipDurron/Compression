$(document).ready(function () {
    $('#submit-file').on("click",function(e){
        e.preventDefault();
        $('#files').parse({
            config: {
                delimiter: "auto",
                complete: show_graph_2,
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

function excecute_A0(A1, arr_1) {
return arr_1[1] - A1 * arr_1[0];
}

function excecute_A1(arr_1, arr_2) {
    return (arr_2[1] - arr_1[1])/(arr_2[0] - arr_1[0]);
}

function excecute_f_with_star(t, A1, A0) {
    return A0 + A1 * t;
}

function parse_result2(data) {
    var return_results = [[], []];//первый массив исходные дапнные, второй сжатые
    var A1 = excecute_A1(data[0].join(",").split(";"), data[1].join(",").split(";"));
    var A0 = excecute_A0(A1, data[0].join(",").split(";"));
    var f_with_star = data[0].join(",").split(";")[1];
    var temp_t_1 = data[0].join(",").split(";")[0];
    var temp_t_2 = data[1].join(",").split(";")[0];
    return_results[1].push([temp_t_1, excecute_f_with_star(temp_t_1, A1, A0)]);
    return_results[1].push([temp_t_2, excecute_f_with_star(temp_t_2, A1, A0)]);
    return_results[0].push(data[0].join(",").split(";"));
    return_results[0].push(data[1].join(",").split(";"));
    var f_temp_2;
    var temp_A1;
    var temp_A0;
    var temp_f_with_star;

    for(i=2;i<data.length - 1;i++){
        var row1 = data[i];
        var row2 = data[i+1];
        var cells1 = row1.join(",").split(";");
        var cells2 = row2.join(",").split(";");
        temp_t_1 = cells1[0];
        temp_t_2 = cells2[0];

        temp_A1 = excecute_A1(cells1, cells2);
        temp_A0 = excecute_A0(A1, cells1);
        temp_f_with_star = excecute_f_with_star( temp_t_2, temp_A1, temp_A0);

        f_temp_2 = cells2[1];
        if (!check_criterion(temp_f_with_star, f_temp_2)) {
            console.log(f_with_star, f_temp_2);
            A1 = temp_A1;
            A0 = temp_A0;
        }
        return_results[1].push([temp_t_1, excecute_f_with_star(temp_t_1, A1, A0)]);// cжатые данные
        return_results[1].push([temp_t_2, excecute_f_with_star(temp_t_2, A1, A0)]);
        return_results[0].push(cells1);//исходные данные
        return_results[0].push(cells2);
    }
    return return_results;
}

function show_graph_2(results) {
    // данные для графиков
    var data = parse_result2(results.data);
    var all_data = [
        { data: data[0], label: "True data"},
        { data: data[1], label: "Compression data"}
    ];
    var options = {
        axisLabels: {
            show: true
        },
        xaxes: [{
            axisLabel: 'Time',
        }],
        yaxes: [{
            position: 'left',
            axisLabel: 'Value from reactor (One compression)',
        }, {
            position: 'right',
            axisLabel: 'bleem'
        }]
    };
    $.plot($("#one_graph"), all_data, options);
}


