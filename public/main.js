$(document).ready(function() {

    // var today = new Date();
    // var dd = today.getDate();
    // var mm = today.getMonth()+1; //January is 0!
    // var yyyy = today.getFullYear();
    // console.log(dd);

    // create function to display api response
    function displayResults(data, requestType) {
        $('.js-display').html('');
        var html = '';
        if(requestType == 'balance') {
            html += 'Test user balance is: $';
            html += data;
        }
        else if(requestType == 'transactions') {
            html += 'Test user ' + data.length + ' recent transactions are: ';
            html += '<ul>';
            for (i in data) {
                html += '<li>$' + data[i] + '</li>';
            }
            html+= '</ul>';

        }
        
        
        $('.js-display').html(html);
    };

    // create function to call api
    function callApi(requestType) {
        $.get("/endpoint", {requestType: requestType}, function(data) {
            displayResults(data, requestType);
        });
    };

    // create event listener for balance button
    $('.js-balance').on('click', function() {
        callApi('balance');
    });

    // create event listener for transactions button
    $('.js-transactions').on('click', function() {
        callApi('transactions');
    });


});