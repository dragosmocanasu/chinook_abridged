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
            append($("<td />", { 'html': "<img id='" + artistId + "' class='smallButton editArtist' src='img/edit.png'>", 'class': 'action'})).
            append($("<td />", { 'html': "<img id='" + artistId + "' class='smallButton deleteArtist' src='img/delete.png'>", 'class': 'action'}))
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
            url: 'src/admin_api.php/artists/' + artistId,
            type: 'GET'
        })
            .done (function(data) {
                artistName = data.Name;
                row.
                    append($('<td />', { 'text': albumTitle})).
                    append($('<td />', { 'text': artistName})).
                    append($("<td />", { 'html': "<img id='" + albumId + "' artistId='" + artistId + "' class='smallButton editAlbum' src='img/edit.png'>", 'class': 'action'})).
                    append($("<td />", { 'html': "<img id='" + albumId + "' class='smallButton deleteAlbum' src='img/delete.png'>", 'class': 'action'}))
                tableBody.append(row);
            })
            .fail (function(data) {
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

    const tableBody = $('<tbody />');
    for (let i = 0; i < trackData.length; i ++) {
        const row = $('<tr />');
        const trackId = trackData[i].TrackId;
        const trackName = trackData[i].Name;

        const albumId = trackData[i].AlbumId;
        const mediaTypeId = trackData[i].MediaTypeId;
        const genreId = trackData[i].GenreId;

        let albumTitle = '';
        let mediaTypeName = '';
        let genreName = '';

        $.ajax({
            url: 'src/admin_api.php/albums/' + albumId,
            type: 'GET'
        })
            .done (function(data) {
                albumTitle = data.Title;
                $.ajax({
                    url: 'src/admin_api.php/mediatypes/' + mediaTypeId,
                    type: 'GET'
                })
                    .done (function(data) {
                        mediaTypeName = data.Name;
                        $.ajax({
                            url: 'src/admin_api.php/genres/' + genreId,
                            type: 'GET'
                        })
                            .done (function (data) {
                                genreName = data.Name;
                                row.
                                    append($('<td />', { 'text': trackName})).
                                    append($('<td />', { 'text': albumTitle})).
                                    append($('<td />', { 'text': mediaTypeName})).
                                    append($('<td />', { 'text': genreName})).
                                    append($('<td />', { 'text': trackData[i].Composer})).
                                    append($('<td />', { 'text': trackData[i].Milliseconds})).
                                    append($('<td />', { 'text': trackData[i].Bytes})).
                                    append($('<td />', { 'text': trackData[i].UnitPrice})).
                                    append($("<td />", { 'html': "<img id='" + trackId + "' albumId='" + albumId + "' mediaTypeId='" + mediaTypeId + "' genreId='" + genreId + "' class='smallButton editTrack' src='img/edit.png'>", 'class': 'action'})).
                                    append($("<td />", { 'html': "<img id='" + trackId + "' class='smallButton deleteTrack' src='img/delete.png'>", 'class': 'action'}))
                                tableBody.append(row);                                
                            }) 
                            .fail (function (data) {
                                genreName = 'Unknown';
                            })
                    })
                    .fail (function(data) {
                        mediaTypeName = 'Unknown';
                    })
            })
            .fail (function(data) {
                albumTitle = 'Unknown';
            })
    }
    table.append(tableBody);
    table.appendTo($('div#adminResults'));
    $('<br>').appendTo('div#adminResults');
}

function displayArtistsCustomer(artistData) {
    $('div#customerResults').empty();

    const table = $('<table />');
    const header = $('<thead />');
    const headerRow = $('<tr />');
    headerRow.
        append($('<th />', { 'text': 'Name'})).
        append($('<th />', { 'class': 'action'}))
    header.append(headerRow);
    table.append(header);

    const tableBody = $('<tbody />');
    for (let i = 0; i < artistData.length; i ++) {
        const row = $('<tr />');
        const artistId = artistData[i].ArtistId;
        row.
            append($('<td />', { 'text': artistData[i].Name})).
            append($("<td />", { 'html': "<img id='" + artistId + "' class='smallButton addToCartArtist' src='img/add-to-cart.png'>", 'class': 'action'}))
        tableBody.append(row);
    }
    table.append(tableBody);
    table.appendTo($('div#customerResults'));
    $('<br>').appendTo('div#customerResults');
}

function displayAlbumsCustomer(albumData) {
    $('div#customerResults').empty();

    const table = $('<table />');
    const header = $('<thead />');
    const headerRow = $('<tr />');
    headerRow.
        append($('<th />', { 'text': 'Title'})).
        append($('<th />', { 'text': 'Artist'})).
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
            url: 'src/customer_api.php/artists/' + artistId,
            type: 'GET'
        })
            .done (function(data) {
                artistName = data.Name;
                row.
                    append($('<td />', { 'text': albumTitle})).
                    append($('<td />', { 'text': artistName})).
                    append($("<td />", { 'html': "<img id='" + albumId + "' artistId='" + artistId + "' class='smallButton addToCartAlbum' src='img/add-to-cart.png'>", 'class': 'action'}))
                tableBody.append(row);
            })
            .fail (function(data) {
                artistName = 'Unknown'
            })
    }
    table.append(tableBody);
    table.appendTo($('div#customerResults'));
    $('<br>').appendTo('div#customerResults');
}

function displayTracksCustomer(trackData) {
    $('div#customerResults').empty();

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

    const tableBody = $('<tbody />');
    for (let i = 0; i < trackData.length; i ++) {
        const row = $('<tr />');
        const trackId = trackData[i].TrackId;
        const trackName = trackData[i].Name;

        const albumId = trackData[i].AlbumId;
        const mediaTypeId = trackData[i].MediaTypeId;
        const genreId = trackData[i].GenreId;

        let albumTitle = '';
        let mediaTypeName = '';
        let genreName = '';

        $.ajax({
            url: 'src/customer_api.php/albums/' + albumId,
            type: 'GET'
        })
            .done (function(data) {
                albumTitle = data.Title;
                $.ajax({
                    url: 'src/customer_api.php/mediatypes/' + mediaTypeId,
                    type: 'GET'
                })
                    .done (function(data) {
                        mediaTypeName = data.Name;
                        $.ajax({
                            url: 'src/customer_api.php/genres/' + genreId,
                            type: 'GET'
                        })
                            .done (function (data) {
                                genreName = data.Name;
                                row.
                                    append($('<td />', { 'text': trackName})).
                                    append($('<td />', { 'text': albumTitle})).
                                    append($('<td />', { 'text': mediaTypeName})).
                                    append($('<td />', { 'text': genreName})).
                                    append($('<td />', { 'text': trackData[i].Composer})).
                                    append($('<td />', { 'text': trackData[i].Milliseconds})).
                                    append($('<td />', { 'text': trackData[i].Bytes})).
                                    append($('<td />', { 'text': trackData[i].UnitPrice})).
                                    append($("<td />", { 'html': "<img id='" + trackId + "' albumId='" + albumId + "' mediaTypeId='" + mediaTypeId + "' genreId='" + genreId + "' class='smallButton addToCartTrack' src='img/add-to-cart.png'>", 'class': 'action'}))
                                tableBody.append(row);                                
                            }) 
                            .fail (function (data) {
                                genreName = 'Unknown';
                            })
                    })
                    .fail (function(data) {
                        mediaTypeName = 'Unknown';
                    })
            })
            .fail (function(data) {
                albumTitle = 'Unknown';
            })
    }
    table.append(tableBody);
    table.appendTo($('div#customerResults'));
    $('<br>').appendTo('div#customerResults');
}