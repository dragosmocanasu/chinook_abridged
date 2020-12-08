<?php
    session_start();
    require_once('head.htm');
    require_once('footer.htm');
    
    if (isset($_SESSION['userType']) && $_SESSION['userType'] == 'admin') {
?>
    <body>
        <header>
            <h1>
                Admin Page
            </h1>
        </header>
        <div class="adminRadioGroup">
            <label>
                <input type="radio" name="adminRadioGroup" class="radio" id="artistsRadio" value="artists"> Artists
            </label>
            <br>
            <label>
                <input type="radio" name="adminRadioGroup" class="radio" id="albumsRadio" value="albums"> Albums
            </label>
            <br>
            <label> 
            <input type="radio" name="adminRadioGroup" class="radio" id="tracksRadio" value="tracks"> Tracks
            </label>
            <br>
        </div>
        <br>

        
        <input type="text" id="searchField" name="searchField" placeholder="Type a name..." required>
        <input type="button" id="searchButton" value="Search">
        <input type="button" id="fetchAllButton" value="Fetch all"> 
        <input type="button" id="addButton" value="Add">
      
        <br>
        <br>
        <div id="results">
           
        </div>

        <div class="addArtistModal">
            <div class="modalContent">
                <span class="close">
                    &times;
                </span>
                Insert a new artist
                <br>
                <br>
                <input type="text" id="addArtistNameField" name="addArtistNameField" placeholder="Name" required>
                <br>
                <br>
                <input type="button" id="addArtistButton" value="Add">
            </div>
        </div>

        <div class="updateArtistModal">
            <div class="modalContent">
                <span class="close">
                    &times;
                </span>
                Update an artist
                <br>
                <br>
                <input type="text" id="updateArtistNameField" name="updateArtistNameField" placeholder="Name" required>
                <br>
                <br>
                <input type="button" id="updateArtistButton" value="Update">
            </div>
        </div>


        <div class="deleteArtistModal">
            <div class="modalContent">
                <span class="close">
                    &times;
                </span>
                Are you sure you want to delete <span id="artistNameDeleteMessage"></span>?
                <br>
                <br>
                <input type="button" id="deleteArtistButtonNo" value="No">
                <input type="button" id="deleteArtistButtonYes" value="Yes">
            </div>
        </div>

        <div class="addAlbumModal">
            <div class="modalContent">
                <span class="close">
                    &times;
                </span>
                Insert a new album
                <br>
                <br>
                <input type="text" id="addAlbumTitleField" name="addAlbumTitleField" placeholder="Title" required>
                <br>
                <br>
                <label for="addArtistDropdown">Choose an artist:</label>
                <select name="addArtistDropdown" id="addArtistDropdown" required></select>
                <br>
                <br>
                <input type="button" id="addAlbumButton" value="Add">
            </div>
        </div>

        <div class="updateAlbumModal">
            <div class="modalContent">
                <span class="close">
                    &times;
                </span>
                Update an album
                <br>
                <br>
                <input type="text" id="updateAlbumTitleField" name="updateAlbumTitleField" placeholder="Title" required>
                <br>
                <br>
                <label for="updateArtistDropdown">Choose another artist:</label>
                <select name="updateArtistDropdown" id="updateArtistDropdown" required></select>
                <br>
                <br>
                <input type="button" id="updateAlbumButton" value="Update">
            </div>
        </div>


        <div class="deleteAlbumModal">
            <div class="modalContent">
                <span class="close">
                    &times;
                </span>
                Are you sure you want to delete <span id="albumTitleDeleteMessage"></span>?
                <br>
                <br>
                <input type="button" id="deleteAlbumButtonNo" value="No">
                <input type="button" id="deleteAlbumButtonYes" value="Yes">
            </div>
        </div>

        <div class="addTrackModal">
            <div class="modalContent">
                <span class="close">
                    &times;
                </span>
                Insert a new track
                <br>
                <br>
                <input type="text" id="addTrackNameField" name="addTrackNameField" placeholder="Name" required>
                <br>
                <br>
                <label for="addAlbumDropdown">Choose an album:</label>
                <select name="addAlbumDropdown" id="addAlbumDropdown" required></select>
                <br>
                <br>
                <label for="addMediaTypeDropdown">Choose a media type:</label>
                <select name="addMediaTypeDropdown" id="addMediaTypeDropdown" required></select>
                <br>
                <br>
                <label for="addGenreDropdown">Choose a genre:</label>
                <select name="addGenreDropdown" id="addGenreDropdown" required></select>
                <br>
                <br>
                <input type="text" id="addTrackComposerField" name="addTrackComposerField" placeholder="Composer" required>
                <br>
                <br>
                <input type="number" id="addTrackMillisecondsField" name="addTrackMillisecondsField" placeholder="Milliseconds" required>
                <br>
                <br>
                <input type="number" id="addTrackBytesField" name="addTrackBytesField" placeholder="Bytes" required>
                <br>
                <br>
                <input type="number" id="addTrackUnitPriceField" name="addTrackUnitPriceField" placeholder="Unit Price" required>
                <br>
                <br>
                <input type="button" id="addTrackButton" value="Add">
            </div>
        </div>

        <div class="updateTrackModal">
            <div class="modalContent">
                <span class="close">
                    &times;
                </span>
                Update a track
                <br>
                <br>
                <input type="text" id="updateTrackNameField" name="updateTrackNameField" placeholder="Name" required>
                <br>
                <br>
                <label for="updateAlbumDropdown">Choose another album:</label>
                <select name="updateAlbumDropdown" id="updateAlbumDropdown" required></select>
                <br>
                <br>
                <label for="updateMediaTypeDropdown">Choose another media type:</label>
                <select name="updateMediaTypeDropdown" id="updateMediaTypeDropdown" required></select>
                <br>
                <br>
                <label for="updateGenreDropdown">Choose another genre:</label>
                <select name="updateGenreDropdown" id="updateGenreDropdown" required></select>
                <br>
                <br>
                <input type="text" id="updateTrackComposerField" name="updateTrackComposerField" placeholder="Composer" required>
                <br>
                <br>
                <input type="number" id="updateTrackMillisecondsField" name="updateTrackMillisecondsField" placeholder="Milliseconds" required>
                <br>
                <br>
                <input type="number" id="updateTrackBytesField" name="updateTrackBytesField" placeholder="Bytes" required>
                <br>
                <br>
                <input type="number" id="updateTrackUnitPriceField" name="updateTrackUnitPriceField" placeholder="Unit Price" required>
                <br>
                <br>
                <input type="button" id="updateTrackButton" value="Update">
            </div>
        </div>
        
        <div class="deleteTrackModal">
            <div class="modalContent">
                <span class="close">
                    &times;
                </span>
                Are you sure you want to delete <span id="trackNameDeleteMessage"></span>?
                <br>
                <br>
                <input type="button" id="deleteTrackButtonNo" value="No">
                <input type="button" id="deleteTrackButtonYes" value="Yes">
            </div>
        </div>

        <form action="login.php" method="POST" id="logoutForm">
            <input type="hidden" name="logout" value="logout">
            <input type="submit" id="logoutButton" value="Logout">
        </form>  
        <script src="js/script.js"></script>
    </body>
     
<?php
    } else {
        header('Location: login.php');
    }
?>

