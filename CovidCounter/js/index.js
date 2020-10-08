$(function () {
    AtualizaGraficos();
});


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

function AtualizaGraficos() {
    $("#chart").dxChart({
        dataSource: RetornarPorEstado(), //RetornarPorEstado(33,'',''),
        commonSeriesSettings: {
            argumentField: "datetime",
            type: "spline",
            hoverMode: "includePoints",
            point: {
                hoverMode: "allArgumentPoints"
            }
        },
        series: [
            { valueField: "cases", name: "Casos Confirmados" },
            { valueField: "deaths", name: "Mortes Confirmadas" }
            // { valueField: "suspects", name: "Suspeitos" }
        ],
        stickyHovering: false,
        title: {
            text: "Evolução de Casos de COVID-19"
        },
        "export": {
            enabled: true
        },
        tooltip: {
            enabled: true
        },
        legend: {
            verticalAlignment: "bottom",
            horizontalAlignment: "center",
            hoverMode: "excludePoints"
        }
    });
}

function RetornarPorEstado() {

    // debugger;

    var uf = document.getElementById("uf").selectedOptions[0].value;
    var mesInicio = document.getElementById("mesInicio").selectedOptions[0].value;
    var mesFim = document.getElementById("mesFim").selectedOptions[0].value;

    var casosPorData = { data: [] };

    for (var i = parseInt(mesInicio); i <= parseInt(mesFim); i++) {

        var dtInicio = new Date(`2020-0${i}-01T00:00`);
        var dtFim = new Date(`2020-0${i}-31T00:00`);
        //fazer inicio mes corrente

        var anoC = dtInicio.getFullYear();
        var mesC = dtInicio.getMonth();

        var d1 = new Date(anoC, mesC, 1);
        var d2 = new Date(anoC, mesC + 1, 0);

        if (RetornaDiaDaSemana(d1) == "Domingo")
            d1 = new Date(d1.getTime() + 86400000);
        else if (RetornaDiaDaSemana(d1) == "Sabado")
            d1 = new Date(d1.getTime() + 172800000);

        var temp2 = RetornarCasosCovidPorPeriodo(formataData(d1));
        if (temp2.data.length > 0) {

            temp2.data.forEach(item => {
                casosPorData.data.push(item);
            });
        }

        //fim do mes corrente

        if (RetornaDiaDaSemana(d2) == "Domingo")
            d2 = new Date(d2.getTime() - 172800000);
        else if (RetornaDiaDaSemana(d2) == "Sabado")
            d2 = new Date(d2.getTime() - 86400000);

        var temp = RetornarCasosCovidPorPeriodo(formataData(d2));

        if (temp.data.length > 0) {

            temp.data.forEach(item => {
                casosPorData.data.push(item);
            });
        }
    }

    var casosPorEstado = casosPorData['data'].filter(function (x) { return x.uid == uf; });

    const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
        "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

    casosPorEstado.forEach(item => {
        //
        // debugger;

        item.datetime = `${new Date(item.datetime).getDate()}/${monthNames[new Date(item.datetime).getMonth()]}`
        // var x = item.datetime
    });

    return casosPorEstado;

}

function RetornaDiaDaSemana(dt) {
    var diaDaSemana;
    switch (dt.getDay()) {
        case 0:
            diaDaSemana = "Domingo";
            break;
        case 1:
            diaDaSemana = "Segunda-feira";
            break;
        case 2:
            diaDaSemana = "Terça-feira";
            break;
        case 3:
            diaDaSemana = "Quarta-feira";
            break;
        case 4:
            diaDaSemana = "Quinta-feira";
            break;
        case 5:
            diaDaSemana = "Sexta-feira";
            break;
        case 6:
            diaDaSemana = "Sabado";
            break;
    }

    return diaDaSemana;
}

function formataData(data) {
    var diaS = data.getDay();
    var diaM = data.getDate();
    var mes = data.getMonth();
    var ano = data.getFullYear();

    switch (diaS) {
        case 0:
            diaS = "Domingo";
            break;
        case 1:
            diaS = "Segunda-feira";
            break;
        case 2:
            diaS = "Terça-feira";
            break;
        case 3:
            diaS = "Quarta-feira";
            break;
        case 4:
            diaS = "Quinta-feira";
            break;
        case 5:
            diaS = "Sexta-feira";
            break;
        case 6:
            diaS = "Sabado";
            break;
    }

    switch (mes) {
        case 0:
            mes = "01";
            break;
        case 1:
            mes = "02";
            break;
        case 2:
            mes = "03";
            break;
        case 3:
            mes = "04";
            break;
        case 4:
            mes = "05";
            break;
        case 5:
            mes = "06";
            break;
        case 6:
            mes = "07";
            break;
        case 7:
            mes = "08";
            break;
        case 8:
            mes = "09";
            break;
        case 9:
            mes = "10";
            break;
        case 10:
            mes = "11";
            break;
        case 11:
            mes = "12";
            break;
    }

    if (diaM.toString().length == 1)
        diaM = "0" + diaM;
    if (mes.toString().length == 1)
        mes = "0" + mes;

    return ano + mes + diaM;
}


// API Maps
function initMap() {
    const myLatLng = { lat: -23.556361, lng: -46.658825 };
    const map = new google.maps.Map(document.getElementById("mapaDev"), {
      zoom: 18,
      center: myLatLng,
    });
    new google.maps.Marker({
      position: myLatLng,
      map,
      title: "Corona Count",
    });
}

