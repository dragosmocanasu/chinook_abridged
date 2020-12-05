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
                <input type="text" id="artistNameField" name="artistNameField" placeholder="Name" required>
                <br>
                <br>
                <input type="button" id="addArtistButton" value="Add">
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

