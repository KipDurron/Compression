function normal(mu, sigma, nsamples){
    if(!nsamples) nsamples = 6;
    if(!sigma) sigma = 1;
    if(!mu) mu=0;

    var run_total = 0;
    for(var i=0 ; i<nsamples ; i++){
        run_total += Math.random()
    }

    return sigma*(run_total - nsamples/2)/(nsamples/2) + mu
}
function gaussian(mean, stdev) {
    var y2;
    var use_last = false;
    return function() {
        var y1;
        if(use_last) {
            y1 = y2;
            use_last = false;
        }
        else {
            var x1, x2, w;
            do {
                x1 = 2.0 * Math.random() - 1.0;
                x2 = 2.0 * Math.random() - 1.0;
                w  = x1 * x1 + x2 * x2;
            } while( w >= 1.0);
            w = Math.sqrt((-2.0 * Math.log(w))/w);
            y1 = x1 * w;
            y2 = x2 * w;
            use_last = true;
        }

        var retval = mean + stdev * y1;
        if(retval > 0)
            return retval;
        return -retval;
    }
}

var lastNormal = NaN;
function normal_2(mu, sigma) {     // ARG_CHECK

    var z = lastNormal;
    lastNormal = NaN;
    if (!z) {
        var a = Math.random() * 2 * Math.PI;
        var b = Math.sqrt(-2.0 * Math.log(1.0 - Math.random()));
        z = Math.cos(a) * b;
        lastNormal = Math.sin(a) * b;
    }
    return mu + z * sigma;
}
window.temp = {
    spareNormal: undefined
};
function normal3(mean, standardDeviation) {
    let q, u, v, p;

    mean = mean || 0.5;
    standardDeviation = standardDeviation || 0.125;

    if (typeof temp.spareNormal !== 'undefined') {
        v = mean + standardDeviation * temp.spareNormal;
        temp.spareNormal = undefined;

        return v;
    }

    do  {
        u = 2.0 * Math.random() - 1.0;
        v = 2.0 * Math.random() - 1.0;

        q = u * u + v * v;
    } while (q >= 1.0 || q === 0);

    p = Math.sqrt(-2.0 * Math.log(q) / q);

    temp.spareNormal = v * p;
    return mean + standardDeviation * u * p;
}
function gaussianRandom(mean, sigma) {
    let u = Math.random()*0.682;
    return ((u % 1e-8 > 5e-9 ? 1 : -1) * (Math.sqrt(-Math.log(Math.max(1e-9, u)))-0.618))*1.618 * sigma + mean;
}
function getGaussianRandom(mean, standardDeviation) {
    return () =>
    { let q, u, v, p; do
        { u = 2.0 * Math.random() - 1.0; v = 2.0 * Math.random() - 1.0; q = u * u + v * v; }
        while (q >= 1.0 || q === 0); p = Math.sqrt(-2.0 * Math.log(q) / q);
        return mean + standardDeviation * u * p; }; }

function isNumber(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

$(document).ready(function () {
    $('#submit-normal-seq').on("click",function(e){
        var eps0 = getEps0();
        if (!eps0) {
            return;
        }
        var mat =  $('#mat').val().replace(/,/, '.');
        var sigma =  $('#sigma').val().replace(/,/, '.');
        var amount =  $('#amount').val();
        var count = 0;

        if(!mat || !sigma || !amount){
            alert("Введите все поля формы");
            return;
        }

        if(!isNumber(mat) || !isNumber(sigma) || !isNumber(amount)){
            alert("Сред.квад.отклонение, мат. ожидание, количество выборки должны быть числами");
            return;
        }
        // if(Number.isInteger(amount) && parseInt(amount) > 0){
        //     alert("Количество выборки должны быть натуральным числом");
        //     return;
        // }

            var normal_array = [];

        while (count < amount) {
            count++;
            // var normal_val=  normal(mat, sigma, amount);
            // var stream2 = new Random(Date.now());
            //
            //
            // var normal_val=  stream2.normal(mat, sigma);
            var normal_val= normal(mat, sigma, amount);

            normal_array.push([count, normal_val]);
        }
        var result_0_order = create_0_order_alg(normal_array, sigma);
        var result_1_order = create_1_order_alg(normal_array);
        show_graph_0_order(result_0_order);
        // create_one_comp_alg(mat, sigma, amount,normal_array);
        show_graph_1_order(result_1_order);

        save_result_to_html(result_0_order, result_1_order, eps0);
        save_table_to_Html(result_0_order, result_1_order);
    });
});

//data = normal_array
function create_1_order_alg(normal_array) {
    var return_results = [[], []];//первый массив исходные дапнные, второй сжатые
    var A1 = excecute_A1(normal_array[0], normal_array[1]);
    var A0 = excecute_A0(A1, normal_array[0]);
    var f_with_star = normal_array[0][1];
    var temp_t_1 = normal_array[0][0];
    var temp_t_2 = normal_array[1][0];
    return_results[1].push([temp_t_1, excecute_f_with_star(temp_t_1, A1, A0)]);
    return_results[1].push([temp_t_2, excecute_f_with_star(temp_t_2, A1, A0)]);
    return_results[0].push(normal_array[0]);
    return_results[0].push(normal_array[1]);
    var f_temp_2;
    var temp_A1;
    var temp_A0;
    var temp_f_with_star = f_with_star;

    for(var i=2;i<normal_array.length - 1;i++){
        var row1 = normal_array[i];
        var row2 = normal_array[i+1];
        var cells1 = row1;
        var cells2 = row2;
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


function create_0_order_alg(normal_array, sigma) {
    var compress_array = [];
    var f_with_star = normal_array[1][1];
    var t_temp = normal_array[0][0];
    var return_results = [[], []];//первый массив исходные дапнные, второй сжатые
    compress_array.push([t_temp, f_with_star]);
    var f_temp;
    for(i=1;i<normal_array.length;i++){
        var row = normal_array[i];
        t_temp = row[0];
        f_temp = row[1];
        if (!check_criterion_with_del(f_with_star, f_temp)) {
            // console.log(f_with_star, f_temp);
            f_with_star = f_temp;
        }
        compress_array.push([t_temp, f_with_star]);
    }
    return_results[0] = normal_array;
    return_results[1] = compress_array;
    return return_results;
}

function check_criterion_with_del(f_with_star, f){
    // var eps0 = Number($("#saved_res_eps0").attr("data-res"));
    var eps0 = Number($("#eps0").val());

    if (isNaN(eps0)) {
        eps0 = 0.5;
    }
    if (Math.abs((f_with_star - f)/f) <= eps0) {
        return true;
    } else {
        // console.log(false);
        return false;
    }
}
