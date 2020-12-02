<?php 
    require_once('head.htm');
    $showForm = true;

    // New user
    if (isset($_POST['firstName']) && isset($_POST['lastName']) && isset($_POST['password'])
        && isset($_POST['address']) && isset($_POST['city']) && isset($_POST['country']) 
        && isset($_POST['phone']) && isset($_POST['email'])) {
        $showForm = false;

        require_once('src/customer.php');
        
        $firstName = $_POST['firstName'];
        $lastName = $_POST['lastName'];
        $password = $_POST['password'];
        $company = $_POST['company'] ?? '';
        $address = $_POST['address'];
        $city = $_POST['city'];
        $state = $_POST['state'] ?? '';
        $country = $_POST['country'];
        $postalCode = $_POST['postalCode'] ?? '';
        $phone = $_POST['phone'];
        $fax = $_POST['fax'] ?? '';
        $email = $_POST['email'];

        $customer = new Customer();
        $customerCreated = $customer -> create($firstName, $lastName, $password, $company, $address, 
            $city, $state, $country, $postalCode, $phone, $fax, $email);
    }
?>
<body>
    <header>
        <h1> 
            Chinook - Signup
        </h1>
    </header>
    <main>
        <?php 
            if ($showForm) {
        ?>
        <form action="signup.php" method="POST" id="signupForm">
                <fieldset>
                    <legend>
                        Sign up
                    </legend>
                    <label for="firstNameField">First Name*</label>
                    <input type="text" id="firstNameField" name="firstName" required>
                    <br>
                    <br>
                    <label for="lastNameField">Last Name*</label>
                    <input type="text" id="lastNameField" name="lastName" required>
                    <br>
                    <br>
                    <label for="addressField">Address*</label>
                    <input type="text" id="addressField" name="address" required>
                    <br>
                    <br>
                    <label for="postalCodeField">Postal Code</label>
                    <input type="number" id="postalCodeField" name="postalCode">
                    <br>
                    <br>
                    <label for="companyField">Company</label>
                    <input type="text" id="companyField" name="company">
                    <br>
                    <br>
                    <label for="cityField">City*</label>
                    <input type="text" id="cityField" name="city" required>
                    <br>
                    <br>
                    <label for="stateField">State</label>
                    <input type="text" id="stateField" name="state">
                    <br>
                    <br>
                    <label for="countryField">Country*</label>
                    <input type="text" id="countryField" name="country" required>
                    <br>
                    <br>
                    <label for="phoneField">Phone*</label>
                    <input type="number" id="phoneField" name="phone" requied>
                    <br>
                    <br>
                    <label for="faxField">Fax</label>
                    <input type="number" id="faxField" name="fax">
                    <br>
                    <br>
                    <label for="emailField">Email*</label>
                    <input type="email" id="emailField" name="email" required>
                    <br>
                    <br>
                    <label for="passwordField">Password*</label>
                    <input type="password" id="passwordField" name="password" required>
                    <br>
                    <br>
                    <div id="mandatoryFields">
                        All fields marked with * are mandatory.
                    </div>
                    <br>
                    <input type="submit" id="signupButton" value="Signup">   
                    <input type="button" id="signupCancelButton" value="Cancel">  
                    
                </fieldset>
        </form> 
        <?php 
            } else {
                if ($customerCreated) {
        ?>
        <div>
            The user was succesfully created. 
            <br>
            <a href="login.php">Back</a>
        </div>
        <?php
                } else {
        ?>  
        <div>
            A user registered with this email address already exists. 
            <a href="signup.php">Back</a>
        </div>
        <?php
                }
            }
        ?>
    </main>
    <?php
    require_once('footer.htm');
    ?>
</body>
<script src="js/signup.js"></script>
</html>

