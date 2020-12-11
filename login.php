<?php
    require_once('head.htm');  
    
    session_start();
    $userValidation = false;

    // If the user has clicked on 'Logout', the session is destroyed
    if (isset($_POST['logout'])) {
        // Invalidating the session cookie
        if(isset($_COOKIE[session_name()])) {
            setcookie(session_name(), '', time() - 86400, '/');
        }            
        // Closing the session
        session_destroy();
        
    // If the user is already logged in, he/she is redirected to the main page
    } else if (isset($_SESSION['userType'])) {
        switch ($_SESSION['userType']) {
            case 'admin': 
                header('Location: admin_page.php');
                break;
            case 'customer': 
                header('Location: customer_page.php');
                break;
            default: 
                echo '<b> Error 500: Internal server error...<b>';
        }
    // If the user has filled in the login fields, the authentication process is launched
    } else if (isset($_POST['email']) && isset($_POST['password'])) {
        require_once('src/admin.php');
        require_once('src/customer.php');

        $userValidation = true;
        $email = $_POST['email'];
        $password = $_POST['password'];

        $admin = new Admin();
        $customer = new Customer();
        $validAdmin = $admin -> validate($email, $password);
        $validCustomer = $customer -> validate($email, $password);
        
        if($validAdmin) {
            session_start();

            $_SESSION['userType'] = 'admin';
            header('Location: admin_page.php');
        } else if($validCustomer) {
            session_start();

            $_SESSION['userType'] = 'customer';
            $_SESSION['userId'] = $customer -> CustomerId;
            header('Location: customer_page.php');
        }
    }
?>
<body>
    <header>
        <h1>
            Chinook - Login
        </h1>
    </header>
    <main> 
        <?php
            if ($userValidation && (!$validAdmin || $validCustomer)) {
        ?>
        <div class="errorMessage">
                Invalid email or password.
        </div>
        <?php
            }
        ?>
    
        <form action="login.php" method="POST" id="loginForm">
            <fieldset>
            <legend>
                Login
            </legend>
            <label for="emailField">Email</label>
            <input type="email" name="email" id="emailField" required>
            <br>
            <br>
            <label for="passwordField">Password</label>
            <input type="password" name="password" id="passwordField" required>
            <br>
            <br>
            <input type="submit" id="loginButton" value="Login">
            </fieldset>
        </form>
        <div id="signup">
            Don't have an account? Please signup <a href="signup.php">here</a>
        </div> 
    </main>
    <?php
        require_once('footer.htm');  
    ?>
</body>
</html>
