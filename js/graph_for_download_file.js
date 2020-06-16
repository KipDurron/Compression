// import  show_graph_2  from './AlhgoritmOneOrder';

$(document).ready(function () {

    $('#submit-file').on("click",function(e){
        e.preventDefault();
        $('#files').parse({
            config: {
                delimiter: "auto",
                complete:  show_graphs,
            }
        });
    });
});

// function check_criterion_0_order(f_with_star, f){
//     var eps = 1;
//     if (Math.abs((f_with_star - f)) <= eps) {
//         return true;
//     } else {
//         console.log(false);
//         return false;
//     }
// }

function parse_result_0_order(data) {
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
        if (!check_criterion_with_del(f_with_star, f_temp)) {
           // console.log(f_with_star, f_temp);
            f_with_star = f_temp;
        }
        return_results[1].push([t_temp, f_with_star]);
        return_results[0].push(cells);//исходные данные

    }
    return return_results;
}

function save_result_to_html(result_0_order, result_1_order, eps0) {
    //показываем кнопку загрузки результатов постоения графов
    $('#download_res').prop('disabled', false);
    $("#saved_res_0_order").attr("data-res", JSON.stringify(result_0_order));
    $("#saved_res_1_order").attr("data-res", JSON.stringify(result_1_order));
    // $("#saved_res_eps0").attr("data-res", eps0);
    $("#eps0").val(eps0);
}

function get_koef_compress(compressed_data, first_data) {
    var compressed_uniq_data = get_compressed_uniq_data(compressed_data);
    return (first_data.length).toFixed(2) / (compressed_uniq_data.length).toFixed(2)

}

function formed_row_for_table(result) {
    var data = result;
    var first_data = data[0];
    var compressed_data = data[1];
    var koef_compress = get_koef_compress(compressed_data, first_data);
    var uniq_compressed_data = get_compressed_uniq_data(compressed_data);
    var return_str = " <tr>" +
        "        <td>Коэффициент сжатия</td>" +
        "        <td>" + parseFloat(koef_compress).toFixed(5)  + "</td>" +
        "        </tr>" +
        "<tr>\n" +
        "        <td>Исходные данные:</td>" +
        "          <td></td>\n" +
        "        </tr><tr>\n" +
        "        <td>Время</td>\n" +
        "        <td>Значение</td>\n" +
        "        </tr>";
    for (var index = 0; index < first_data.length; ++index) {
        return_str += "<tr>\n" +
            "        <td>" + first_data[index][0] + "</td>\n" +
            "        <td>"+ first_data[index][1] + "</td>\n" +
            "        </tr>"
    }
    return_str += "<tr>\n" +
        "        <td>Сжатые данные:</td>" +
        "        <td></td>\n" +
        "        </tr><tr>\n" +
        "        <td>Время</td>\n" +
        "        <td>Значение</td>\n" +
        "        </tr>";
    for (var i = 0; i < uniq_compressed_data.length; ++i) {
        return_str += "<tr>\n" +
            "        <td>" + uniq_compressed_data[i][0] + "</td>\n" +
            "        <td>"+ uniq_compressed_data[i][1] + "</td>\n" +
            "        </tr>"
    }
    return return_str;
}

function formed_table_by_results(result_0_order, result_1_order) {
    // var eps0 = Number($("#saved_res_eps0").attr("data-res"));
    var eps0 = Number($("#eps0").val());
    if (isNaN(eps0)) {
        eps0 = 0.5;
    }
    var str_return = "<table id='table2excel' class=\"table table-striped\">";
    str_return += "<tr>\n" +
        "        <th>Алгоритмы сжатия</th>" +
        "<th></th>\n" +
        "        </tr>" +
        "       <tr>\n" +
        "        <td>Eps0</td>\n" +
        "        <td>" + eps0 + "</td>" +
        "       </tr>" +
        "       <tr>\n" +
        "        <th>Алгоритм 0 порядка</th>" +
        "       <td></td>\n" +
        "        </tr>";
    str_return += formed_row_for_table(result_0_order);
    str_return += "<tr>\n" +
        "        <td>################################</td>" +
        "       <td>################################</td>\n" +
        "        </tr><tr>\n" +
        "        <th>Алгоритм 1 порядка</th>" +
        "       <td></td>\n" +
        "        </tr>";
    str_return += formed_row_for_table(result_1_order);
    return str_return
}

function getEps0() {
    var eps0 =  $('#eps0').val().replace(/,/, '.');
    if(!eps0){
        alert("Введите Eps0");
        return null;
    }
    if(!isNumber(eps0)){
        alert("Eps0 должно быть числом");
        return null;
    }
    return eps0;
}

$(document).ready(function () {
    $('#download_res').click(function(e){
        $("#table2excel").table2excel({
            // exclude CSS class
            exclude: ".noExl",
            name: "Worksheet Name",
            filename: "export_result.xls", //do not include extension
            fileext: "xls",

        });
    });
});


function save_table_to_Html(result_0_order, result_1_order) {
    var table_str = formed_table_by_results(result_0_order, result_1_order);
    $( "#dvData" ).empty();
    $( "#dvData" ).append(table_str);
}
function show_graphs(results) {
    var eps0 = getEps0();
    if (!eps0) {
        return;
    }
    var result_0_order = parse_result_0_order(results.data);
    var result_1_order = parse_result_1_order(results.data);
    show_graph_0_order(result_0_order);
    show_graph_1_order(result_1_order);
    save_result_to_html(result_0_order, result_1_order, eps0);
    save_table_to_Html(result_0_order, result_1_order);
}

function show_graph_0_order(results) {
    // данные для графикa 0 порядка
    var data = results;
    var first_data = data[0];
    var compressed_data = data[1];
    var all_data = [
        { data: first_data, label: "Исходные данные"},
        { data: compressed_data, label: "Сжатые данные"}
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
            axisLabel: 'Алгоритм 0 порядка',
        }, {
            position: 'right',
            axisLabel: 'bleem'
        }]
    };
    $.plot($("#zero_graph"), all_data, options); // вывод графика

}

function get_compressed_uniq_data(arr) {
    var index = 0;
    var return_arr = [];
    return_arr.push(arr[index]);
    for (index = 1; index < arr.length -1; ++index) {
        if (arr[index][1] !== arr[index - 1][1]) {
            return_arr.push(arr[index]);

        }
    }
    return return_arr;
}

function show_graph_1_order(results) {
    // данные для графика 1 порядка
    var data = results;
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
            axisLabel: 'Алгоритм 1 порядка',
        }, {
            position: 'right',
            axisLabel: 'bleem'
        }]
    };
    $.plot($("#one_graph"), all_data, options); // вывод графика 1 порядка
    // console.log(data[0].length);
    // console.log(data[1].length);
}

// function check_criterion_1_order(f_with_star, f){
//     var eps2 = 1;
//     if (Math.abs((f_with_star - f)) <= eps2) {
//         return true;
//     } else {
//         console.log(false);
//         return false;
//     }
// }

function excecute_A0(A1, arr_1) {
    return arr_1[1] - A1 * arr_1[0];
}

function excecute_A1(arr_1, arr_2) {
    return (arr_2[1] - arr_1[1])/(arr_2[0] - arr_1[0]);
}

function excecute_f_with_star(t, A1, A0) {
    return A0 + A1 * t;
}

function parse_result_1_order(data) {
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
    var temp_f_with_star = f_with_star;

    for(i=2;i<data.length - 1;i++){
        var row1 = data[i];
        var row2 = data[i+1];
        var cells1 = row1.join(",").split(";");
        var cells2 = row2.join(",").split(";");
        temp_t_1 = cells1[0];
        temp_t_2 = cells2[0];



        f_temp_2 = cells2[1];
        if (!check_criterion_with_del(temp_f_with_star, f_temp_2)) {
            // console.log(f_with_star, f_temp_2);
            temp_A1 = excecute_A1(cells1, cells2);
            temp_A0 = excecute_A0(temp_A1, cells1);
            A1 = temp_A1;
            A0 = temp_A0;
            temp_f_with_star = excecute_f_with_star( temp_t_2, A1, A0);
        }
        // return_results[1].push([temp_t_1, temp_f_with_star]);// cжатые данные
        return_results[1].push([temp_t_2, temp_f_with_star]);
        // return_results[0].push(cells1);//исходные данные
        return_results[0].push(cells1);
    }
    return_results[0].push(cells2);
    return return_results;
}
