var calcData = {
    months: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
    days: ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'],
    month: [ 7.4, 6.7, 6, 6.3, 8.9, 6.3, 7.5, 7.4, 8.8, 9.3, 10.7, 14.7],
    day : [13.4, 14, 14.9, 16.1, 17.6, 14.4, 9.6 ],
    time: [86, 14]


};

var indexChart = Vue.component('index-chart', {
    template: '' +
    '<div class="section" id="section1">' +
    '<transition name="fade">' +
    '   <video v-show="indexDay" autoplay loop muted id="myVideo">'+
    '       <source src="http://dhbw.domi-speh.de/12polizei/media/day.mp4" type="video/mp4">' +
    '   </video>' +
    '</transition>' +
    '<transition name="fade">' +
    '   <video v-show="!indexDay" autoplay loop muted id="myVideo">' +
    '       <source src="http://dhbw.domi-speh.de/12polizei/media/night.mp4" type="video/mp4">' +
    '   </video>' +
    '</transition>' +
    '<div :data-rel="indexDay"  class="layer">' +
    '   <h1>Einbruchsrisiko</h1>' +
    '<p>Die Farbskala ist in drei Farben unterteilt. Grau steht für geringes Risiko, Orange steht für mittleres Risiko und Rot für erhötes Risiko. Die Farbe wird anhand der Tageszeit, des Wochentags und des Monats bestimmt.</p>' +
    '<section id="index">'+
    '       <div id="iCharts"> ' +
    '           <div id="index-day"></div>' +
    '           <div id="ewi" style="width: 350px">' +
    '<h3><small>Aktuelle Auswahl:</small><br>{{month}} | {{day}} </h3></div>' +
    '           <div id="index-month"></div>' +
    '       </div>' +
    '       <label v-on:click="changeTime" class="switch">'+
    '           <input type="checkbox" >'+
    '           <div class="slider round"></div>'+
    '       </label>' +
    '   </section>' +
    '</div>'+
    '</div>',


    data: function () {

        return {
            month: moment().format('MMMM'),
            mI: moment().month(),

            day: moment().format('dddd'),
            dI: moment().weekday(),

            time: moment().format('HH:mm'),
            tI: "",

            index: "",

            indexDay: false,

            graphColor: {},

            customSelection: false


        }
    },
    mounted: function () {
        this.calculate();





    },

    methods: {
        generateIndexChart: function () {
            $("#ewi svg").remove();
            $('#ewi').circliful({
                // foreground Color
                foregroundColor: this.graphColor.backgroundColor,

                // background color
                backgroundColor: "#eee",

                // width of foreground circle border
                foregroundBorderWidth: 15,

                // width of background circle border
                backgroundBorderWidth: 15,

                // Size of point circle
                pointSize: 28.5,

                // font color
                fontColor: this.graphColor.backgroundColor,

                // from 0 to 100
                percent: this.index*10,

                // if the circle should be animated initialy
                animation: 1,

                // from 0 to 100
                animationStep: 4,

                // top, bottom, left, right or middle
                iconPosition: 'center',

                // font size of the percentage text
                percentageTextSize: 22,

                // draws a circle around the main circle
                targetPercent: 0,

                // font size of the target percentage
                targetTextSize: 17,

                // font color of the info text
                textColor: 'white',

                replacePercentageByText: this.stage

            });
        },

        generateDay: function () {
            var vm = this;

            google.charts.setOnLoadCallback(function () {

                var data = new google.visualization.DataTable();
                data.addColumn('string', 'Wochentag'); // Implicit domain label col.
                data.addColumn('number', 'Einbrüche in %'); // Implicit series 1 data col.
                data.addColumn({'type': 'string', 'role': 'tooltip', 'p': {'html': true}})


                data.addRows([

                    [{v:"Mo",f:"Mo"},calcData.day[0], generateHTML(calcData.days[0],calcData.day[0])],

                    [{v:"Di",f:"Di"},calcData.day[1], generateHTML(calcData.days[1],calcData.day[1])],

                    [{v:"Mi",f:"Mi"},calcData.day[2], generateHTML(calcData.days[2],calcData.day[2])],

                    [{v:"Do",f:"Do"},calcData.day[3], generateHTML(calcData.days[3],calcData.day[3])],

                    [{v:"Fr",f:"Fr"},calcData.day[4], generateHTML(calcData.days[4],calcData.day[4])],

                    [{v:"Sa",f:"Sa"},calcData.day[5], generateHTML(calcData.days[5],calcData.day[5])],

                    [{v:"So",f:"So"},calcData.day[6], generateHTML(calcData.days[6],calcData.day[6])],


                ]);



                var options = {

                    title: 'Wochentag',
                    titleColor: 'white',
                    tooltip: { isHtml: true },


                    vAxis: {
                        textStyle:{
                            color: '#FFF'
                        }
                    },
                    hAxis : {
                        showTextEvery : 2,
                        title : "Einbrüche in Prozent",
                        titleTextStyle: {color: 'white'},

                        format : 'decimal',
                        gridlines: {
                            count: 10,
                            color: 'white'
                        },
                        baselineColor: 'white',
                        textStyle:{
                            color: '#FFF'
                        }
                    },
                    colors: ['#2B8FE5'],
                    animation:{
                        duration: 2000,
                        easing: 'out',
                        startup: true,
                    },
                    backgroundColor: { fill:'transparent' },
                    legend: { position: "none" },

                    bars: 'horizontal',




                };

                var chart = new google.visualization.BarChart(document.getElementById('index-day'));


                google.visualization.events.addListener(chart, 'select', function () {
                    var selection = chart.getSelection();
                    if(selection.length > 0) {
                        vm.dI = selection[0].row;
                        vm.day = calcData.days[vm.dI];
                        vm.customSelection = true;
                        vm.calculate();
                        vm.generateIndexChart();
                    }

                });



                chart.draw(data, options);
                chart.setSelection([{"row":vm.dI,"column":1}]);


                function generateHTML (tag, prozent) {
                    return '<div class="tooltip"><h5>' + tag + '</h5> <p>'+prozent+ '%</p><div/>' ;

                }



            });


        },

        generateMonth: function () {
            var vm = this;

            google.charts.setOnLoadCallback(function () {

                var data = new google.visualization.DataTable();
                data.addColumn('string', 'Wochentag'); // Implicit domain label col.
                data.addColumn('number', 'Einbrüche in %'); // Implicit series 1 data col.
                data.addColumn({'type': 'string', 'role': 'tooltip', 'p': {'html': true}})


                data.addRows([

                    [{v:"Jan",f:"Jan"},calcData.month[0], generateHTML(calcData.months[0],calcData.month[0])],

                    [{v:"Feb",f:"Feb"},calcData.month[1], generateHTML(calcData.months[1],calcData.month[1])],

                    [{v:"Mär",f:"Mär"},calcData.month[2], generateHTML(calcData.months[2],calcData.month[2])],

                    [{v:"Apr",f:"Apr"},calcData.month[3], generateHTML(calcData.months[3],calcData.month[3])],

                    [{v:"Mai",f:"Mai"},calcData.month[4], generateHTML(calcData.months[4],calcData.month[4])],

                    [{v:"Jun",f:"Jun"},calcData.month[5], generateHTML(calcData.months[5],calcData.month[5])],

                    [{v:"Jul",f:"Jul"},calcData.month[6], generateHTML(calcData.months[6],calcData.month[6])],

                    [{v:"Aug",f:"Aug"},calcData.month[7], generateHTML(calcData.months[7],calcData.month[7])],

                    [{v:"Sep",f:"Sep"},calcData.month[8], generateHTML(calcData.months[8],calcData.month[8])],

                    [{v:"Okt",f:"Okt"},calcData.month[9], generateHTML(calcData.months[9],calcData.month[9])],

                    [{v:"Nov",f:"Nov"},calcData.month[10], generateHTML(calcData.months[10],calcData.month[10])],

                    [{v:"Dez",f:"Dez"},calcData.month[11], generateHTML(calcData.months[11],calcData.month[11])],



                ]);
           

                var options = {

                    title: 'Monat',
                    titleColor: 'white',
                    tooltip: { isHtml: true },

                    colors: ['#2B8FE5'],
                    animation:{
                        duration: 2000,
                        easing: 'out',
                        startup: true,
                    },
                    bars: 'horizontal',
                    backgroundColor: { fill:'transparent' },
                    legend: { position: "none" },
                    vAxis: {
                        textStyle:{
                            color: '#FFF'
                        }
                    },
                    hAxis : {
                        showTextEvery : 2,
                        title : "Einbrüche in Prozent",
                        titleTextStyle: {color: 'white'},
                        format : 'decimal',
                        gridlines: {
                            count: 6,
                            color: 'white'
                        },
                        baselineColor: 'white',
                        textStyle:{
                            color: '#FFF'
                        }
                    }


                };


                var chart = new google.visualization.BarChart(document.getElementById('index-month'));





                chart.draw(data, options);
                chart.setSelection([{"row":vm.mI,"column":1}]);



                google.visualization.events.addListener(chart, 'select', function () {
                    var selection = chart.getSelection();

                    if(selection.length > 0) {
                        vm.mI = selection[0].row;
                        vm.month = calcData.months[vm.mI];
                        vm.customSelection = true;
                        vm.calculate();
                        vm.generateIndexChart();
                    }

                });
                google.visualization.events.addListener(chart, 'error', function (googleError) {
                    google.visualization.errors.removeError(googleError.id);
                });

                function generateHTML (monat, prozent) {
                    return '<div class="tooltip"><h5>' + monat + '</h5> <p>'+prozent+ '%</p><div/>' ;

                }


            })



        },

        calculate: function () {

            if(!this.customSelection) {
                if (this.time < "21:00") {
                    this.tI = calcData.time[0];
                    $('.switch input').attr('checked', true)
                    this.indexDay = true
                }
                else {
                    this.tI = calcData.time[1];
                    $('.switch input').attr('checked', false)
                    this.indexDay = false
                }
            }

            var calc1 = ((calcData.month[this.mI]*calcData.day[this.dI])/100)*this.tI/100;
            var calc2 = ((calcData.month[11]*calcData.day[4])/100)*calcData.time[0]/100;
            this.index = (100/calc2 * calc1/10).toFixed(1);

            if(this.index < 4) {
                this.graphColor.backgroundColor = "#95a5a6";
                this.graphColor.color = "white";

                this.stage = "niedrig"
            }
            if (this.index > 4 && this.index <7 ){
                this.graphColor.backgroundColor = "#e67e22";
                this.graphColor.color = "white";

                this.stage = "mittel"

            }
            if (this.index > 7){
                this.graphColor.backgroundColor = "#c0392b";
                this.graphColor.color = "white";
                this.stage = "hoch";

                if(this.index == 10){
                    this.graphColor.backgroundColor = "#c0392b";
                    this.graphColor.color = "white";
                    this.stage = "hoch";
                    this.index = 10
                }
            }
        },

        changeTime: function () {
            this.customSelection = true;

            if($(".switch input").is(':checked')){
                this.tI = calcData.time[0];
                this.indexDay = true
                this.calculate()

            }
            else {
                this.tI = calcData.time[1];
                this.indexDay = false
                this.calculate()

            }
            this.generateIndexChart();
        }
    },

    created: function () {



    }
});



var index = new Vue({
    el: '#fullpage',
    components: {
        'index-chart': indexChart
    },
    data: {},

    mounted: function () {
        var vm = this;

        $('#fullpage').fullpage({
            css3 : true,
            anchors: ['welcome','risiko', 'einbruchstellen', '3rdPage'],
            sectionsColor: ['#aaa', '', '#184F7F', '#0C2840'],
            navigation: true,
            scrollDelay: 2000,
            navigationPosition: 'right',
            navigationTooltips: ['Hello','Risiko', 'Einbruchstellen', 'Third'],


            afterLoad: function(anchorLink, index){
                if(index == 2){

                    //$('video').get(0).play();
                    //$('video').get(1).play();


                    vm.$refs.ichart.generateDay();
                    vm.$refs.ichart.generateMonth();
                    vm.$refs.ichart.generateIndexChart();
                    $('#ewi, #index-day, #index-month').removeClass('fadeOut');

                    $('#ewi, #index-day, #index-month').addClass('animated fadeIn');
                }
                else {
                    $('#ewi, #index-day, #index-month').removeClass('fadeIn');
                    $('#ewi, #index-day, #index-month').addClass('animated fadeOut');

                    $("#ewi svg").remove();

                }

                if(index == 3){
                    $('.badges').addClass('animated fadeInRight');

                }
            }
        });
    }


});

/*
setInterval(function () {
    indexChart.time =  moment().format('HH:mm');
    indexChart.calculate();
},1000);
*/

