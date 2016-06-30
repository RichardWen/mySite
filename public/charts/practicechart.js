function drawchart(holidayData) {
    $('#container').highcharts({
        chart: {
            type: 'line'
        },
        title: {
            text: 'Year'
        },
        xAxis: {
            title: {
                text: 'Months'
            }
            categories: ['Jan', 'Feb', 'Mar', 'Mar', ]
        },
        yAxis: {
            title: {
                text: 'Fruit eaten'
            }
        },
        series: [{
            name: 'Jane',
            data: [1, 0, 4]
        }, {
            name: 'John',
            data: [5, 7, 3]
        }],
    });
};
function queryHolidayData(callback)
{
     var holidayData = [];
     var url = 'http://holidayapi.com/v1/holidays?';
     var countryCode = 'US';
     var year = new Date().getFullYear();
     console.log(year);
     var apiURL = url + 'country=' + countryCode + '&year=' + year;
     console.log(apiURL.toString());

     $.getJSON(apiURL, function (data){
        })
        .done(function (data) {
           // console.log(data);
            var tempHolidayData = data['holidays'];
            $.each(tempHolidayData, function  (i, eachhol) {
                if(eachhol.length > 0){
                    for(var j = 0; j < eachhol.length; j++) {
                        var temp = eachhol[j];
                        var hDate = new Date(temp['date']);
                        hDate = hDate.getTime() + (hDate.getTimezoneOffset() * 60 * 1000);
                        holidayData.push([hDate, temp['name']]);
                    }
                }
            })
            callback(holidayData);
        });
}
$(document).on('ready', function()
{
    queryHolidayData();
    var holidayData = [];
    var querytask = queryHolidayData(function (data) {
        holidayData = data;
    });
    querytask.done(function () {
        drawchart(holidayData);
    });
} )