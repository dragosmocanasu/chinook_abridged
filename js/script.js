$('document').ready(function () {
    const addArtistModal = $('div.addArtistModal');
    const spanClose = $('span.close');

    addArtistModal.hide();

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
                            $('div#results').html('<br>There is no data matching the entered text.');
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
                            $('div#results').html('<br>There is no data to display.');
                        })
                });
                // Create API call 
                $('#addButton').on('click', function(e) {
                    $('#artistNameField').val('');
                    addArtistModal.show();
                    spanClose.on('click', (function (e) {
                        addArtistModal.css('display', 'none');
                    }));
                    $(document).on('keydown', function (event) {
                        if (event.key == "Escape") {
                            addArtistModal.css('display', 'none');
                        }
                    });
                    $('#addArtistButton').off('click');
                    $('#addArtistButton').on('click', function(e) {
                        e.preventDefault();
                        addArtistModal.css('display', 'none');
                        $.ajax({
                            url: 'src/admin_api.php/artists',
                            type: 'POST',
                            data: {
                                name: $('#artistNameField').val()
                            }
                        })
                            .done (function(data) {
                                console.log('done -> ', data);
                                alert(data.Message);
                            })

                            .fail (function(data) {
                                console.log('fail -> ', data);
                                alert(data.responseJSON.Message);
                            })
                    })
                }); 
                // Update API call 
                /*
                $('#addButton').on('click', function(e) {
                    $('#artistNameField').val('');
                    addArtistModal.show();
                    spanClose.on('click', (function (e) {
                        addArtistModal.css('display', 'none');
                    }));
                    $(document).on('keydown', function (event) {
                        if (event.key == "Escape") {
                            addArtistModal.css('display', 'none');
                        }
                    });
                    $('#addArtistButton').off('click');
                    $('#addArtistButton').on('click', function(e) {
                        e.preventDefault();
                        addArtistModal.css('display', 'none');
                        $.ajax({
                            url: 'src/admin_api.php/artists',
                            type: 'POST',
                            data: {
                                name: $('#artistNameField').val()
                            }
                        })
                            .done (function(data) {
                                console.log('done -> ', data);
                                alert(data.Message);
                            })

                            .fail (function(data) {
                                console.log('fail -> ', data);
                                alert(data.responseJSON.Message);
                            })
                    })
                }); */
                // Delete API call 
                /*
                $('#addButton').on('click', function(e) {
                    $('#artistNameField').val('');
                    addArtistModal.show();
                    spanClose.on('click', (function (e) {
                        addArtistModal.css('display', 'none');
                    }));
                    $(document).on('keydown', function (event) {
                        if (event.key == "Escape") {
                            addArtistModal.css('display', 'none');
                        }
                    });
                    $('#addArtistButton').off('click');
                    $('#addArtistButton').on('click', function(e) {
                        e.preventDefault();
                        addArtistModal.css('display', 'none');
                        $.ajax({
                            url: 'src/admin_api.php/artists',
                            type: 'POST',
                            data: {
                                name: $('#artistNameField').val()
                            }
                        })
                            .done (function(data) {
                                console.log('done -> ', data);
                                alert(data.Message);
                            })

                            .fail (function(data) {
                                console.log('fail -> ', data);
                                alert(data.responseJSON.Message);
                            })
                    })
                }); 
                */
                break;                
            case 'albums':

                break;
            case 'tracks':

                break;
            default: 
                $('div#results').html('<br>There is no data matching the entered text.');
        }
    });
});