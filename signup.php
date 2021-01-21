<?php 
    require_once('head.htm');
?>
<body>
    <header>
        <h1> 
            Chinook - Signup
        </h1>
    </header>
    <main>
    
        <form id="signupForm" method="POST">
                <fieldset>
                    <legend>
                        Sign up
                    </legend>
                    <label for="signupFirstNameField">First Name*</label>
                    <input type="text" id="signupFirstNameField" name="signupFirstNameField" maxlength="40" required pattern="[A-Za-z]{1,20}">
                    <br>
                    <br>
                    <label for="signupLastNameField">Last Name*</label>
                    <input type="text" id="signupLastNameField" name="signupLastNameField" maxlength="20" required pattern="[A-Za-z]{1,20}">
                    <br>
                    <br>
                    <label for="signupAddressField">Address*</label>
                    <input type="text" id="signupAddressField" name="signupAddressField" maxlength="70" required>
                    <br>
                    <br>
                    <label for="signupPostalCodeField">Postal Code</label>
                    <input type="text" id="signupPostalCodeField" name="signupPostalCodeField" maxlength="10">
                    <br>
                    <br>
                    <label for="signupCompanyField">Company</label>
                    <input type="text" id="signupCompanyField" name="signupCompanyField" maxlength="80"> 
                    <br>
                    <br>
                    <label for="signupCityField">City*</label>
                    <input type="text" id="signupCityField" name="signupCityField" maxlength="40" required pattern="[A-Za-z]{1,20}">
                    <br>
                    <br>
                    <label for="signupStateField">State</label>
                    <input type="text" id="signupStateField" name="signupStateField" maxlength="40" pattern="[A-Za-z]{1,20}">
                    <br>
                    <br>
                    <label for="signupCountryField">Country*</label>
                    <input type="text" id="signupCountryField" name="signupCountryField" maxlength="40" required pattern="[A-Za-z]{1,20}">
                    <br>
                    <br>
                    <label for="signupPhoneField">Phone*</label>
                    <input type="text" id="signupPhoneField" name="signupPhoneField" maxlength="24" requied>
                    <br>
                    <br>
                    <label for="signupFaxField">Fax</label>
                    <input type="text" id="signupFaxField" name="signupFaxField" maxlength="24">
                    <br>
                    <br>
                    <label for="signupEmailField">Email*</label>
                    <input type="email" id="signupEmailField" name="signupEmailField" maxlength="60" required>
                    <br>
                    <br>
                    <label for="signupPasswordField">Password*</label>
                    <input type="password" id="signupPasswordField" name="signupPasswordField" maxlength="255" required>
                    <br>
                    <br>
                    <input type="submit" id="signupButton" value="Signup">   
                    <input type="button" id="signupBackButton" value="Back">  
                </fieldset>
        </form> 
    </main>
    <?php
    require_once('footer.htm');
    ?>
</body>
</html>

