$('document').ready(function () {
    // Save all modals
    const addArtistModal = $('div.addArtistModal');
    const updateArtistModal = $('div.updateArtistModal');
    const deleteArtistModal = $('div.deleteArtistModal');

    const addAlbumModal = $('div.addAlbumModal');
    const updateAlbumModal = $('div.updateAlbumModal');
    const deleteAlbumModal = $('div.deleteAlbumModal');

    const spanClose = $('span.close');

    // Hide modals from the user
    addArtistModal.hide();
    updateArtistModal.hide();
    deleteArtistModal.hide();

    addAlbumModal.hide();
    updateAlbumModal.hide();
    deleteAlbumModal.hide();

    $('.radio').change(function () {
        let radioValue = $('input[name="adminRadioGroup"]:checked').val();
        switch (radioValue) {
            case 'artists': 
                // Search API call
                $('#searchButton').off('click');
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
                                // Display results and clear the search field
                                displayArtists(data);
                                $('#searchField').val('');
                            }
                        })
                        .fail (function(data) {
                            $('div#results').html('<br>There is no data matching the entered text.');
                        })
                });

                // Fetch all API call
                $('#fetchAllButton').off('click');
                $('#fetchAllButton').on('click', function(e) {
                    $.ajax({
                        url: 'src/admin_api.php/artists',
                        type: 'GET'
                    })
                        .done (function(data) {
                            // Display results and clear the search field
                            displayAllArtists(data);
                            $('#searchField').val('');
                        })
                        .fail (function(data) {
                            $('div#results').html('<br>There is no data to display.');
                        })
                });

                // Create API call 
                // Unbind and bind the click event to the button
                $('#addButton').off('click');
                $('#addButton').on('click', function(e) {
                    // Show modal
                    addArtistModal.show();
                    // Close if user clicks on X
                    spanClose.on('click', (function (e) {
                        addArtistModal.css('display', 'none');
                    }));
                    // Close if user hits Escape key
                    $(document).on('keydown', function (event) {
                        if (event.key == 'Escape') {
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
                        if (event.key == 'Escape') {
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
                                        'name': $('#updateArtistNameField').val()
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
                        if (event.key == 'Escape') {
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
                // Search API call
                // Unbind and bind the click event to the button
                $('#searchButton').off('click');
                $('#searchButton').on('click', function(e) {
                    $.ajax({
                        url: 'src/admin_api.php/albums',
                        type: 'GET',
                        data: {
                            title: $('#searchField').val()
                        }
                    })
                        .done (function(data) { 
                            // Search field cannot be empty
                            if (!$('#searchField').val()) {
                                $('div#results').html('<br>The title cannot be empty');
                            } else {
                                displayAlbums(data);        
                                $('#searchField').val('');
                            }
                        })
                        .fail (function(data) {
                            $('div#results').html('<br>There is no data matching the entered text.');
                        })
                });

                // Fetch all API call
                // Unbind and bind the click event to the button
                $('#fetchAllButton').off('click');
                $('#fetchAllButton').on('click', function(e) {
                    $.ajax({
                        url: 'src/admin_api.php/albums',
                        type: 'GET'
                    })
                        .done (function(data) {
                            // Display results and clear the search field
                            displayAllAlbums(data);
                            $('#searchField').val('');
                        })
                        .fail (function(data) {
                            $('div#results').html('<br>There is no data to display.');
                        })
                });

                // Create API call
                // Unbind and bind the click event to the button
                $('#addButton').off('click');
                $('#addButton').on('click', function(e) { 
                    // Show modal
                    addAlbumModal.show();
                     // Close if user clicks on X
                    spanClose.on('click', (function (e) {
                        addAlbumModal.css('display', 'none');
                    }));
                    // Close if user hits Escape key
                    $(document).on('keydown', function (event) {
                        if (event.key == 'Escape') {
                            addAlbumModal.css('display', 'none');
                        }
                    });

                    // GET ajax call fo fetch all artists
                    $.ajax({
                        url: 'src/admin_api.php/artists',
                        type: 'GET'
                    })
                        .done (function(data) {
                            // Populate the dropdown with all the artists
                            // Each option has the Id of the artist and the HTML text is the name of the artist
                            for (let i = 0; i < data.length; i ++) {
                                $('<option />', {
                                    'value': data[i].ArtistId,
                                    'text': data[i].Name
                                }).appendTo($('#addArtistDropdown'));
                            }

                            // Unbind and bind the click event to the button
                            $('#addAlbumButton').off('click');
                            $('#addAlbumButton').on('click', function(e) {
                                // Title cannot be empty
                                if (!$('#addAlbumTitleField').val()) {
                                    alert('Title cannot be empty');
                                } else if (!$('#addArtistDropdown').val()) {
                                    alert('You have to choose an artist');
                                } else {
                                    $.ajax({
                                        url: 'src/admin_api.php/albums',
                                        type: 'POST',
                                        data: {
                                            title: $('#addAlbumTitleField').val(),
                                            artistId: $('#addArtistDropdown').val()
                                        }
                                    })
                                        .done (function(data) {
                                            alert(data.Message);
                                            // Hide the modal after submission
                                            addAlbumModal.css('display', 'none');
                                            // Clear the title field
                                            $('#addAlbumTitleField').val('');
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

                // Update API call 
                $(document).on('click', 'img.editAlbum', function(e) {
                    // Save the ID of the clicked item
                    let itemId = this.id;
                    // Show modal
                    updateAlbumModal.show();
                    // Close if user clicks on X
                    spanClose.on('click', (function (e) {
                        updateAlbumModal.css('display', 'none');
                    }));
                    // Close if user hits Escape key
                    $(document).on('keydown', function (event) {
                        if (event.key == 'Escape') {
                            updateAlbumModal.css('display', 'none');
                        }
                    });
                    
                    // GET ajax call to fetch the title by id
                    $.ajax({
                        url: 'src/admin_api.php/albums' + '/' + itemId,
                        type: 'GET'
                    })
                        .done (function(data) {
                            // Populate the field with the title of the item
                            $('#updateAlbumTitleField').val(data.Title);

                            $.ajax({
                                url: 'src/admin_api.php/artists',
                                type: 'GET'
                            })
                                .done (function(data) {
                                    // Populate the dropdown with all the artists
                                    // Each option has the Id of the artist and the HTML text is the name of the artist
                                    for (let i = 0; i < data.length; i ++) {
                                        $('<option />', {
                                            'value': data[i].ArtistId,
                                            'text': data[i].Name
                                        }).appendTo($('#updateArtistDropdown'));
                                    }
                                    // Unbind and bind the click event to the button
                                    $('#updateAlbumButton').off('click');
                                    $('#updateAlbumButton').on('click', function(e) {
                                        // Title cannot be empty
                                        if (!$('#updateAlbumTitleField').val()) {
                                            alert('Title cannot be empty');
                                        } else if (!$('#updateArtistDropdown').val()) {
                                            alert('You have to choose an artist');
                                        } else {
                                            // Body needs to be raw JSON
                                            let body = {
                                                'title': $('#updateAlbumTitleField').val(),
                                                'artistId': $('#updateArtistDropdown').val()
                                            }
                                            $.ajax({
                                                url: 'src/admin_api.php/albums'+ '/' + itemId,
                                                type: 'PUT',
                                                data: JSON.stringify(body)
                                            })
                                                .done (function(data) {
                                                    alert(data.Message);
                                                    // Hide the modal after update
                                                    updateAlbumModal.css('display', 'none');
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
                        })
                        .fail (function(data) {
                            alert(data.responseJSON.Message);
                        })
                }); 
                // Delete API call 
                $(document).on('click', 'img.deleteAlbum', function(e) {
                    // Save the ID of the clicked item
                    let itemId = this.id;
                    // Show modal
                    deleteAlbumModal.show();
                    // Close if user clicks on X
                    spanClose.on('click', (function (e) {
                        deleteAlbumModal.css('display', 'none');
                    }));
                    // Close if user hits Escape key
                    $(document).on('keydown', function (event) {
                        if (event.key == 'Escape') {
                            deleteAlbumModal.css('display', 'none');
                        }
                    });
                    
                    // GET ajax call to fetch the name by id
                    $.ajax({
                        url: 'src/admin_api.php/albums' + '/' + itemId,
                        type: 'GET',
                    })
                        .done (function(data) {
                            // Add the title of the item to the question
                            $('span#albumTitleDeleteMessage').html(data.Title);

                            // Unbind and bind the click event to the button
                            $('#deleteAlbumButtonNo').off('click');
                            $('#deleteAlbumButtonNo').on('click', function(e) {
                                // Hide the modal when user clicks the No button
                                deleteAlbumModal.css('display', 'none');
                            });

                            // Unbind and bind the click event to the button
                            $('#deleteAlbumButtonYes').off('click');
                            $('#deleteAlbumButtonYes').on('click', function(e) {
                                $.ajax({
                                    url: 'src/admin_api.php/albums'+ '/' + itemId,
                                    type: 'DELETE'
                                })
                                    .done (function(data) {
                                        alert(data.Message);
                                        // Hide the modal after deletion
                                        deleteAlbumModal.css('display', 'none');
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

            case 'tracks':

                break;
            default: 
                $('div#results').html('<br>There is no data matching the entered text.');
        }
    });
});