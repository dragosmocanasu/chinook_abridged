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
    const userBasketModal = $('div.userBasketModal');

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
    userBasketModal.hide();

    // Hide buttons so that they are created when the user clicks on a radio button
    hideButtons();
    
    // Save the close button of the modals
    const spanClose = $('span.close');

    // Admin radio group functionality
    $('.adminRadioGroup').change(function () {
        let radioValue = $('input[name="adminRadioGroup"]:checked').val();
        switch (radioValue) {
            case 'artists': 
                showButtons();
                // Search API call
                $('#searchButton').off('click');
                $('#searchButton').on('click', function(e) { 
                    // Search field cannot be empty
                    if (!$('#searchField').val()) {
                        $('div#adminResults').html('<br>The name cannot be empty');
                    } else if (($('#searchField').val()).match('[=!@#$%^*?":{}|<>;]')) {
                        alert("The input field can't contain invalid characters!");
                    } else {        
                        $.ajax({
                            url: 'artists',
                            type: 'GET',
                            data: {
                                name: $('#searchField').val()
                            }
                        })
                            .done (function(data) {
                                // Display results and clear the search field
                                displayArtistsAdmin(data);
                                $('#searchField').val('');
                            })
                            .fail (function(data) {
                                $('div#adminResults').html('<br>There is no data matching the entered text.');
                            })
                    }
                });

                // Fetch all API call
                $('#fetchAllButton').off('click');
                $('#fetchAllButton').on('click', function(e) {
                    $.ajax({
                        url: 'artists',
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
                    
                    $('#addArtistButton').off('click');
                    $('#addArtistButton').on('click', function(e) {
                        // Name cannot be empty
                        if (!$('#addArtistNameField').val()) {
                            alert('Name cannot be empty');
                        } else if (($('#addArtistNameField').val()).match('[=!@#$%^*?":{}|<>;]')) {
                            alert("The input field can't contain invalid characters!");
                        } else {
                            $.ajax({
                                url: 'artists',
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
                $(document).off('click', 'img.editArtist');
                $(document).on('click', 'img.editArtist', function(e) {
                    // Save the ID of the clicked item (in this case, an artist)
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
                        url: 'artists' + '/' + itemId,
                        type: 'GET',
                    })
                        .done (function(data) {
                            // Populate the field with the name of the item
                            $('#updateArtistNameField').val(data.Name);

                            $('#updateArtistButton').off('click');
                            $('#updateArtistButton').on('click', function(e) {
                                // Name cannot be empty
                                if (!$('#updateArtistNameField').val()) {
                                    alert('Name cannot be empty');
                                } else if (($('#updateArtistNameField').val()).match('[=!@#$%^*?":{}|<>;]')) {
                                    alert("The input field can't contain invalid characters!");
                                } else {
                                    // Body needs to be raw JSON
                                    let body = {
                                        'name': $('#updateArtistNameField').val()
                                    }
                                    $.ajax({
                                        url: 'artists'+ '/' + itemId,
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
                $(document).off('click', 'img.deleteArtist');
                $(document).on('click', 'img.deleteArtist', function(e) {
                    // Save the ID of the clicked item (in this case, an artist)
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
                        url: 'artists' + '/' + itemId,
                        type: 'GET',
                    })
                        .done (function(data) {
                            // Add the name of the item to the question
                            $('span#artistNameDeleteMessage').html(data.Name);

                            $('#deleteArtistButtonNo').off('click');
                            $('#deleteArtistButtonNo').on('click', function(e) {
                                // Hide the modal when user clicks the No button
                                deleteArtistModal.css('display', 'none');
                            });

                            $('#deleteArtistButtonYes').off('click');
                            $('#deleteArtistButtonYes').on('click', function(e) {
                                $.ajax({
                                    url: 'artists'+ '/' + itemId,
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
                showButtons();
                // Search API call
                $('#searchButton').off('click');
                $('#searchButton').on('click', function(e) {
                    // Search field cannot be empty
                    if (!$('#searchField').val()) {
                        $('div#adminResults').html('<br>The title cannot be empty');
                    } else if (($('#searchField').val()).match('[=!@#$%^*?":{}|<>;]')) {
                        alert("The input field can't contain invalid characters!");
                    } else {
                        $.ajax({
                            url: 'albums',
                            type: 'GET',
                            data: {
                                title: $('#searchField').val()
                            }
                        })
                            .done (function(data) {  
                                displayAlbumsAdmin(data);        
                                $('#searchField').val('');
                            })
                            .fail (function(data) {
                                $('div#adminResults').html('<br>There is no data matching the entered text.');
                            })
                    }
                });

                // Fetch all API call
                $('#fetchAllButton').off('click');
                $('#fetchAllButton').on('click', function(e) {
                    $.ajax({
                        url: 'albums',
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
                        url: 'artists',
                        type: 'GET'
                    })
                        .done (function(data) {
                            // Populate the dropdown with all the artists
                            // Each option has the Id of the artist and the HTML text is the name of the artist
                            for (let i = 0; i < data.length; i ++) {
                                $('<option />', {
                                    'value': data[i].ArtistId,
                                    'html': data[i].Name
                                }).appendTo($('#addArtistDropdown'));
                            }

                            $('#addAlbumButton').off('click');
                            $('#addAlbumButton').on('click', function(e) {
                                // Title cannot be empty
                                if (!$('#addAlbumTitleField').val()) {
                                    alert('Title cannot be empty');
                                } else if (($('#addAlbumTitleField').val()).match('[=!@#$%^*?":{}|<>;]')) {
                                    alert("The input field can't contain invalid characters!");
                                } else if (!$('#addArtistDropdown').val()) {
                                    alert('You have to choose an artist');
                                } else {
                                    $.ajax({
                                        url: 'albums',
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
                $(document).off('click', 'img.editAlbum');
                $(document).on('click', 'img.editAlbum', function(e) {
                    // Clear the dropdown
                    $('#updateArtistDropdown').empty();
                    // Save the ID of the clicked item ((in this case, an album)
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
                        url: 'albums' + '/' + itemId,
                        type: 'GET'
                    })
                        .done (function(data) {
                            // Populate the field with the title of the item
                            $('#updateAlbumTitleField').val(data.Title);

                            $.ajax({
                                url: 'artists',
                                type: 'GET'
                            })
                                .done (function(data) {
                                    // Populate the dropdown with all the artists
                                    // Each option has the Id of the artist and the HTML text is the name of the artist
                                    for (let i = 0; i < data.length; i ++) {
                                        $('<option />', {
                                            'value': data[i].ArtistId,
                                            'html': data[i].Name
                                        }).appendTo($('#updateArtistDropdown'));
                                    }
                                    // Select the correct value from the artist dropdown
                                    $('#updateArtistDropdown').val(artistId);

                                    $('#updateAlbumButton').off('click');
                                    $('#updateAlbumButton').on('click', function(e) {
                                        // Title cannot be empty
                                        if (!$('#updateAlbumTitleField').val()) {
                                            alert('Title cannot be empty');
                                        } else if (($('#updateAlbumTitleField').val()).match('[=!@#$%^*?":{}|<>;]')) {
                                            alert("The input field can't contain invalid characters!");
                                        } else if (!$('#updateArtistDropdown').val()) {
                                            alert('You have to choose an artist');
                                        } else {
                                            // Body needs to be raw JSON
                                            let body = {
                                                'title': $('#updateAlbumTitleField').val(),
                                                'artistId': $('#updateArtistDropdown').val()
                                            }
                                            $.ajax({
                                                url: 'albums'+ '/' + itemId,
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
                $(document).off('click', 'img.deleteAlbum');
                $(document).on('click', 'img.deleteAlbum', function(e) {
                    // Save the ID of the clicked item ((in this case, an album)
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
                        url: 'albums' + '/' + itemId,
                        type: 'GET',
                    })
                        .done (function(data) {
                            // Add the title of the item to the question
                            $('span#albumTitleDeleteMessage').html(data.Title);

                            $('#deleteAlbumButtonNo').off('click');
                            $('#deleteAlbumButtonNo').on('click', function(e) {
                                // Hide the modal when user clicks the No button
                                deleteAlbumModal.css('display', 'none');
                            });

                            $('#deleteAlbumButtonYes').off('click');
                            $('#deleteAlbumButtonYes').on('click', function(e) {
                                $.ajax({
                                    url: 'albums'+ '/' + itemId,
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
                showButtons();
                // Search API call
                $('#searchButton').off('click');
                $('#searchButton').on('click', function(e) {
                    // Search field cannot be empty
                    if (!$('#searchField').val()) {
                        $('div#adminResults').html('<br>The name cannot be empty');
                    } else if (($('#searchField').val()).match('[=!@#$%^*?":{}|<>;]')) {
                        alert("The input field can't contain invalid characters!");  
                    } else {
                        $.ajax({
                            url: 'tracks',
                            type: 'GET',
                            data: {
                                name: $('#searchField').val()
                            }
                        })
                            .done (function(data) { 
                                displayTracksAdmin(data);
                                $('#searchField').val('');
                            })
                            .fail (function(data) {
                                $('div#adminResults').html('<br>There is no data matching the entered text.');
                            })
                    }
                });
               
                // Fetch all API call
                $('#fetchAllButton').off('click');
                $('#fetchAllButton').on('click', function(e) {
                    $.ajax({
                        url: 'tracks',
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

                // Create API call
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
                        url: 'albums',
                        type: 'GET'
                    })
                        .done (function(data) {
                            // Populate the dropdown with all the albums
                            // Each option has the Id of the album and the HTML text is the name of the album
                            for (let i = 0; i < data.length; i ++) {
                                $('<option />', {
                                    'value': data[i].AlbumId,
                                    'html': data[i].Title
                                }).appendTo($('#addAlbumDropdown'));
                            }   
                            // GET ajax call fo fetch all mediatypes
                            $.ajax({
                                url: 'mediatypes',
                                type: 'GET'
                            })
                                .done (function(data) {
                                    // Populate the dropdown with all the mediatypes
                                    // Each option has the Id of the mediatype and the HTML text is the name of the mediatype
                                    for (let i = 0; i < data.length; i ++) {
                                        $('<option />', {
                                            'value': data[i].MediaTypeId,
                                            'html': data[i].Name
                                        }).appendTo($('#addMediaTypeDropdown'));
                                    }   
                                    // GET ajax call fo fetch all genres
                                    $.ajax({
                                        url: 'genres',
                                        type: 'GET'
                                    })
                                        .done (function(data) {
                                                // Populate the dropdown with all the genres
                                                // Each option has the Id of the genre and the HTML text is the name of the genre
                                                for (let i = 0; i < data.length; i ++) {
                                                    $('<option />', {
                                                        'value': data[i].GenreId,
                                                        'html': data[i].Name
                                                    }).appendTo($('#addGenreDropdown'));
                                                }   

                                                $('#addTrackButton').off('click');
                                                $('#addTrackButton').on('click', function(e) {
                                                    // All fields are mandatory
                                                    if (!$('#addTrackNameField').val() || !$('#addAlbumDropdown').val() || 
                                                    !$('#addMediaTypeDropdown').val() || !$('#addGenreDropdown').val() || 
                                                    !$('#addTrackComposerField').val() || !$('#addTrackMillisecondsField').val() ||
                                                    !$('#addTrackBytesField').val() || !$('#addTrackUnitPriceField').val()) {
                                                        alert('All fields are mandatory');
                                                    }  else if (($('#addTrackNameField').val().match('[=!@#$%^*?":{}|<>;]')) || ($('#addTrackComposerField').val().match('[=!@#$%^*?":{}|<>;]'))) {
                                                        alert("The input field(s) can't contain invalid characters!");
                                                    }  else {
                                                        $.ajax({
                                                            url: 'tracks',
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
                $(document).off('click', 'img.editTrack');
                $(document).on('click', 'img.editTrack', function(e) {
                     // Clear the dropdown menus
                     $('#updateAlbumDropdown').empty();
                     $('#updateMediaTypeDropdown').empty();
                     $('#updateGenreDropdown').empty();
                    // Save the ID of the clicked item (in this case, a track)
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
                        url: 'tracks' + '/' + itemId,
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
                                url: 'albums',
                                type: 'GET'
                            })
                                .done (function(data) {
                                    // Populate the dropdown with all the albums
                                    // Each option has the Id of the album and the HTML text is the name of the album
                                    for (let i = 0; i < data.length; i ++) {
                                        $('<option />', {
                                            'value': data[i].AlbumId,
                                            'html': data[i].Title
                                        }).appendTo($('#updateAlbumDropdown'));
                                    }   
                                    // GET ajax call fo fetch all mediatypes
                                    $.ajax({
                                        url: 'mediatypes',
                                        type: 'GET'
                                    })
                                        .done (function(data) {
                                            // Populate the dropdown with all the mediatypes
                                            // Each option has the Id of the mediatype and the HTML text is the name of the mediatype
                                            for (let i = 0; i < data.length; i ++) {
                                                $('<option />', {
                                                    'value': data[i].MediaTypeId,
                                                    'html': data[i].Name
                                                }).appendTo($('#updateMediaTypeDropdown'));
                                            }   
                                            // GET ajax call fo fetch all genres
                                            $.ajax({
                                                url: 'genres',
                                                type: 'GET'
                                            })
                                                .done (function(data) {
                                                        // Populate the dropdown with all the genres
                                                        // Each option has the Id of the genre and the HTML text is the name of the genre
                                                        for (let i = 0; i < data.length; i ++) {
                                                            $('<option />', {
                                                                'value': data[i].GenreId,
                                                                'html': data[i].Name
                                                            }).appendTo($('#updateGenreDropdown'));
                                                        }
                                                        // Select all the correct value from all the dropdowns
                                                        $('#updateAlbumDropdown').val(albumId);
                                                        $('#updateMediaTypeDropdown').val(mediaTypeId);
                                                        $('#updateGenreDropdown').val(genreId);

                                                        $('#updateTrackButton').off('click');
                                                        $('#updateTrackButton').on('click', function(e) {
                                                            // All fields are mandatory
                                                            if (!$('#updateTrackNameField').val() || !$('#updateAlbumDropdown').val() || 
                                                            !$('#updateMediaTypeDropdown').val() || !$('#updateGenreDropdown').val() || 
                                                            !$('#updateTrackComposerField').val() || !$('#updateTrackMillisecondsField').val() ||
                                                            !$('#updateTrackBytesField').val() || !$('#updateTrackUnitPriceField').val()) {
                                                                alert('All fields are mandatory');
                                                            }   else if (($('#updateTrackNameField').val().match('[=!@#$%^*?":{}|<>;]')) || ($('#updateTrackComposerField').val().match('[=!@#$%^*?":{}|<>;]'))){
                                                                alert("The input field can't contain invalid characters!");
                                                            }   else {
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
                                                                    url: 'tracks'+ '/' + itemId,
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
                $(document).off('click', 'img.deleteTrack');
                $(document).on('click', 'img.deleteTrack', function(e) {
                    // Save the ID of the clicked item (in this case, a track)
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
                        url: 'tracks' + '/' + itemId,
                        type: 'GET',
                    })
                        .done (function(data) {
                            // Add the name of the item to the question
                            $('span#trackNameDeleteMessage').html(data.Name);

                            $('#deleteTrackButtonNo').off('click');
                            $('#deleteTrackButtonNo').on('click', function(e) {
                                // Hide the modal when user clicks the No button
                                deleteTrackModal.css('display', 'none');
                            });

                            $('#deleteTrackButtonYes').off('click');
                            $('#deleteTrackButtonYes').on('click', function(e) {
                                $.ajax({
                                    url: 'tracks'+ '/' + itemId,
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
                                        alert(data.responseJSON.Message);
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
    
    // ----------------------------------------------------------------------------------------------------------

    // Customer radio group functionality
    $('.customerRadioGroup').change(function () {
        let radioValue = $('input[name="customerRadioGroup"]:checked').val();
        switch (radioValue) {
            case 'artists':
                showButtons();
                // Search API call
                $('#searchButton').off('click');
                $('#searchButton').on('click', function(e) {
                    // Search field cannot be empty
                    if (!$('#searchField').val()) {
                        $('div#customerHomepageResults').html('<br>The name cannot be empty');
                    } else if (($('#searchField').val()).match('[=!@#$%^*?":{}|<>;]')) {
                        alert("The input field can't contain invalid characters!");
                    } else {
                        $.ajax({
                            url: 'artists',
                            type: 'GET',
                            data: {
                                name: $('#searchField').val()
                            }
                        })
                            .done (function(data) {
                                // Display results and clear the search field
                                displayArtistsCustomer(data);
                                $('#searchField').val('');
                            })
                            .fail (function(data) {
                                $('div#customerHomepageResults').html('<br>There is no data matching the entered text.');
                            })
                    }
                });

                // Fetch all API call
                $('#fetchAllButton').off('click');
                $('#fetchAllButton').on('click', function(e) {
                    $.ajax({
                        url: 'artists',
                        type: 'GET'
                    })
                        .done (function(data) {
                            // Display results and clear the search field
                            displayArtistsCustomer(data);
                            $('#searchField').val('');
                        })
                        .fail (function(data) {
                            $('div#customerHomepageResults').html('<br>There is no data to display.');
                        })
                });
                break;

            case 'albums':
                showButtons();
                // Search API call
                $('#searchButton').off('click');
                $('#searchButton').on('click', function(e) {
                    // Search field cannot be empty
                    if (!$('#searchField').val()) {
                        $('div#customerHomepageResults').html('<br>The title cannot be empty');
                    } else if (($('#searchField').val()).match('[=!@#$%^*?":{}|<>;]')) {
                        alert("The input field can't contain invalid characters!");
                    } else {
                        $.ajax({
                            url: 'albums',
                            type: 'GET',
                            data: {
                                title: $('#searchField').val()
                            }
                        })
                            .done (function(data) { 
                                displayAlbumsCustomer(data);        
                                $('#searchField').val('');
                            })
                            .fail (function(data) {
                                $('div#customerHomepageResults').html('<br>There is no data matching the entered text.');
                            })
                    }
                });

                // Fetch all API call
                $('#fetchAllButton').off('click');
                $('#fetchAllButton').on('click', function(e) {
                    $.ajax({
                        url: 'albums',
                        type: 'GET'
                    })
                        .done (function(data) {
                            // Display results and clear the search field
                            displayAlbumsCustomer(data);
                            $('#searchField').val('');
                        })
                        .fail (function(data) {
                            $('div#customerHomepageResults').html('<br>There is no data to display.');
                        })
                });
                break;

            case 'tracks':
                showButtons();
                // Search API call
                $('#searchButton').off('click');
                $('#searchButton').on('click', function(e) {
                    // Search field cannot be empty
                    if (!$('#searchField').val()) {
                        $('div#customerHomepageResults').html('<br>The name cannot be empty');
                    } else if (($('#searchField').val()).match('[=!@#$%^*?":{}|<>;]')) {
                        alert("The input field can't contain invalid characters!");
                    } else {
                        $.ajax({
                            url: 'tracks',
                            type: 'GET',
                            data: {
                                name: $('#searchField').val()
                            }
                        })
                            .done (function(data) { 
                                displayTracksCustomer(data);
                                $('#searchField').val('');
                            })
                            .fail (function(data) {
                                $('div#customerHomepageResults').html('<br>There is no data matching the entered text.');
                            })
                    }
                });
               
                // Fetch all API call
                $('#fetchAllButton').off('click');
                $('#fetchAllButton').on('click', function(e) {
                    $.ajax({
                        url: 'tracks',
                        type: 'GET'
                    })
                        .done (function(data) {
                            // Display results and clear the search field
                            displayTracksCustomer(data);
                            $('#searchField').val('');
                        })
                        .fail (function(data) {
                            $('div#adminResults').html('<br>There is no data to display.');
                        })
                });
                break;
        }
    });

    // Update user data
    $(document).off('click', 'img.editUser');
    $(document).on('click', 'img.editUser', function(e) {
        // Save the ID of the clicked item (in this case, a user)
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
        
        // GET ajax call to fetch all details by id
        $.ajax({
            url: 'users' + '/' + itemId,
            type: 'GET',
        })
            .done (function(data) {
                // Populate all the fields with the data received
                $('#updateUserFirstNameField').val(data.FirstName);
                $('#updateUserLastNameField').val(data.LastName);
                $('#updateUserAddressField').val(data.Address);
                $('#updateUserPostalCodeField').val(data.PostalCode);
                $('#updateUserCompanyField').val(data.Company);
                $('#updateUserCityField').val(data.City);
                $('#updateUserStateField').val(data.State);
                $('#updateUserCountryField').val(data.Country);
                $('#updateUserPhoneField').val(data.Phone);
                $('#updateUserFaxField').val(data.Fax);
                $('#updateUserEmailField').val(data.Email);
                $('#updateUserPasswordField').val('');

                $('#updateUserButton').off('click');
                $('#updateUserButton').on('click', function(e) {
                    // Mandatory fields cannot be empty
                    if (!$('#updateUserFirstNameField').val() || !$('#updateUserLastNameField').val() || 
                        !$('#updateUserAddressField').val() || !$('#updateUserCityField').val() || !$('#updateUserCountryField').val() || 
                        !$('#updateUserPhoneField').val() || !$('#updateUserEmailField').val()) {
                        alert('All fields marked with * are mandatory');
                    } else if (($('#updateUserFirstNameField').val()).match('[=!@#$%^*?":{}|<>;]') || 
                        ($('#updateUserLastNameField').val()).match('[=!@#$%^*?":{}|<>;]') || ($('#updateUserAddressField').val()).match('[=!@#$%^*?":{}|<>;]') || 
                        ($('#updateUserPostalCodeField').val()).match('[=!@#$%^*?":{}|<>;]') || ($('#updateUserCompanyField').val()).match('[=!@#$%^*?":{}|<>;]') || 
                        ($('#updateUserCityField').val()).match('[=!@#$%^*?":{}|<>;]') || ($('#updateUserStateField').val()).match('[=!@#$%^*?":{}|<>;]') ||
                        ($('#updateUserCountryField').val()).match('[=!@#$%^*?":{}|<>;]') || ($('#updateUserPhoneField').val()).match('[=!@#$%^*?":{}|<>;]') ||
                        ($('#updateUserFaxField').val()).match('[=!@#$%^*?":{}|<>;]')) {
                            alert("The input field(s) can't contain invalid characters!");
                    } else {
                        // Body needs to be raw JSON
                        let body = {
                            'firstName': $('#updateUserFirstNameField').val(),
                            'lastName': $('#updateUserLastNameField').val(),
                            'address': $('#updateUserAddressField').val(),
                            'postalCode': $('#updateUserPostalCodeField').val(),
                            'company': $('#updateUserCompanyField').val(),
                            'city': $('#updateUserCityField').val(),
                            'state': $('#updateUserStateField').val(),
                            'country': $('#updateUserCountryField').val(),
                            'phone': $('#updateUserPhoneField').val(),
                            'fax': $('#updateUserFaxField').val(),
                            'email': $('#updateUserEmailField').val(),
                            'password': $('#updateUserPasswordField').val()
                        }
                        $.ajax({
                            url: 'users'+ '/' + itemId,
                            type: 'PUT',
                            data: JSON.stringify(body)
                        })
                            .done (function(data) {
                                alert(data.Message);
                                // Hide the modal after update
                                updateUserModal.css('display', 'none');
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

    // User signup
    $('#signupForm').on('submit', function(e) {
        e.preventDefault();
        // Mandatory fields cannot be empty
        if (!$('#signupFirstNameField').val() || !$('#signupLastNameField').val() || !$('#signupAddressField').val() ||
            !$('#signupCityField').val() || !$('#signupCountryField').val() || !$('#signupPhoneField').val() || !$('#signupEmailField').val() ||
            !$('#signupPasswordField').val()) {
                alert('All fields marked with * are mandatory');
        } else if (($('#updateUserFirstNameField').val()).match('[=!@#$%^*?":{}|<>;]') || 
            ($('#updateUserLastNameField').val()).match('[=!@#$%^*?":{}|<>;]') || ($('#updateUserAddressField').val()).match('[=!@#$%^*?":{}|<>;]') || 
            ($('#updateUserPostalCodeField').val()).match('[=!@#$%^*?":{}|<>;]') || ($('#updateUserCompanyField').val()).match('[=!@#$%^*?":{}|<>;]') || 
            ($('#updateUserCityField').val()).match('[=!@#$%^*?":{}|<>;]') || ($('#updateUserStateField').val()).match('[=!@#$%^*?":{}|<>;]') ||
            ($('#updateUserCountryField').val()).match('[=!@#$%^*?":{}|<>;]') || ($('#updateUserPhoneField').val()).match('[=!@#$%^*?":{}|<>;]') ||
            ($('#updateUserFaxField').val()).match('[=!@#$%^*?":{}|<>;]')) {
                alert("The input field(s) can't contain invalid characters!");
        } else {
            $.ajax({
                url: 'users',
                type: 'POST',
                data: {
                    firstName: $('#signupFirstNameField').val(),
                    lastName: $('#signupLastNameField').val(),
                    address: $('#signupAddressField').val(), 
                    postalCode: $('#signupPostalCodeField').val(), 
                    company: $('#signupCompanyField').val(), 
                    city: $('#signupCityField').val(), 
                    state: $('#signupStateField').val(), 
                    country: $('#signupCountryField').val(), 
                    phone: $('#signupPhoneField').val(), 
                    fax: $('#signupFaxField').val(), 
                    email: $('#signupEmailField').val(), 
                    password: $('#signupPasswordField').val()
                }
            })
                .done (function(data) {
                    // Alert that the user was created
                    alert('Account created successfully');
                    // Redirect to login
                    window.location.href = 'login.php';
                    // Clear all fields
                    $('#signupFirstNameField').val('');
                    $('#signupLastNameField').val('');
                    $('#signupAddressField').val('');
                    $('#signupPostalCodeField').val('');
                    $('#signupCompanyField').val('');
                    $('#signupCityField').val('');
                    $('#signupStateField').val('');
                    $('#signupCountryField').val('');
                    $('#signupPhoneField').val('');
                    $('#signupFaxField').val('');
                    $('#signupEmailField').val('');
                    $('#signupPasswordField').val('');
                })
                .fail (function(data) {
                    alert(data.responseJSON.Message);
                })
        }
    });

    // Go to login if signup process is cancelled
    $('#signupBackButton').off('click');
    $('#signupBackButton').on('click', function(e) {
        window.location.href = 'login.php';
    });

    // Add to basket 
    $(document).off('click', 'img.addTrackToBasket');
    $(document).on('click', 'img.addTrackToBasket', function(e) {
        // Save the id of the clicked item (in this case, a track)
        let itemId = this.id; 
        // Table row which contains the added track
        tr = (this.parentElement).parentElement;
        // Name of the track
        trackName = tr.querySelector('.trackName').textContent;
        // Price of the track
        trackPrice = tr.querySelector('.unitPrice').textContent;

        // If IDs cookie is not empty
        if (getCookie('IDs')) {
            // If the same ID has been added, alert
            if (getCookie('IDs').includes(itemId)) {
                alert('Track has already been added!');
            // If a new track is inserted, add it to the cookies
            } else {
                alert('Added to basket!');

                addedTracksNames = getCookie('tracks');
                addedTracksNames = addedTracksNames.concat(trackName + '###,');
                setCookie('tracks', addedTracksNames, 365);

                addedTracksIds = getCookie('IDs');
                addedTracksIds = addedTracksIds.concat(itemId + ',');
                setCookie('IDs', addedTracksIds, 365);

                addedTracksPrices = getCookie('prices');
                addedTracksPrices = addedTracksPrices.concat(trackPrice + ',');
                setCookie('prices', addedTracksPrices, 365);

                totalPrice = parseFloat(getCookie('total'));
                totalPrice += parseFloat(trackPrice);
                setCookie('total', totalPrice.toFixed(2), 365);
            }   
        // If it is empty, it's the first time tracks are added to basket. Cookies are created
        } else {
            alert('Added to basket!');

            addedTracksNames = addedTracksNames.concat(trackName + '###,');
            setCookie('tracks', addedTracksNames, 365);

            addedTracksIds = addedTracksIds.concat(itemId + ',');
            setCookie('IDs', addedTracksIds, 365);

            addedTracksPrices = addedTracksPrices.concat(trackPrice + ',');
            setCookie('prices', addedTracksPrices, 365);

            totalPrice += parseFloat(trackPrice);
            setCookie('total', totalPrice.toFixed(2), 365);
        }
    });

    // Basket modal
    $(document).off('click', 'img.userBasket');
    $(document).on('click', 'img.userBasket', function(e) {
        // Save the id of the clicked item (in this case, a user)
        let itemId = this.id;
        // Show basket modal
        userBasketModal.show();
        // Close if user clicks on X
        spanClose.on('click', (function (e) {
            userBasketModal.css('display', 'none');
        }));
        // Close if user hits Escape key
        $(document).on('keydown', function (event) {
            if (event.key == 'Escape') {
                userBasketModal.css('display', 'none');
            }
        });

        // GET ajax call to fetch all details by id
        $.ajax({
            url: 'users' + '/' + itemId,
            type: 'GET',
        })
            .done (function(data) {
                // Populate all the fields with the data received
                $('#billingAddressField').val(data.Address);
                $('#billingPostalCodeField').val(data.PostalCode);
                $('#billingCityField').val(data.City);
                $('#billingStateField').val(data.State);
                $('#billingCountryField').val(data.Country);

                // Populate the tracks table, either with the tracks or display that is empty
                displayTracksBasket(getCookie('tracks'), getCookie('IDs') ,getCookie('prices'), getCookie('total'));
            })
            .fail (function (data) {
                alert(data.responseJSON.Message);
            })

            // Buy tracks button
            $('#buyTracksButton').off('click');
            $('#buyTracksButton').on('click', function(e) {
            // Mandatory fields cannot be empty
            if (!$('#billingAddressField').val() || !$('#billingCityField').val() || 
                !$('#billingCountryField').val()) {
                alert('All fields marked with * are mandatory');
                // If no tracks are added, purchase cannot be completed
            } else if (($('#billingAddressField').val()).match('[=!@#$%^*?":{}|<>;]') || ($('#billingCityField').val()).match('[=!@#$%^*?":{}|<>;]') ||
                ($('#billingStateField').val()).match('[=!@#$%^*?":{}|<>;]') || ($('#billingCountryField').val()).match('[=!@#$%^*?":{}|<>;]') || 
                ($('#billingPostalCodeField').val()).match('[=!@#$%^*?":{}|<>;]') ) {
                    alert("The input field can't contain invalid characters!");
            } else if (!getCookie('IDs')) {
                alert('You need to purchase at least 1 track!');
            } else {
                let date = new Date();
                let year = date.getUTCFullYear();
                let month = date.getUTCMonth() + 1;
                let day = date.getUTCDate();
                let newDate = year + '-' + month + '-' + day;
                $.ajax({
                    url: 'invoices',
                    type: 'POST', 
                    data: {
                        customerId: itemId,
                        invoiceDate: newDate,
                        billingAddress: $('#billingAddressField').val(),
                        billingCity: $('#billingCityField').val(),
                        billingState: $('#billingStateField').val(),
                        billingCountry: $('#billingCountryField').val(),
                        billingPostalCode: $('#billingPostalCodeField').val(),
                        total: getCookie('total')
                    }
                })
                    .done (function(data) {
                        alert('Track(s) ordered!');
                        
                        // For each track, call the POST for invoicelines
                        let IDs = getCookie('IDs').split(',');
                        let prices = getCookie('prices').split(',');
                        for(i = 0; i < IDs.length - 1; i ++ ) {
                            $.ajax({
                                url: 'invoicelines',
                                type: 'POST', 
                                data: {
                                    invoiceId: data.Id,
                                    trackId: IDs[i],
                                    unitPrice: prices[i],
                                    quantity: '1'
                                }
                            })
                                .done (function(data) {
                                    // Hide the modal after purchase
                                    userBasketModal.css('display', 'none');

                                    // Empty basket
                                    $('div#basketTracks').empty();

                                    // Clear cookies
                                    setCookie('tracks', '', 365);
                                    setCookie('IDs', '', 365);
                                    setCookie('prices', '', 365);
                                    setCookie('total', '', 365);

                                    // Empty the strings
                                    addedTracksNames = '';
                                    addedTracksIds = '';
                                    addedTracksPrices = '';
                                    // Reset the price
                                    totalPrice = 0;

                                })
                                .fail (function(data) {
                                    alert(data.responseJSON.Message);
                                })
                        }
                        
                    })
                    .fail (function(data) {
                        alert(data.responseJSON.Message);
                    })
            }
        })
        
    });

    // Delete track from basket
    $(document).off('click', 'img.deleteTrackFromBasket');
    $(document).on('click', 'img.deleteTrackFromBasket', function(e) {
        // Table row which contains the added track
        tr = (this.parentElement).parentElement;
        // Save the index of the track
        trackIndex = $(tr).attr('id'); 

        alert('Deleted!');
        
        // Fetch the current cookie for the names
        addedTracksNames = getCookie('tracks'); 
        // Split by the separator
        addedTracksNames = addedTracksNames.split('###,');
        // Delete the name 
        addedTracksNames.splice(trackIndex, 1);   
        length =  addedTracksNames.length;
        for (i = 0; i < length - 1; i ++) {
            // Form the new cookie with the remaining names
            newAddedTracksNames = newAddedTracksNames.concat(addedTracksNames[i] + '###,');
        }
        // Set the new cookie
        setCookie('tracks', newAddedTracksNames, 365);
        // Empty the strings
        addedTracksNames = '';
        newAddedTracksNames = '';

        // Fetch the current cookie for the ids
        addedTracksIds = getCookie('IDs');
        // Split by the separator
        addedTracksIds = addedTracksIds.split(',');
        // Delete the id
        addedTracksIds.splice(trackIndex, 1);
        length =  addedTracksIds.length;
        for (i = 0; i < length - 1; i ++) {
            // Form the new cookie with the remaining ids
            newAddedTracksIds = newAddedTracksIds.concat(addedTracksIds[i] + ',');
        }
        // Set the new cokie
        setCookie('IDs', newAddedTracksIds, 365);
        // Empty the strings
        addedTracksIds = '';
        newAddedTracksIds = '';

        // Fetch the current cookie for the total
        totalPrice = parseFloat(getCookie('total'));
        // Fetch the current cookie for all prices
        addedTracksPrices = getCookie('prices');
        // Split by the separator
        addedTracksPrices = addedTracksPrices.split(',');
        // Update the total price
        totalPrice -= parseFloat(addedTracksPrices[trackIndex]);
        // Set the new cookie for the total price
        setCookie('total', totalPrice.toFixed(2), 365);
        // Delete the price from the array
        addedTracksPrices.splice(trackIndex, 1);
        length =  addedTracksPrices.length;
        for (i = 0; i < length - 1; i ++) {
            // Form the new cookie with the remaining prices
            newAddedTracksPrices = newAddedTracksPrices.concat(addedTracksPrices[i] + ',');
        }        
        // Set the new cookie for all prices
        setCookie('prices', newAddedTracksPrices, 365);
        // Empty the strings
        addedTracksPrices = '';
        newAddedTracksPrices = '';         

        // Refresh the basket with the remaining tracks
        displayTracksBasket(getCookie('tracks'), getCookie('IDs') ,getCookie('prices'), getCookie('total'));
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