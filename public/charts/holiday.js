function queryHolidayData()
{
     var url = ''https://holidayapicom/v1/holidays?';
     var countryCode = 'US';
     var year = new Date().getFullYear();
     console.log(year);
     var apiYear = url + 'country=' + countryCode + '&year=' + year;
     console.log(apiURL.toString());

     $.getJSON(apiURL, function (data){
        })
        .done(function (data) {
            console.log(data);
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
        });
}