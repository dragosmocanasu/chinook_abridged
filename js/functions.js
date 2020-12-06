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