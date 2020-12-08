$('document').ready(function () {
    // Save all modals
    const addArtistModal = $('div.addArtistModal');
    const updateArtistModal = $('div.updateArtistModal');
    const deleteArtistModal = $('div.deleteArtistModal');

    const addAlbumModal = $('div.addAlbumModal');
    const updateAlbumModal = $('div.updateAlbumModal');
    const deleteAlbumModal = $('div.deleteAlbumModal');

    const addTrackModal = $('div.addTrackModal');
    const updateTrackModal = $('div.updateTrackModal');
    const deleteTrackModal = $('div.deleteTrackModal');

    const updateUserModal = $('div.updateUserModal');

    // Hide modals from the user
    addArtistModal.hide();
    updateArtistModal.hide();
    deleteArtistModal.hide();

    addAlbumModal.hide();
    updateAlbumModal.hide();
    deleteAlbumModal.hide();

    addTrackModal.hide();
    updateTrackModal.hide();
    deleteTrackModal.hide();

    updateUserModal.hide();

    // Hide buttons so that they are created when the user clicks on a radio button
    hideButtons();
    
    // Save the close button of the modals
    const spanClose = $('span.close');

    // Functionality for the admin
    $('.adminRadioGroup').change(function () {
        let radioValue = $('input[name="adminRadioGroup"]:checked').val();
        switch (radioValue) {
            case 'artists': 
                showButtons();
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
                                $('div#adminResults').html('<br>The name cannot be empty');
                            } else {
                                // Display results and clear the search field
                                displayArtistsAdmin(data);
                                $('#searchField').val('');
                            }
                        })
                        .fail (function(data) {
                            $('div#adminResults').html('<br>There is no data matching the entered text.');
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
                            displayArtistsAdmin(data);
                            $('#searchField').val('');
                        })
                        .fail (function(data) {
                            $('div#adminResults').html('<br>There is no data to display.');
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
                                    $('div#adminResults').empty();
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
                                            $('div#adminResults').empty();
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
                                        $('div#adminResults').empty();
                                        // Clear the search field
                                        $('#searchField').val('');
                                    })
                                    .fail (function(data) {
                                        alert(data.responseText);
                                    })
                            }) 
                        })
                        .fail (function(data) {
                            alert(data.responseJSON.Message);
                        })
                }); 
                    break;           

            case 'albums':
                showButtons();
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
                                $('div#adminResults').html('<br>The title cannot be empty');
                            } else {
                                displayAlbumsAdmin(data);        
                                $('#searchField').val('');
                            }
                        })
                        .fail (function(data) {
                            $('div#adminResults').html('<br>There is no data matching the entered text.');
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
                            displayAlbumsAdmin(data);
                            $('#searchField').val('');
                        })
                        .fail (function(data) {
                            $('div#adminResults').html('<br>There is no data to display.');
                        })
                });

                // Create API call
                // Unbind and bind the click event to the button
                $('#addButton').off('click');
                $('#addButton').on('click', function(e) { 
                    // Clear the dropdown
                    $('#addArtistDropdown').empty();
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
                                            $('div#adminResults').empty();
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
                    // Clear the dropdown
                    $('#updateArtistDropdown').empty();
                    // Save the ID of the clicked item
                    let itemId = this.id;
                    // Save the ID of the artist
                    let artistId = $(this).attr('artistId');
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
                                    // Select the correct value from the artist dropdown
                                    $('#updateArtistDropdown').val(artistId);

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
                                                    $('div#adminResults').empty();
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
                                        $('div#adminResults').empty();
                                        // Clear the search field
                                        $('#searchField').val('');
                                    })
                                    .fail (function(data) {
                                        alert(data.responseText);
                                    })
                            }) 
                        })
                        .fail (function(data) {
                            alert(data.responseJSON.Message);
                        })
                }); 

                break;

            case 'tracks':
                showButtons();
                // Search API call
                // Unbind and bind the click event to the button
                $('#searchButton').off('click');
                $('#searchButton').on('click', function(e) {
                    $.ajax({
                        url: 'src/admin_api.php/tracks',
                        type: 'GET',
                        data: {
                            name: $('#searchField').val()
                        }
                    })
                        .done (function(data) { 
                            // Search field cannot be empty
                            if (!$('#searchField').val()) {
                                $('div#adminResults').html('<br>The name cannot be empty');
                            } else {
                                displayTracksAdmin(data);
                                $('#searchField').val('');
                            }
                        })
                        .fail (function(data) {
                            $('div#adminResults').html('<br>There is no data matching the entered text.');
                        })
                });
                $('#fetchAllButton').hide();
                /*
                * Fetch all functionality
                * On Chrome does not load all data -> ERR_INSUFFICIENT_RESOURCES
                * Works fine on Firefox
                // Fetch all API call
                $('#fetchAllButton').off('click');
                $('#fetchAllButton').on('click', function(e) {
                    $.ajax({
                        url: 'src/admin_api.php/tracks',
                        type: 'GET'
                    })
                        .done (function(data) {
                            // Display results and clear the search field
                            displayTracksAdmin(data);
                            $('#searchField').val('');
                        })
                        .fail (function(data) {
                            $('div#adminResults').html('<br>There is no data to display.');
                        })
                });
                */

                // Create API call
                // Unbind and bind the click event to the button
                $('#addButton').off('click');
                $('#addButton').on('click', function(e) {
                    // Clear the dropdown menus
                    $('#addAlbumDropdown').empty();
                    $('#addMediaTypeDropdown').empty();
                    $('#addGenreDropdown').empty();
                    // Show modal
                    addTrackModal.show();
                     // Close if user clicks on X
                    spanClose.on('click', (function (e) {
                        addTrackModal.css('display', 'none');
                    }));
                    // Close if user hits Escape key
                    $(document).on('keydown', function (event) {
                        if (event.key == 'Escape') {
                            addTrackModal.css('display', 'none');
                        }
                    });

                    // GET ajax call fo fetch all albums
                    $.ajax({
                        url: 'src/admin_api.php/albums',
                        type: 'GET'
                    })
                        .done (function(data) {
                            // Populate the dropdown with all the albums
                            // Each option has the Id of the album and the HTML text is the name of the album
                            for (let i = 0; i < data.length; i ++) {
                                $('<option />', {
                                    'value': data[i].AlbumId,
                                    'text': data[i].Title
                                }).appendTo($('#addAlbumDropdown'));
                            }   
                            // GET ajax call fo fetch all mediatypes
                            $.ajax({
                                url: 'src/admin_api.php/mediatypes',
                                type: 'GET'
                            })
                                .done (function(data) {
                                    // Populate the dropdown with all the mediatypes
                                    // Each option has the Id of the mediatype and the HTML text is the name of the mediatype
                                    for (let i = 0; i < data.length; i ++) {
                                        $('<option />', {
                                            'value': data[i].MediaTypeId,
                                            'text': data[i].Name
                                        }).appendTo($('#addMediaTypeDropdown'));
                                    }   
                                    // GET ajax call fo fetch all genres
                                    $.ajax({
                                        url: 'src/admin_api.php/genres',
                                        type: 'GET'
                                    })
                                        .done (function(data) {
                                                // Populate the dropdown with all the genres
                                                // Each option has the Id of the genre and the HTML text is the name of the genre
                                                for (let i = 0; i < data.length; i ++) {
                                                    $('<option />', {
                                                        'value': data[i].GenreId,
                                                        'text': data[i].Name
                                                    }).appendTo($('#addGenreDropdown'));
                                                }   

                                                // Unbind and bind the click event to the button
                                                $('#addTrackButton').off('click');
                                                $('#addTrackButton').on('click', function(e) {
                                                    // All fields are mandatory
                                                    if (!$('#addTrackNameField').val() || !$('#addAlbumDropdown').val() || 
                                                    !$('#addMediaTypeDropdown').val() || !$('#addGenreDropdown').val() || 
                                                    !$('#addTrackComposerField').val() || !$('#addTrackMillisecondsField').val() ||
                                                    !$('#addTrackBytesField').val() || !$('#addTrackUnitPriceField').val()) {
                                                        alert('All fields are mandatory');
                                                    }  else {
                                                        $.ajax({
                                                            url: 'src/admin_api.php/tracks',
                                                            type: 'POST',
                                                            data: {
                                                                name: $('#addTrackNameField').val(),
                                                                albumId: $('#addAlbumDropdown').val(),
                                                                mediaTypeId: $('#addMediaTypeDropdown').val(),
                                                                genreId: $('#addGenreDropdown').val(),
                                                                composer: $('#addTrackComposerField').val(),
                                                                milliseconds: $('#addTrackMillisecondsField').val(),
                                                                bytes: $('#addTrackBytesField').val(),
                                                                unitPrice: $('#addTrackUnitPriceField').val()
                                                            }
                                                        })
                                                            .done (function(data) {
                                                                alert(data.Message);
                                                                // Hide the modal after submission
                                                                addTrackModal.css('display', 'none');
                                                                // Clear all the fields
                                                                $('#addTrackNameField').val('');
                                                                $('#addTrackComposerField').val('');
                                                                $('#addTrackMillisecondsField').val('');
                                                                $('#addTrackBytesField').val('');
                                                                $('#addTrackUnitPriceField').val('');
                                                                // Clear the results 
                                                                $('div#adminResults').empty();
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
                            
                        })
                        .fail (function(data) {
                            alert(data.responseJSON.Message);
                        }) 
                });

                // Update API call 
                $(document).on('click', 'img.editTrack', function(e) {
                     // Clear the dropdown menus
                     $('#updateAlbumDropdown').empty();
                     $('#updateMediaTypeDropdown').empty();
                     $('#updateGenreDropdown').empty();
                    // Save the ID of the clicked item
                    let itemId = this.id;
                    // Save all of the foreign key Ids
                    let albumId = $(this).attr('albumId');
                    let mediaTypeId = $(this).attr('mediaTypeId');
                    let genreId = $(this).attr('genreId');
                    // Show modal
                    updateTrackModal.show();
                    // Close if user clicks on X
                    spanClose.on('click', (function (e) {
                        updateTrackModal.css('display', 'none');
                    }));
                    // Close if user hits Escape key
                    $(document).on('keydown', function (event) {
                        if (event.key == 'Escape') {
                            updateTrackModal.css('display', 'none');
                        }
                    });
                    
                    // GET ajax call to fetch a track by id
                    $.ajax({
                        url: 'src/admin_api.php/tracks' + '/' + itemId,
                        type: 'GET'
                    })
                        .done (function(data) {
                            // Populate the fields with the data retrieved from the item
                         
                            $('#updateTrackNameField').val(data.Name);
                            $('#updateTrackComposerField').val(data.Composer);
                            $('#updateTrackMillisecondsField').val(data.Milliseconds);
                            $('#updateTrackBytesField').val(data.Bytes);
                            $('#updateTrackUnitPriceField').val(data.UnitPrice);
                            
                            // GET ajax call fo fetch all albums
                            $.ajax({
                                url: 'src/admin_api.php/albums',
                                type: 'GET'
                            })
                                .done (function(data) {
                                    // Populate the dropdown with all the albums
                                    // Each option has the Id of the album and the HTML text is the name of the album
                                    for (let i = 0; i < data.length; i ++) {
                                        $('<option />', {
                                            'value': data[i].AlbumId,
                                            'text': data[i].Title
                                        }).appendTo($('#updateAlbumDropdown'));
                                    }   
                                    // GET ajax call fo fetch all mediatypes
                                    $.ajax({
                                        url: 'src/admin_api.php/mediatypes',
                                        type: 'GET'
                                    })
                                        .done (function(data) {
                                            // Populate the dropdown with all the mediatypes
                                            // Each option has the Id of the mediatype and the HTML text is the name of the mediatype
                                            for (let i = 0; i < data.length; i ++) {
                                                $('<option />', {
                                                    'value': data[i].MediaTypeId,
                                                    'text': data[i].Name
                                                }).appendTo($('#updateMediaTypeDropdown'));
                                            }   
                                            // GET ajax call fo fetch all genres
                                            $.ajax({
                                                url: 'src/admin_api.php/genres',
                                                type: 'GET'
                                            })
                                                .done (function(data) {
                                                        // Populate the dropdown with all the genres
                                                        // Each option has the Id of the genre and the HTML text is the name of the genre
                                                        for (let i = 0; i < data.length; i ++) {
                                                            $('<option />', {
                                                                'value': data[i].GenreId,
                                                                'text': data[i].Name
                                                            }).appendTo($('#updateGenreDropdown'));
                                                        }
                                                        // Select all the correct value from all the dropdowns
                                                        $('#updateAlbumDropdown').val(albumId);
                                                        $('#updateMediaTypeDropdown').val(mediaTypeId);
                                                        $('#updateGenreDropdown').val(genreId);

                                                        // Unbind and bind the click event to the button
                                                        $('#updateTrackButton').off('click');
                                                        $('#updateTrackButton').on('click', function(e) {
                                                            // All fields are mandatory
                                                            if (!$('#updateTrackNameField').val() || !$('#updateAlbumDropdown').val() || 
                                                            !$('#updateMediaTypeDropdown').val() || !$('#updateGenreDropdown').val() || 
                                                            !$('#updateTrackComposerField').val() || !$('#updateTrackMillisecondsField').val() ||
                                                            !$('#updateTrackBytesField').val() || !$('#updateTrackUnitPriceField').val()) {
                                                                alert('All fields are mandatory');
                                                            }  else {
                                                                // Body needs to be raw JSON
                                                                let body = {
                                                                    'name': $('#updateTrackNameField').val(),
                                                                    'albumId': $('#updateAlbumDropdown').val(),
                                                                    'mediaTypeId': $('#updateMediaTypeDropdown').val(),
                                                                    'genreId': $('#updateGenreDropdown').val(),
                                                                    'composer': $('#updateTrackComposerField').val(),
                                                                    'milliseconds': $('#updateTrackMillisecondsField').val(),
                                                                    'bytes': $('#updateTrackBytesField').val(),
                                                                    'unitPrice': $('#updateTrackUnitPriceField').val()
                                                                }
                                                                $.ajax({
                                                                    url: 'src/admin_api.php/tracks'+ '/' + itemId,
                                                                    type: 'PUT',
                                                                    data: JSON.stringify(body)
                                                                })
                                                                    .done (function(data) {
                                                                        alert(data.Message);
                                                                        // Hide the modal after update
                                                                        updateTrackModal.css('display', 'none');
                                                                        // Clear all the fields
                                                                        $('#updateTrackNameField').val('');
                                                                        $('#updateTrackComposerField').val('');
                                                                        $('#updateTrackMillisecondsField').val('');
                                                                        $('#updateTrackBytesField').val('');
                                                                        $('#updateTrackUnitPriceField').val('');
                                                                        // Clear the results 
                                                                        $('div#adminResults').empty();
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
                $(document).on('click', 'img.deleteTrack', function(e) {
                    // Save the ID of the clicked item
                    let itemId = this.id;
                    // Show modal
                    deleteTrackModal.show();
                    // Close if user clicks on X
                    spanClose.on('click', (function (e) {
                        deleteTrackModal.css('display', 'none');
                    }));
                    // Close if user hits Escape key
                    $(document).on('keydown', function (event) {
                        if (event.key == 'Escape') {
                            deleteTrackModal.css('display', 'none');
                        }
                    });
                    
                    // GET ajax call to fetch the name by id
                    $.ajax({
                        url: 'src/admin_api.php/tracks' + '/' + itemId,
                        type: 'GET',
                    })
                        .done (function(data) {
                            // Add the name of the item to the question
                            $('span#trackNameDeleteMessage').html(data.Name);

                            // Unbind and bind the click event to the button
                            $('#deleteTrackButtonNo').off('click');
                            $('#deleteTrackButtonNo').on('click', function(e) {
                                // Hide the modal when user clicks the No button
                                deleteTrackModal.css('display', 'none');
                            });

                            // Unbind and bind the click event to the button
                            $('#deleteTrackButtonYes').off('click');
                            $('#deleteTrackButtonYes').on('click', function(e) {
                                $.ajax({
                                    url: 'src/admin_api.php/tracks'+ '/' + itemId,
                                    type: 'DELETE'
                                })
                                    .done (function(data) {
                                        alert(data.Message);
                                        // Hide the modal after deletion
                                        deleteTrackModal.css('display', 'none');
                                        // Clear the results
                                        $('div#adminResults').empty();
                                        // Clear the search field
                                        $('#searchField').val('');
                                    })
                                    .fail (function(data) {
                                        alert(data.responseText);
                                    })
                            }) 
                        })
                        .fail (function(data) {
                            alert(data.responseJSON.Message);
                        })
                }); 
                    
                break;
            default: 
                $('div#adminResults').html('<br>There is no data matching the entered text.');
        }
    });
    
    // ------------------------------------------------------------------------------------------

    // Functionality for the customer
    $('.customerRadioGroup').change(function () {
        let radioValue = $('input[name="customerRadioGroup"]:checked').val();
        switch (radioValue) {
            case 'artists':
                showButtons();
                // Search API call
                $('#searchButton').off('click');
                $('#searchButton').on('click', function(e) { 
                    $.ajax({
                        url: 'src/customer_api.php/artists',
                        type: 'GET',
                        data: {
                            name: $('#searchField').val()
                        }
                    })
                        .done (function(data) {
                            // Search field cannot be empty
                            if (!$('#searchField').val()) {
                                $('div#customerResults').html('<br>The name cannot be empty');
                            } else {
                                // Display results and clear the search field
                                displayArtistsCustomer(data);
                                $('#searchField').val('');
                            }
                        })
                        .fail (function(data) {
                            $('div#customerResults').html('<br>There is no data matching the entered text.');
                        })
                });

                // Fetch all API call
                $('#fetchAllButton').off('click');
                $('#fetchAllButton').on('click', function(e) {
                    $.ajax({
                        url: 'src/customer_api.php/artists',
                        type: 'GET'
                    })
                        .done (function(data) {
                            // Display results and clear the search field
                            displayArtistsCustomer(data);
                            $('#searchField').val('');
                        })
                        .fail (function(data) {
                            $('div#customerResults').html('<br>There is no data to display.');
                        })
                });
                break;

            case 'albums':
                showButtons();
                // Search API call
                // Unbind and bind the click event to the button
                $('#searchButton').off('click');
                $('#searchButton').on('click', function(e) {
                    $.ajax({
                        url: 'src/customer_api.php/albums',
                        type: 'GET',
                        data: {
                            title: $('#searchField').val()
                        }
                    })
                        .done (function(data) { 
                            // Search field cannot be empty
                            if (!$('#searchField').val()) {
                                $('div#customerResults').html('<br>The title cannot be empty');
                            } else {
                                displayAlbumsCustomer(data);        
                                $('#searchField').val('');
                            }
                        })
                        .fail (function(data) {
                            $('div#customerResults').html('<br>There is no data matching the entered text.');
                        })
                });

                // Fetch all API call
                // Unbind and bind the click event to the button
                $('#fetchAllButton').off('click');
                $('#fetchAllButton').on('click', function(e) {
                    $.ajax({
                        url: 'src/customer_api.php/albums',
                        type: 'GET'
                    })
                        .done (function(data) {
                            // Display results and clear the search field
                            displayAlbumsCustomer(data);
                            $('#searchField').val('');
                        })
                        .fail (function(data) {
                            $('div#customerResults').html('<br>There is no data to display.');
                        })
                });
                break;

            case 'tracks':
                showButtons();
                // Search API call
                // Unbind and bind the click event to the button
                $('#searchButton').off('click');
                $('#searchButton').on('click', function(e) {
                    $.ajax({
                        url: 'src/customer_api.php/tracks',
                        type: 'GET',
                        data: {
                            name: $('#searchField').val()
                        }
                    })
                        .done (function(data) { 
                            // Search field cannot be empty
                            if (!$('#searchField').val()) {
                                $('div#customerResults').html('<br>The name cannot be empty');
                            } else {
                                displayTracksCustomer(data);
                                $('#searchField').val('');
                            }
                        })
                        .fail (function(data) {
                            $('div#customerResults').html('<br>There is no data matching the entered text.');
                        })
                });
                $('#fetchAllButton').hide();
                /*
                * Fetch all functionality
                * On Chrome does not load all data -> ERR_INSUFFICIENT_RESOURCES
                * Works fine on Firefox
                // Fetch all API call
                $('#fetchAllButton').off('click');
                $('#fetchAllButton').on('click', function(e) {
                    $.ajax({
                        url: 'src/admin_api.php/tracks',
                        type: 'GET'
                    })
                        .done (function(data) {
                            // Display results and clear the search field
                            displayTracksAdmin(data);
                            $('#searchField').val('');
                        })
                        .fail (function(data) {
                            $('div#adminResults').html('<br>There is no data to display.');
                        })
                });
                */
                break;
        }
    });

    // Update API call 
    $(document).on('click', 'img.editUser', function(e) {
        // Clear the dropdown
        $('#updateUserDropdown').empty();
        // Save the ID of the clicked item
        let itemId = this.id;
        // Show modal
        updateUserModal.show();
        // Close if user clicks on X
        spanClose.on('click', (function (e) {
            updateUserModal.css('display', 'none');
        }));
        // Close if user hits Escape key
        $(document).on('keydown', function (event) {
            if (event.key == 'Escape') {
                updateUserModal.css('display', 'none');
            }
        });
        
        // GET ajax call to fetch user details by id
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
                        // Select the correct value from the artist dropdown
                        $('#updateArtistDropdown').val(artistId);

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
                                        $('div#adminResults').empty();
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
    
});

function showButtons() {
    $('#searchField').show();
    $('#searchButton').show();
    $('#fetchAllButton').show();
    $('#addButton').show();
}

function hideButtons() {
    $('#searchField').hide();
    $('#searchButton').hide();
    $('#fetchAllButton').hide();
    $('#addButton').hide();
}