<?php
    $url = $_SERVER['RQUEST_URI'];
    /*
    * If url has entity or id
    * redirect to admin or customer api
    * If not
    * Redirect to login
    */
    header('Location: login.php');
?>