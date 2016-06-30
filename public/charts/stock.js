'use strict';

function drawchart(holidays) {
    $.getJSON('https://www.highcharts.com/samples/data/from-sql.php?callback=?', function (myData) {
         myData = [].concat(myData, [[Date.UTC(2011, 9, 14, 19, 59), null, null, null, null]]);
         console.log(myData);
         var pleaseGodWork = ocpu.rpc("stl",
                                      {x: myData,
                                       "s.window" : "periodic",
                                       "na.action" : null
                                      });
         var i;
         var x = [];
         var y = [];
         for(i = 0; i < myData.length; i++)
         {
            x[i] = myData[i][0];
            y[i] = myData[i][1];
         }
         var regression = linearRegression(y,x);
         var finalVals = [];
         for(i = 0; i < myData.length; i++)
         {
            finalVals.push([myData[i][0], regression['slope'] * myData[i][0] + regression['intercept']]);
         }
         console.log(finalVals);
         var myAvg50 = movingAverage(myData, 50);
         var myAvg100 = movingAverage(myData, 100);
        // Create the chart
        $('#container').highcharts('StockChart', {
             chart: {
                 zoomType: 'x',
                 borderColor: '#413435',
                 borderWidth: 3,
             },
             navigator : {
                 adaptToUpdatedData: false,
                 series : {
                     data : myData
                 }
             },

             scrollbar: {
                 liveRedraw: false
             },

            rangeSelector : {
                buttons: [{
                    type: 'hour',
                    count: 1,
                    text: '1h'
                }, {
                   type: 'day',
                   count: 1,
                   text: '1d'
                }, {
                   type: 'month',
                   count: 1,
                   text: '1m'
                }, {
                   type: 'year',
                   count: 1,
                   text: '1y'
                }, {
                   type: 'all',
                   text: 'All'
                }],
            inputEnabled: false, // it supports only days
            selected : 4 // all
            },
            xAxis : {
                events : {
                    afterSetExtremes : afterSetExtremes
                },
                minRange: 3600 * 1000 // one hour
            },
            title : {
                text : 'AAPL history by the minute from 1998 to 2011'
            },

            tooltip: {
                style: {
                    width: '200px'
                },
                valueDecimals: 4,
                shared : true
            },

            yAxis : {
                title : {
                    text : 'Price per Share'
                },
                floor: 0
            },

            series : [{
                type: 'candlestick',
                name : 'AAPL Price',
                data : myData,
                dataGrouping: {
                   enabled: false
                },
                id : 'dataseries'
            },
            {
                type: 'line',
                name : 'Regression Line',
                data: finalVals,
                dataGrouping: {
                               enabled: false
                            },

                id: 'regressionline'
            },
            {
                type: 'line',
                name : 'Moving Average: 50',
                data: myAvg50,
                 dataGrouping: {
                                enabled: false
                             },

                id: 'movavg50'
            },
            {
                type: 'line',
                name : 'Moving Average: 100',
                data: myAvg100,
                dataGrouping: {
                             enabled: false
                          },

                id: 'movavg100'
            },
            // the event marker flags
//             {
//                type : 'flags',
//                data : holidays,
//                shape : 'circlepin',
//                width : 8
//             }
            ]
        });
    });
}
function convertDateToInt(data)
{
    var zeroedDates = [];
    var i;
    for(i = 0; i < data.length; i++)
    {
        zeroedDates[i] = data[i][0] - data[0][0];
    }
    return zeroedDates;
}
function queryHolidayData(callback)
{
     var holidayData = [];
     var url = 'http://holidayapi.com/v1/holidays?';
     var countryCode = 'US';
     var year = 2015;
     var apiURL = url + 'country=' + countryCode + '&year=' + year;
     $.getJSON(apiURL, function (data){
        })
        .done(function (data) {
            //console.log(data);
            var tempHolidayData = data['holidays'];
            $.each(tempHolidayData, function  (i, eachhol) {
                if(eachhol.length > 0){

                    for(var j = 0; j < eachhol.length; j++) {
                        var temp = eachhol[j];
                        var hDate = new Date(temp['date']);
                        hDate = hDate.getTime() + (hDate.getTimezoneOffset() * 60 * 1000);
                        holidayData.push({
                            x: hDate,
                            title: 'h',
                            text: temp['name']}
                        );
                    }
                }
            })
                callback(holidayData);
        });
}
 function afterSetExtremes(e) {

        var chart = $('#container').highcharts();

        chart.showLoading('Loading data from server...');
        $.getJSON('https://www.highcharts.com/samples/data/from-sql.php?start=' + Math.round(e.min) +
                '&end=' + Math.round(e.max) + '&callback=?', function (data) {

            chart.series[0].setData(data);
            chart.hideLoading();
        });
    }

function movingAverage(data, num)
{
    var mvAvg = [];
    var period = num;
    var sumForAverage = 0;
    var i;
    for(i=0;i<data.length;i++) {1

      sumForAverage += data[i][1];
      if(i<period) {
      } else {
        sumForAverage -= data[i-period][1];
        mvAvg.push([data[i][0], sumForAverage/period]);
      }
    }
    return mvAvg;
}

function linearRegression(y,x){
    var lr = {};
    var n = y.length;
	var sum_x = 0;
	var sum_y = 0;
	var sum_xy = 0;
	var sum_xx = 0;
	var sum_yy = 0;
	for (var i = 0; i < y.length; i++) {
		sum_x += x[i];
		sum_y += y[i];
		sum_xy += (x[i]*y[i]);
		sum_xx += (x[i]*x[i]);
		sum_yy += (y[i]*y[i]);
	}
	lr['slope'] = (n * sum_xy - sum_x * sum_y) / (n*sum_xx - sum_x * sum_x);
	lr['intercept'] = (sum_y - lr.slope * sum_x)/n;
	lr['r2'] = Math.pow((n*sum_xy - sum_x*sum_y)/Math.sqrt((n*sum_xx-sum_x*sum_x)*(n*sum_yy-sum_y*sum_y)),2);
	return lr;
}

$(document).on('ready', function()
{
    ocpu.seturl("//public.opencpu.org/ocpu/library/stats/R")
    var holidaySource;
    var usHolidays = $.when(
        queryHolidayData(function (data){
            holidaySource = data;
            drawchart(holidaySource);
        })
    );
});
