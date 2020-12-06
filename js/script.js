$('document').ready(function () {
    // Save all modals
    const addArtistModal = $('div.addArtistModal');
    const updateArtistModal = $('div.updateArtistModal');
    const deleteArtistModal = $('div.deleteArtistModal');
    const spanClose = $('span.close');

    // Hide modals from the user
    addArtistModal.hide();
    updateArtistModal.hide();
    deleteArtistModal.hide();

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
                            // Search field cannot be empty
                            if (!$('#searchField').val()) {
                                $('div#results').html('<br>The name cannot be empty');
                            } else {
                                // Display results and clear the search fieild
                                displayArtists(data);
                                $('#searchField').val('');
                            }
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
                    })
                        .done (function(data) {
                            // Display results and clear the search fieild
                            displayAllArtists(data);
                            $('#searchField').val('');
                        })
                        .fail (function(data) {
                            $('div#results').html('<br>There is no data to display.');
                        })
                });

                // Create API call 
                $('#addButton').on('click', function(e) {
                    // Show modal
                    addArtistModal.show();
                    // Close if user clicks on X
                    spanClose.on('click', (function (e) {
                        addArtistModal.css('display', 'none');
                    }));
                    // Close if user hits Escape key
                    $(document).on('keydown', function (event) {
                        if (event.key == "Escape") {
                            addArtistModal.css('display', 'none');
                        }
                    });
                    
                    // Unbind and bind the click event to the button
                    $('#addArtistButton').off('click');
                    $('#addArtistButton').on('click', function(e) {
                        // Name cannot be empty
                        if (!$('#addArtistNameField').val()) {
                            alert('Name cannot be empty');
                        } else {
                            $.ajax({
                                url: 'src/admin_api.php/artists',
                                type: 'POST',
                                data: {
                                    name: $('#addArtistNameField').val()
                                }
                            })
                                .done (function(data) {
                                    alert(data.Message);
                                    // Hide the modal after submission
                                    addArtistModal.css('display', 'none');
                                    // Clear the name field
                                    $('#addArtistNameField').val('');
                                    // Clear the results 
                                    $('div#results').empty();
                                    // Clear the search field
                                    $('#searchField').val('');
                                })
                                .fail (function(data) {
                                    alert(data.responseJSON.Message);
                                })
                        }
                    })
                }); 

                // Update API call 
                $(document).on('click', 'img.editArtist', function(e) {
                    // Save the ID of the clicked item
                    let itemId = this.id;
                    // Show modal
                    updateArtistModal.show();
                    // Close if user clicks on X
                    spanClose.on('click', (function (e) {
                        updateArtistModal.css('display', 'none');
                    }));
                    // Close if user hits Escape key
                    $(document).on('keydown', function (event) {
                        if (event.key == "Escape") {
                            updateArtistModal.css('display', 'none');
                        }
                    });
                    
                    // GET ajax call to fetch the name by id
                    $.ajax({
                        url: 'src/admin_api.php/artists' + '/' + itemId,
                        type: 'GET',
                    })
                        .done (function(data) {
                            // Populate the field with the name of the item
                            $('#updateArtistNameField').val(data.Name);

                             // Unbind and bind the click event to the button
                            $('#updateArtistButton').off('click');
                            $('#updateArtistButton').on('click', function(e) {
                                // Name cannot be empty
                                if (!$('#updateArtistNameField').val()) {
                                    alert('Name cannot be empty');
                                } else {
                                    // Body needs to be raw JSON
                                    let body = {
                                        "name": $('#updateArtistNameField').val()
                                    }
                                    $.ajax({
                                        url: 'src/admin_api.php/artists'+ '/' + itemId,
                                        type: 'PUT',
                                        data: JSON.stringify(body)
                                    })
                                        .done (function(data) {
                                            alert(data.Message);
                                            // Hide the modal after update
                                            updateArtistModal.css('display', 'none');
                                            // Clear the results
                                            $('div#results').empty();
                                            // Clear the search field
                                            $('#searchField').val('');
                                        })
                                        .fail (function(data) {
                                            alert(data.responseJSON.Message);
                                        })
                                }
                            }) 
                        })
                        .fail (function(data) {
                            alert(data.responseJSON.Message);
                        })
                }); 


                // Delete API call 
                $(document).on('click', 'img.deleteArtist', function(e) {
                    // Save the ID of the clicked item
                    let itemId = this.id;
                    // Show modal
                    deleteArtistModal.show();
                    // Close if user clicks on X
                    spanClose.on('click', (function (e) {
                        deleteArtistModal.css('display', 'none');
                    }));
                    // Close if user hits Escape key
                    $(document).on('keydown', function (event) {
                        if (event.key == "Escape") {
                            deleteArtistModal.css('display', 'none');
                        }
                    });
                    
                    // GET ajax call to fetch the name by id
                    $.ajax({
                        url: 'src/admin_api.php/artists' + '/' + itemId,
                        type: 'GET',
                    })
                        .done (function(data) {
                            // Add the name of the item to the question
                            $('span#artistNameDeleteMessage').html(data.Name);

                            // Unbind and bind the click event to the button
                            $('#deleteArtistButtonNo').off('click');
                            $('#deleteArtistButtonNo').on('click', function(e) {
                                // Hide the modal when user clicks the No button
                                deleteArtistModal.css('display', 'none');
                            });

                            // Unbind and bind the click event to the button
                            $('#deleteArtistButtonYes').off('click');
                            $('#deleteArtistButtonYes').on('click', function(e) {
                                $.ajax({
                                    url: 'src/admin_api.php/artists'+ '/' + itemId,
                                    type: 'DELETE'
                                })
                                    .done (function(data) {
                                        alert(data.Message);
                                        // Hide the modal after deletion
                                        deleteArtistModal.css('display', 'none');
                                        // Clear the results
                                        $('div#results').empty();
                                        // Clear the search field
                                        $('#searchField').val('');
                                    })
                                    .fail (function(data) {
                                        alert(data.responseJSON.Message);
                                    })
                            }) 
                        })
                        .fail (function(data) {
                            alert(data.responseJSON.Message);
                        })
                }); 
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