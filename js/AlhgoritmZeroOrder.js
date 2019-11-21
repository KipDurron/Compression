$(document).ready(function () {
    $('#submit-file').on("click",function(e){
        e.preventDefault();
        $('#files').parse({
            config: {
                delimiter: "auto",
                complete: show_graph,
            },
            before: function(file, inputElem)
            {
                //console.log("Parsing file...", file);
            },
            error: function(err, file)
            {
                //console.log("ERROR:", err, file);
            },
            complete: function()
            {
                //console.log("Done with all files");
            }
        });
    });
});

function check_criterion(f_with_star, f){
    var eps = 0.5;
    // if () {
    //     f_with_star - f
    // }
}

function show_graph(results) {
    // данные для графиков
    var data = results.data;
    var criterion_fidelity =
    console.log(data)
    var all_data = [
        { data: [["2010/10/01", 0], ["2010/10/5", 1],
                ["2010/10/10", 7], ["2010/10/15", 8]]},
        { data: [["2010/10/01", 13], ["2010/10/5", 23],
                ["2010/10/10", 32], ["2010/10/15", 33]]}
    ];
    var options = {
        axisLabels: {
            show: true
        },
        xaxes: [{
            axisLabel: 'foo',
        }],
        yaxes: [{
            position: 'left',
            axisLabel: 'bar',
        }, {
            position: 'right',
            axisLabel: 'bleem'
        }]
    };
// выводим график
    $.plot($("#placeholder"), [ {data: [[0, 0], [1, 1]], label: "Foo" }], options);
    var table = "<table class='table'>";
    var data = results.data;

    for(i=0;i<data.length;i++){
        table+= "<tr>";
        var row = data[i];
        console.log(row)
        var cells = row.join(" ").split(",");
        console.log(cells)

        for(j=0;j<cells.length;j++){
            table+= "<td>";
            table+= cells[j];
            table+= "</th>";
        }
        table+= "</tr>";
    }
    table+= "</table>";
    $("#parsed_csv_list").html(table);
}


