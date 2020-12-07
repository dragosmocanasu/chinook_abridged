function displayArtists(data) {
    $('div#results').empty();

    const table = $('<table />');
    const header = $('<thead />');
    const headerRow = $('<tr />');
    headerRow.
        append($('<th />', { 'text': 'Name'})).
        append($('<th />', { 'class': 'action'})).
        append($('<th />', { 'class': 'action'})).
        append($('<th />', { 'class': 'action'}))
    header.append(headerRow);
    table.append(header);

    const tableBody = $('<tbody />');
    for (let i = 0; i < data.length; i ++) {
        const row = $('<tr />');
        const artistId = data[i].ArtistId;
        row.
            append($('<td />', { 'text': data[i].Name})).
            append($("<td />", { 'html': "<img id='" + artistId + "' class='smallButton editArtist' src='img/edit.png'>", 'class': 'action'})).
            append($("<td />", { 'html': "<img id='" + artistId + "' class='smallButton deleteArtist' src='img/delete.png'>", 'class': 'action'}))
        tableBody.append(row);
    }
    table.append(tableBody);
    table.appendTo($('div#results'));
    $('<br>').appendTo('div#results');
}

function displayAllArtists(data) {
    $('div#results').empty();

    const table = $('<table />');
    const header = $('<thead />');
    const headerRow = $('<tr />');
    headerRow.
        append($('<th />', { 'text': 'Name'})).
        append($('<th />', { 'class': 'action'})).
        append($('<th />', { 'class': 'action'})).
        append($('<th />', { 'class': 'action'}))
    header.append(headerRow);
    table.append(header);

    const tableBody = $('<tbody />');
    for (let i = 0; i < data.length; i ++) {
        const row = $('<tr />');
        const artistId = data[i].ArtistId;
        row.
            append($('<td />', { 'text': data[i].Name})).
            append($("<td />", { 'html': "<img id='" + artistId + "' class='smallButton editArtist' src='img/edit.png'>", 'class': 'action'})).
            append($("<td />", { 'html': "<img id='" + artistId + "' class='smallButton deleteArtist' src='img/delete.png'>", 'class': 'action'}))
        tableBody.append(row);
    }
    table.append(tableBody);
    table.appendTo($('div#results'));
    $('<br>').appendTo('div#results');
}

function displayAlbums(albumData) {
    $('div#results').empty();

    const table = $('<table />');
    const header = $('<thead />');
    const headerRow = $('<tr />');
    headerRow.
        append($('<th />', { 'text': 'Title'})).
        append($('<th />', { 'text': 'Artist Name'})).
        append($('<th />', { 'class': 'action'})).
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
                    append($("<td />", { 'html': "<img id='" + albumId + "' class='smallButton editAlbum' src='img/edit.png'>", 'class': 'action'})).
                    append($("<td />", { 'html': "<img id='" + albumId + "' class='smallButton deleteAlbum' src='img/delete.png'>", 'class': 'action'}))
                tableBody.append(row);
            })
            .fail (function(data) {
                artistName = 'Unknown'
            })
    }
    table.append(tableBody);
    table.appendTo($('div#results'));
    $('<br>').appendTo('div#results');
}

function displayAllAlbums(albumData) {
    $('div#results').empty();

    const table = $('<table />');
    const header = $('<thead />');
    const headerRow = $('<tr />');
    headerRow.
        append($('<th />', { 'text': 'Title'})).
        append($('<th />', { 'text': 'Artist Name'})).
        append($('<th />', { 'class': 'action'})).
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
                    append($("<td />", { 'html': "<img id='" + albumId + "' class='smallButton editAlbum' src='img/edit.png'>", 'class': 'action'})).
                    append($("<td />", { 'html': "<img id='" + albumId + "' class='smallButton deleteAlbum' src='img/delete.png'>", 'class': 'action'}))
                tableBody.append(row);
            })
            .fail (function(data) {
                artistName = 'Unknown'
            })
    }
    table.append(tableBody);
    table.appendTo($('div#results'));
    $('<br>').appendTo('div#results');
}