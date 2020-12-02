$(document).ready(function() {
    // Cancel the user's signup process
    $('input#signupCancelButton').on('click', function() {
        window.location.replace('login.php');
    });
});