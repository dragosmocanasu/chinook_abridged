<?php
    session_start();
    require_once('head.htm');
    require_once('footer.htm');
    
    if (isset($_SESSION['userType']) && $_SESSION['userType'] == 'customer') {
        
        echo '<h1>Customer page</h1>';
?>
    <form action="login.php" method="POST" id="logoutForm">
        <input type="hidden" name="logout" value="logout">
        <input type="submit" id="logoutButton" value="Logout">
    </form>  
<?php
    } else {
        header('Location: login.php');
    }
?>

