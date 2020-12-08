<?php
    session_start();
    require_once('head.htm');
    require_once('footer.htm');
    
    if (isset($_SESSION['userType']) && $_SESSION['userType'] == 'customer') {
?>
    <body>
        <header>
            <h1>
                Customer Page
            </h1>
        </header>
        <div class="customerRadioGroup">
            <label>
                <input type="radio" name="customerRadioGroup" class="radio" id="artistsRadio" value="artists"> Artists
            </label>
            <br>
            <label>
                <input type="radio" name="customerRadioGroup" class="radio" id="albumsRadio" value="albums"> Albums
            </label>
            <br>
            <label> 
            <input type="radio" name="customerRadioGroup" class="radio" id="tracksRadio" value="tracks"> Tracks
            </label>
            <br>
        </div>
        <br>

        
        <input type="text" id="searchField" name="searchField" placeholder="Type a name..." required>
        <input type="button" id="searchButton" value="Search">
        <input type="button" id="fetchAllButton" value="Fetch all"> 
      
        <br>
        <br>
        <div id="customerResults">
           
        </div>

        <div class="updateUserModal">
            <div class="modalContent">
                <span class="close">
                    &times;
                </span>
                Update your user information
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
                <input type="button" id="updateUserButton" value="Update">
            </div>
        </div>

        <!--<img id='" + albumId + "' artistId='" + artistId + "' class='smallButton addToCartAlbum' src='img/add-to-cart.png'>", 'class': 'action'}))-->
        <img class='smallButton editUser' src='img/user.png'>

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

