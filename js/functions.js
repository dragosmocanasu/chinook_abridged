function displayArtistsAdmin(artistData) {
    $('div#adminResults').empty();

    const table = $('<table />');
    const header = $('<thead />');
    const headerRow = $('<tr />');
    headerRow.
        append($('<th />', { 'text': 'Name'})).
        append($('<th />', { 'class': 'action'})).
        append($('<th />', { 'class': 'action'}))
    header.append(headerRow);
    table.append(header);

    const tableBody = $('<tbody />');
    for (let i = 0; i < artistData.length; i ++) {
        const row = $('<tr />');
        const artistId = artistData[i].ArtistId;
        row.
            append($('<td />', { 'text': artistData[i].Name})).
            append($('<td />', { 'html': "<img id='" + artistId + "' class='smallButton editArtist' src='img/edit.png'>", 'class': 'action'})).
            append($('<td />', { 'html': "<img id='" + artistId + "' class='smallButton deleteArtist' src='img/delete.png'>", 'class': 'action'}))
        tableBody.append(row);
    }
    table.append(tableBody);
    table.appendTo($('div#adminResults'));
    $('<br>').appendTo('div#adminResults');
}

function displayAlbumsAdmin(albumData) {
    $('div#adminResults').empty();

    const table = $('<table />');
    const header = $('<thead />');
    const headerRow = $('<tr />');
    headerRow.
        append($('<th />', { 'text': 'Title'})).
        append($('<th />', { 'text': 'Artist'})).
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
        $.ajax({
            url: 'artists/' + artistId,
            type: 'GET'
        })
            .done (function (data) {
                artistName = data.Name;
                row.
                    append($('<td />', { 'text': albumTitle})).
                    append($('<td />', { 'text': artistName})).
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

function displayTracksAdmin(trackData) {
    $('div#adminResults').empty();

    const table = $('<table />');
    const header = $('<thead />');
    const headerRow = $('<tr />');
    headerRow.
        append($('<th />', { 'text': 'Name'})).
        append($('<th />', { 'text': 'Album'})).
        append($('<th />', { 'text': 'Media Type'})).
        append($('<th />', { 'text': 'Genre'})).
        append($('<th />', { 'text': 'Composer'})).
        append($('<th />', { 'text': 'Milliseconds'})).
        append($('<th />', { 'text': 'Bytes'})).
        append($('<th />', { 'text': 'Unit Price'})).
        append($('<th />', { 'class': 'action'})).
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
                        let albumTitle = albums[albumId-1].Title;
                        let mediaTypeName = mediatypes[mediaTypeId-1].Name;
                        let genreName = genres[genreId-1].Name;

                        row.
                            append($('<td />', { 'text': trackName})).
                            append($('<td />', { 'text': albumTitle})).
                            append($('<td />', { 'text': mediaTypeName})).
                            append($('<td />', { 'text': genreName})).
                            append($('<td />', { 'text': trackData[i].Composer})).
                            append($('<td />', { 'text': trackData[i].Milliseconds})).
                            append($('<td />', { 'text': trackData[i].Bytes})).
                            append($('<td />', { 'text': trackData[i].UnitPrice})).
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

function displayArtistsCustomer(artistData) {
    $('div#customerHomepageResults').empty();

    const table = $('<table />');
    const header = $('<thead />');
    const headerRow = $('<tr />');
    headerRow.
        append($('<th />', { 'text': 'Name'}))
    header.append(headerRow);
    table.append(header);

    const tableBody = $('<tbody />');
    for (let i = 0; i < artistData.length; i ++) {
        const row = $('<tr />');
        //const artistId = artistData[i].ArtistId;
        row.
            append($('<td />', { 'text': artistData[i].Name}))
        tableBody.append(row);
    }
    table.append(tableBody);
    table.appendTo($('div#customerHomepageResults'));
    $('<br>').appendTo('div#customerHomepageResults');
}

function displayAlbumsCustomer(albumData) {
    $('div#customerHomepageResults').empty();

    const table = $('<table />');
    const header = $('<thead />');
    const headerRow = $('<tr />');
    headerRow.
        append($('<th />', { 'text': 'Title'})).
        append($('<th />', { 'text': 'Artist'}))
    header.append(headerRow);
    table.append(header);

    const tableBody = $('<tbody />');
    for (let i = 0; i < albumData.length; i ++) {
        const row = $('<tr />');
        //const albumId = albumData[i].AlbumId;
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
                    append($('<td />', { 'text': albumTitle})).
                    append($('<td />', { 'text': artistName}))
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

function displayTracksCustomer(trackData) {
    $('div#customerHomepageResults').empty();

    const table = $('<table />');
    const header = $('<thead />');
    const headerRow = $('<tr />');
    headerRow.
        append($('<th />', { 'text': 'Name'})).
        append($('<th />', { 'text': 'Album'})).
        append($('<th />', { 'text': 'Media Type'})).
        append($('<th />', { 'text': 'Genre'})).
        append($('<th />', { 'text': 'Composer'})).
        append($('<th />', { 'text': 'Milliseconds'})).
        append($('<th />', { 'text': 'Bytes'})).
        append($('<th />', { 'text': 'Unit Price'})).
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
                        let albumTitle = albums[albumId-1].Title;
                        let mediaTypeName = mediatypes[mediaTypeId-1].Name;
                        let genreName = genres[genreId-1].Name;
                
                        row.
                            append($('<td />', { 'text': trackName, 'class': 'trackName'})).
                            append($('<td />', { 'text': albumTitle, 'class': 'albumTitle'})).
                            append($('<td />', { 'text': mediaTypeName, 'class': 'mediaTypeName'})).
                            append($('<td />', { 'text': genreName, 'class':'genreName'})).
                            append($('<td />', { 'text': trackData[i].Composer, 'class':'composer'})).
                            append($('<td />', { 'text': trackData[i].Milliseconds, 'class':'milliseconds'})).
                            append($('<td />', { 'text': trackData[i].Bytes, class:'bytes'})).
                            append($('<td />', { 'text': trackData[i].UnitPrice, class:'unitPrice'})).
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

function displayTracksBasket (trackNames, trackIds, trackPrices, total) {
    $('div#basketTracks').empty();

    if (trackNames) {
        const table = $('<table />');
        const header = $('<thead />');
        const headerRow = $('<tr />');
        headerRow.
            append($('<th />', { 'text': 'Name'})).
            append($('<th />', { 'text': 'Price'})).
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
                append($('<td />', { 'text': trackNames[i], 'class': 'trackName'})).
                append($('<td />', { 'text': trackPrices[i], class:'trackPrice'})).
                append($('<td />', { 'html': "<img class='smallButton deleteTrackFromBasket' src='img/delete.png'>", 'class': 'action'}))
            tableBody.append(row);                                
        }
        table.append(tableBody);
        table.appendTo($('div#basketTracks'));
        $('div#basketTotal').text('Total: ' + total + '$');
        $('div#basketTotal').css('font-weight', 'bold');
        $('<br>').appendTo('div#basketTracks');
    } else {
        $('div#basketTracks').text('Your basket is empty');
        $('<br>').appendTo('div#basketTracks');
        $('div#basketTotal').text('Total: 0.00$');
        $('div#basketTotal').css('font-weight', 'bold');
        $('<br>').appendTo('div#basketTracks');
    }
}