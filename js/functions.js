// Displays the artists for the admin page, with the edit and delete buttons
function displayArtistsAdmin(artistData) {
    $('div#adminResults').empty();

    const table = $('<table />');
    const header = $('<thead />');
    const headerRow = $('<tr />');
    headerRow.
        append($('<th />', { 'html': 'Name'})).
        append($('<th />', { 'class': 'action'})).
        append($('<th />', { 'class': 'action'}))
    header.append(headerRow);
    table.append(header);

    const tableBody = $('<tbody />');
    for (let i = 0; i < artistData.length; i ++) {
        const row = $('<tr />');
        const artistId = artistData[i].ArtistId;
        row.
            append($('<td />', { 'html': artistData[i].Name})).
            append($('<td />', { 'html': "<img id='" + artistId + "' class='smallButton editArtist' src='img/edit.png'>", 'class': 'action'})).
            append($('<td />', { 'html': "<img id='" + artistId + "' class='smallButton deleteArtist' src='img/delete.png'>", 'class': 'action'}))
        tableBody.append(row);
    }
    table.append(tableBody);
    table.appendTo($('div#adminResults'));
    $('<br>').appendTo('div#adminResults');
}

// Displays the albums for the admin page, with the edit and delete buttons
function displayAlbumsAdmin(albumData) {
    $('div#adminResults').empty();

    const table = $('<table />');
    const header = $('<thead />');
    const headerRow = $('<tr />');
    headerRow.
        append($('<th />', { 'html': 'Title'})).
        append($('<th />', { 'html': 'Artist'})).
        append($('<th />', { 'class': 'action'})).
        append($('<th />', { 'class': 'action'}))
    header.append(headerRow);
    table.append(header);

    const tableBody = $('<tbody />');
    for (let i = 0; i < albumData.length; i ++) {
        const row = $('<tr />');
        const albumId = albumData[i].AlbumId;
        const albumTitle = albumData[i].Title;
        const artistId = albumData[i].ArtistId;
        let artistName = '';
        // Fetch the artist for an album
        $.ajax({
            url: 'artists/' + artistId,
            type: 'GET'
        })
            .done (function (data) {
                artistName = data.Name;
                row.
                    append($('<td />', { 'html': albumTitle})).
                    append($('<td />', { 'html': artistName})).
                    append($('<td />', { 'html': "<img id='" + albumId + "' artistId='" + artistId + "' class='smallButton editAlbum' src='img/edit.png'>", 'class': 'action'})).
                    append($('<td />', { 'html': "<img id='" + albumId + "' class='smallButton deleteAlbum' src='img/delete.png'>", 'class': 'action'}))
                tableBody.append(row);
            })
            .fail (function (data) {
                artistName = 'Unknown'
            })
    }
    table.append(tableBody);
    table.appendTo($('div#adminResults'));
    $('<br>').appendTo('div#adminResults');
}

// Displays the tracks for the admin page, with the edit and delete buttons
function displayTracksAdmin(trackData) {
    $('div#adminResults').empty();

    const table = $('<table />');
    const header = $('<thead />');
    const headerRow = $('<tr />');
    headerRow.
        append($('<th />', { 'html': 'Name'})).
        append($('<th />', { 'html': 'Album'})).
        append($('<th />', { 'html': 'Media Type'})).
        append($('<th />', { 'html': 'Genre'})).
        append($('<th />', { 'html': 'Composer'})).
        append($('<th />', { 'html': 'Milliseconds'})).
        append($('<th />', { 'html': 'Bytes'})).
        append($('<th />', { 'html': 'Unit Price'})).
        append($('<th />', { 'class': 'action'})).
        append($('<th />', { 'class': 'action'}))
    header.append(headerRow);
    table.append(header);

    let albums = [];
    let mediatypes = [];
    let genres = [];
    
    // Fetch the albums for a track
    $.ajax({
        url: 'albums',
        type: 'GET'
    })
        .done (function (data) {
            albums = data;
            // Fetch the media type for a track
            $.ajax({
                url: 'mediatypes',
                type: 'GET'
            })
            .done (function (data) {
                mediatypes = data;
                // Fetch the genre for a track
                $.ajax({
                    url: 'genres',
                    type: 'GET'
                })
                .done (function (data) {
                    genres = data;
                    
                    const tableBody = $('<tbody />');
                    
                    for (let i = 0; i < trackData.length; i ++) {
                        const row = $('<tr />');

                        const trackId = trackData[i].TrackId;
                        const albumId = trackData[i].AlbumId;
                        const mediaTypeId = trackData[i].MediaTypeId;
                        const genreId = trackData[i].GenreId;

                        const trackName = trackData[i].Name;
                        let filteredAlbum = '';
                        filteredAlbum = albums.filter(function (item) {;
                            return item.AlbumId == albumId;
                        });
                        let albumTitle = filteredAlbum[0].Title;
                        let mediaTypeName = mediatypes[mediaTypeId-1].Name;
                        let genreName = genres[genreId-1].Name;

                        row.
                            append($('<td />', { 'html': trackName})).
                            append($('<td />', { 'html': albumTitle})).
                            append($('<td />', { 'html': mediaTypeName})).
                            append($('<td />', { 'html': genreName})).
                            append($('<td />', { 'html': trackData[i].Composer})).
                            append($('<td />', { 'html': trackData[i].Milliseconds})).
                            append($('<td />', { 'html': trackData[i].Bytes})).
                            append($('<td />', { 'html': trackData[i].UnitPrice})).
                            append($('<td />', { 'html': "<img id='" + trackId + "' albumId='" + albumId + "' mediaTypeId='" + mediaTypeId + "' genreId='" + genreId + "' class='smallButton editTrack' src='img/edit.png'>", 'class': 'action'})).
                            append($('<td />', { 'html': "<img id='" + trackId + "' class='smallButton deleteTrack' src='img/delete.png'>", 'class': 'action'}))
                        tableBody.append(row);                                
                    }
                    table.append(tableBody);
                    table.appendTo($('div#adminResults'));
                    $('<br>').appendTo('div#adminResults');

                })
                .fail (function (data) {
                    genres = null;
                })
            })
            .fail (function (data) {
                mediatypes = null;
            })
        })
        .fail (function (data) {
            albums = null;
        })    
}

// Displays the artists for the customer page
function displayArtistsCustomer(artistData) {
    $('div#customerHomepageResults').empty();

    const table = $('<table />');
    const header = $('<thead />');
    const headerRow = $('<tr />');
    headerRow.
        append($('<th />', { 'html': 'Name'}))
    header.append(headerRow);
    table.append(header);

    const tableBody = $('<tbody />');
    for (let i = 0; i < artistData.length; i ++) {
        const row = $('<tr />');
        row.
            append($('<td />', { 'html': artistData[i].Name}))
        tableBody.append(row);
    }
    table.append(tableBody);
    table.appendTo($('div#customerHomepageResults'));
    $('<br>').appendTo('div#customerHomepageResults');
}

// Displays the albums for the customer page
function displayAlbumsCustomer(albumData) {
    $('div#customerHomepageResults').empty();

    const table = $('<table />');
    const header = $('<thead />');
    const headerRow = $('<tr />');
    headerRow.
        append($('<th />', { 'html': 'Title'})).
        append($('<th />', { 'html': 'Artist'}))
    header.append(headerRow);
    table.append(header);

    const tableBody = $('<tbody />');
    for (let i = 0; i < albumData.length; i ++) {
        const row = $('<tr />');
        const albumTitle = albumData[i].Title;
        const artistId = albumData[i].ArtistId;
        let artistName = '';
        $.ajax({
            url: 'artists/' + artistId,
            type: 'GET'
        })
            .done (function (data) {
                artistName = data.Name;
                row.
                    append($('<td />', { 'html': albumTitle})).
                    append($('<td />', { 'html': artistName}))
                tableBody.append(row);
            })
            .fail (function (data) {
                artistName = 'Unknown'
            })
    }
    table.append(tableBody);
    table.appendTo($('div#customerHomepageResults'));
    $('<br>').appendTo('div#customerHomepageResults');
}

// Displays the tracks for the customer page, with the buy button
function displayTracksCustomer(trackData) {
    $('div#customerHomepageResults').empty();

    const table = $('<table />');
    const header = $('<thead />');
    const headerRow = $('<tr />');
    headerRow.
        append($('<th />', { 'html': 'Name'})).
        append($('<th />', { 'html': 'Album'})).
        append($('<th />', { 'html': 'Media Type'})).
        append($('<th />', { 'html': 'Genre'})).
        append($('<th />', { 'html': 'Composer'})).
        append($('<th />', { 'html': 'Milliseconds'})).
        append($('<th />', { 'html': 'Bytes'})).
        append($('<th />', { 'html': 'Unit Price'})).
        append($('<th />', { 'class': 'action'}))
    header.append(headerRow);
    table.append(header);

    let albums = [];
    let mediatypes = [];
    let genres = [];

    $.ajax({
        url: 'albums',
        type: 'GET'
    })
        .done (function (data) {
            albums = data;
            $.ajax({
                url: 'mediatypes',
                type: 'GET'
            })
            .done (function (data) {
                mediatypes = data;
                $.ajax({
                    url: 'genres',
                    type: 'GET'
                })
                .done (function (data) {
                    genres = data;

                    const tableBody = $('<tbody />');
                    for (let i = 0; i < trackData.length; i ++) {
                        const row = $('<tr />');
                        
                        const trackId = trackData[i].TrackId;
                        const albumId = trackData[i].AlbumId;
                        const mediaTypeId = trackData[i].MediaTypeId;
                        const genreId = trackData[i].GenreId;
                
                        const trackName = trackData[i].Name;
                        let filteredAlbum = '';
                        filteredAlbum = albums.filter(function (item) {;
                            return item.AlbumId == albumId;
                        });
                        let albumTitle = filteredAlbum[0].Title;
                        let mediaTypeName = mediatypes[mediaTypeId-1].Name;
                        let genreName = genres[genreId-1].Name;
                
                        row.
                            append($('<td />', { 'html': trackName, 'class': 'trackName'})).
                            append($('<td />', { 'html': albumTitle, 'class': 'albumTitle'})).
                            append($('<td />', { 'html': mediaTypeName, 'class': 'mediaTypeName'})).
                            append($('<td />', { 'html': genreName, 'class':'genreName'})).
                            append($('<td />', { 'html': trackData[i].Composer, 'class':'composer'})).
                            append($('<td />', { 'html': trackData[i].Milliseconds, 'class':'milliseconds'})).
                            append($('<td />', { 'html': trackData[i].Bytes, class:'bytes'})).
                            append($('<td />', { 'html': trackData[i].UnitPrice, class:'unitPrice'})).
                            append($('<td />', { 'html': "<img id='" + trackId + "' albumId='" + albumId + "' mediaTypeId='" + mediaTypeId + "' genreId='" + genreId + "' class='smallButton addTrackToBasket' src='img/add-to-cart.png'>", 'class': 'action'}))
                        tableBody.append(row);                                
                    }
                    table.append(tableBody);
                    table.appendTo($('div#customerHomepageResults'));
                    $('<br>').appendTo('div#customerHomepageResults');
                })  
                .fail (function (data) {
                    genres = null;
                })
            })
            .fail (function (data) {
                mediatypes = null;
            })
        })
        .fail (function (data) {
            albums = null;
        }) 
}

// Display the tracks in the basket modal, with the delete button
function displayTracksBasket (trackNames, trackIds, trackPrices, total) {
    $('div#basketTracks').empty();

    // If there is any data to display, form the table
    if (trackNames) {
        const table = $('<table />');
        const header = $('<thead />');
        const headerRow = $('<tr />');
        headerRow.
            append($('<th />', { 'html': 'Name'})).
            append($('<th />', { 'html': 'Price'})).
            append($('<th />', { 'class': 'action'}))
        header.append(headerRow);
        table.append(header);
    
        trackNames = trackNames.split('###,');
        trackPrices = trackPrices.split(',');
        trackIds = trackIds.split(',');
    
        const tableBody = $('<tbody />');
        for (let i = 0; i < trackNames.length - 1; i ++) {
            const row = $('<tr />');
            row.attr('id', i);
            row.
                append($('<td />', { 'html': trackNames[i], 'class': 'trackName'})).
                append($('<td />', { 'html': trackPrices[i], class:'trackPrice'})).
                append($('<td />', { 'html': "<img class='smallButton deleteTrackFromBasket' src='img/delete.png'>", 'class': 'action'}))
            tableBody.append(row);                                
        }
        table.append(tableBody);
        table.appendTo($('div#basketTracks'));
        $('div#basketTotal').text('Total: ' + total + '$');
        $('div#basketTotal').css('font-weight', 'bold');
        $('<br>').appendTo('div#basketTracks');
        // If not, show a message and a total of 0
    } else {
        $('div#basketTracks').text('Your basket is empty');
        $('<br>').appendTo('div#basketTracks');
        
        $('div#basketTotal').text('Total: 0.00$');
        $('div#basketTotal').css('font-weight', 'bold');
        $('<br>').appendTo('div#basketTracks');
    }
}