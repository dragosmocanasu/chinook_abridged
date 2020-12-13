<?php
    session_start();
    require_once('head.htm');
    require_once('footer.htm');
    
    if (isset($_SESSION['userType']) && $_SESSION['userType'] == 'customer') {
        //echo $_SESSION['userId'];
?>
    <body>
        <header>
            <h1>
                Homepage
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
        <div id="customerHomepageResults">
           
        </div>

        <div class="updateUserModal">
            <div class="modalContent">
                <span class="close">
                    &times;
                </span>
                Update your user information
                <br>
                <br>
                <label for="updateUserFirstNameField">First Name*</label>
                <input type="text" id="updateUserFirstNameField" name="updateUserFirstNameField" maxlength="40" required>
                <br>
                <br>
                <label for="updateUserLastNameField">Last Name*</label>
                <input type="text" id="updateUserLastNameField" name="updateUserLastNameField" maxlength="20" required>
                <br>
                <br>
                <label for="updateUserAddressField">Address*</label>
                <input type="text" id="updateUserAddressField" name="updateUserAddressField" maxlength="70" required>
                <br>
                <br>
                <label for="updateUserPostalCodeField">Postal Code</label>
                <input type="text" id="updateUserPostalCodeField" name="updateUserPostalCodeField" maxlength="10">
                <br>
                <br>
                <label for="updateUserCompanyField">Company</label>
                <input type="text" id="updateUserCompanyField" name="updateUserCompanyField" maxlength="80">
                <br>
                <br>
                <label for="updateUserCityField">City*</label>
                <input type="text" id="updateUserCityField" name="updateUserCityField" maxlength="40" required>
                <br>
                <br>
                <label for="updateUserStateField">State</label>
                <input type="text" id="updateUserStateField" name="updateUserStateField" maxlength="40">
                <br>
                <br>
                <label for="updateUserCountryField">Country*</label>
                <input type="text" id="updateUserCountryField" name="updateUserCountryField" maxlength="40" required>
                <br>
                <br>
                <label for="updateUserPhoneField">Phone*</label>
                <input type="text" id="updateUserPhoneField" name="updateUserPhoneField" maxlength="24" required>
                <br>
                <br>
                <label for="updateUserFaxField">Fax</label>
                <input type="text" id="updateUserFaxField" name="updateUserFaxField" maxlength="24">
                <br>
                <br>
                <label for="updateUserEmailField">Email</label>
                <input type="email" id="updateUserEmailField" name="updateUserEmailField" disabled="disabled">
                <br>
                <br>
                <label for="updateUserPasswordField">New password*</label>
                <input type="password" id="updateUserPasswordField" name="updateUserPasswordField" maxlength="255" required>
                <br>
                <br>
                <div id="mandatoryFieldsUpdate">
                        * required
                </div>
                <br>
                <input type="button" id="updateUserButton" value="Update">
            </div>
        </div>

        <div class="userBasketModal">
            <div class="modalContent">
                <span class="close">
                    &times;
                </span>
                Your basket
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


        <img class="smallButton basketPage" id="<?=$_SESSION['userId']?>" src="img/basket.png">

        <img class="smallButton editUser" id="<?=$_SESSION['userId']?>" src="img/user.png">

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
