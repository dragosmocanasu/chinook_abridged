<?php
    require_once('src/db_connection.php');
    // Admin class
    class Admin extends DB {
        public string $Email = 'admin@kea.dk';

        // Validate the admin login
        function validate($email, $password) {
            // Get user data
            $query = <<<'SQL'
                SELECT Password
                FROM admin
            SQL;

            $statement = $this -> pdo -> prepare($query);
            $statement -> execute();
            // If the admin does not exist, return false
            if (!$statement -> rowCount()) {
                return false; 
            }

            $row = $statement -> fetch(); 

            // Check the password
            return ((password_verify($password, $row['Password']) && (strcasecmp($email, $this -> Email) == 0)));
        }    
    }
?>