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

$(document).ready(function () {
    $('#submit-normal-seq').on("click",function(e){

        var mat =  $('#mat').val();
        var sigma =  $('#sigma').val();
        var amount =  $('#amount').val();
        var count = 0;
        var normal_array = [];

        while (count < amount) {
            count++;
            // var normal_val=  normal(mat, sigma, amount);
            // var stream2 = new Random(Date.now());
            //
            //
            // var normal_val=  stream2.normal(mat, sigma);
            var normal_val= normal(mat, sigma, amount)

            normal_array.push([count, normal_val]);
        }
        var compress_array = [];
        var f_with_star = normal_array[1];
        var t_temp = normal_array[0];
        var return_results = [[], []];//первый массив исходные дапнные, второй сжатые
        compress_array.push([t_temp, f_with_star]);
        var f_temp;
        for(i=1;i<normal_array.length;i++){
            var row = normal_array[i];
            t_temp = row[0];
            f_temp = row[1];
            if (!check_criterion_with_del(f_with_star, f_temp, sigma)) {
                console.log(f_with_star, f_temp);
                f_with_star = f_temp;
            }
            compress_array.push([t_temp, f_with_star]);
        }
        return_results[0] = normal_array;
        return_results[1] = compress_array;
        alert( normal_array);
        show_graph_with_mu_zero(return_results)
    });
});

function show_graph_with_mu_zero(results) {
    // данные для графиков
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
            axisLabel: 'Значение (Алгоритм 0 порядка)',
        }, {
            position: 'right',
            axisLabel: 'bleem'
        }]
    };
    jQuery.plot($("#zero_graph"), all_data, options);
}

function check_criterion_with_del(f_with_star, f,sigma_temp){
    var eps = 1;
    if (Math.abs((f_with_star - f)/f) <= eps) {
        return true;
    } else {
        console.log(false);
        return false;
    }
}
