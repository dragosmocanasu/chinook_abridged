$('document').ready(function () {
    $('.radio').change(function () {
        let radioValue = $('input[name="adminRadioGroup"]:checked').val();
        switch (radioValue) {
            case 'artists': 
                // Search API call
                $('#searchButton').on('click', function(e) { 
                    $.ajax({
                        url: 'src/admin_api.php/artists',
                        type: 'GET',
                        data: {
                            name: $('#searchField').val()
                        }
                    })
                        .done (function(data) {
                            displayArtists(data);
                        })
                        .fail (function(data) {
                            $('section#results').html('<br>There is no data matching the entered text.');
                        })
                });
                // Fetch all API call
                $('#fetchAllButton').on('click', function(e) {
                    $.ajax({
                        url: 'src/admin_api.php/artists',
                        type: 'GET',
                        data: {
                            
                        }
                    })
                        .done (function(data) {
                            displayAllArtists(data);
                        })
                        .fail (function(data) {
                            $('section#results').html('<br>There is no data to display.');
                        })
                });
                // Create API call 
                $('#addButon').on('click', function(e) {
                    $.ajax({
                        url: 'src/admin_api.php/artists',
                        type: 'POST',
                        data: {
                            //name: 
                        }
                    })
                        .done (function(data) {
                            //createArtist(data);
                        })
                        .fail (function(data) {
                            $('section#results').html('<br>There is no data to display.');
                        })
                }); 
                break;
            case 'albums':

                break;
            case 'tracks':
                
                break;
            default: 
                $('section#results').html('<br>There is no data matching the entered text.');
        }
    });
});