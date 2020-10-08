var dataSource;

function RetornarCasosCovidPorPeriodo(dtPeriodo) {
    var retornoWS;

    $.ajax(
        {
            type: 'GET',
            url: `https://covid19-brazil-api.now.sh/api/report/v1/brazil/${dtPeriodo}`,
            dataType: 'json',
            crossDomain: true,
            async: false,
            success: function (data) {
                retornoWS = data;
            }
        });

    return retornoWS;
}

function RetornarPorEstado(uf, dtInicio, dtFim) {

    debugger;


    dtInicio = new Date(`2020-${dtInicio}-01`);
    dtFim = new Date(`2020-${dtFim}-31`);

    var rightNow = new Date(dtInicio);
    var res = rightNow.toISOString().slice(0, 10).replace(/-/g, "");
    var casosPorData = RetornarCasosCovidPorPeriodo(res);

    var fullCasos = [];

    for (var x = 1; x > 0; x++) {
        dtInicio = new Date(dtInicio.getTime() + 2592000000);
        var rightNow = new Date(dtInicio);
        var res = rightNow.toISOString().slice(0, 10).replace(/-/g, "");

        if (dtInicio > dtFim) {
            break;
        }

        var temp = RetornarCasosCovidPorPeriodo(res);

        if (temp.data.length > 0) {

            temp.data.forEach(item => {
                casosPorData.data.push(item);
            });

            //  casosPorData.data.push(temp.data.o)

        }
        // casosPorData.data.push(temp.data.slice());


    }

    // var casosPorData = RetornarCasosCovidPorPeriodo(dtInicio);

    var casosPorEstado = casosPorData['data'].filter(function (x) { return x.uid == uf; });

    return casosPorEstado;

    // for(var i = 1; i < casosPorData.length;i++){
    //     casosPorEstado.push(casosPorData['data'].filter(function (x) { return x.uid == uf; }));
    // } 

}