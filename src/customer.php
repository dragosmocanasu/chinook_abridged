<?php
    require_once('src/db_connection.php'); 
    // Customer class
    class Customer extends DB {

        public int $CustomerId;
        public string $FirstName, $LastName, $Password, $Company, $Address, $City, $State, 
            $Country, $PostalCode, $Phone, $Fax, $Email;

        // Validate a user login
        function validate($email, $password) {
            // Get user data
            $query = <<<'SQL'
                SELECT CustomerId, FirstName, LastName, Password, Company, Address, City, State, 
                    Country, PostalCode, Phone, Fax
                FROM customer
                WHERE Email = ?
            SQL;

            $statement = $this -> pdo -> prepare($query);
            $statement -> execute([$email]);
            // If the customer does not exist, return false
            if (!$statement -> rowCount()) {
                return false; 
            }

            $row = $statement -> fetch(); 

            $this -> CustomerId = $row['CustomerId'] ?? 'null';
            $this -> FirstName = $row['FirstName'] ?? 'null';
            $this -> LastName = $row['LastName'] ?? 'null';
            $this -> Password = $row['Password'] ?? 'null';
            $this -> Company = $row['Company'] ?? 'null';
            $this -> Address = $row['Address'] ?? 'null';
            $this -> City = $row['City'] ?? 'null';
            $this -> State = $row['State'] ?? 'null';
            $this -> Country = $row['Country'] ?? 'null';
            $this -> PostalCode = $row['PostalCode'] ?? 'null';
            $this -> Phone = $row['Phone'] ?? 'null';
            $this -> Fax= $row['Fax'] ?? 'null';
            $this -> Email = $email;

            // Check the password
            return (password_verify($password, $row['Password']));
        }
        
        // Create a new customer
        function create($FirstName, $LastName, $Password, $Company, $Address, $City, $State, 
                $Country, $PostalCode, $Phone, $Fax, $Email) {
            try {
                // Check if the user exists already
                $query = <<<'SQL'
                    SELECT COUNT(*) AS total 
                    FROM customer
                    WHERE Email = ? 
                SQL;

                $statement = $this -> pdo -> prepare($query);
                $statement -> execute([$Email]);
                // If exists, return false
                if ($statement -> fetch()['total'] > 0) {
                    return false;
                }   

                // If not, insert the new customer
                $query = <<<'SQL'
                    INSERT INTO customer (FirstName, LastName, Password, Company, Address, City, State, 
                    Country, PostalCode, Phone, Fax, Email)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
                SQL;

                $statement = $this -> pdo -> prepare($query);
                $statement -> execute([$FirstName, $LastName, password_hash($Password, PASSWORD_DEFAULT), $Company, $Address, $City, $State, 
                    $Country, $PostalCode, $Phone, $Fax, $Email]);

            } catch (Exception $e) {
                return false;
            }

            $this -> disconnect();
            return true;
        }
        
        // Updates a customer
        function update($FirstName, $LastName, $Company, $Address, $City, $State, 
        $Country, $PostalCode, $Phone, $Fax, $Email, $NewPassword) {
            try {
                $passwordChange = (trim($NewPassword) !== '');

                $query = <<<'SQL'
                    UPDATE customer
                    SET FirstName = ?, LastName = ?, Company = ?, Address = ?, City = ?,
                        State = ?, Country = ?, PostalCode = ?, Phone = ?, Fax = ?
                SQL;

                if ($passwordChange) {
                    $NewPassword = password_hash($NewPassword, PASSWORD_DEFAULT);
                    $query .= ', Password = ?';
                }
                $query .= ' WHERE Email = ?;';

                $statement = $this -> pdo -> prepare($query);
                if($passwordChange) {
                    $statement -> execute ([$FirstName, $LastName, $Company, $Address, $City, 
                        $State, $Country, $PostalCode, $Phone, $Fax, $NewPassword, $Email]);
                } else {
                    $statement -> execute ([$FirstName, $LastName, $Company, $Address, $City, 
                    $State, $Country, $PostalCode, $Phone, $Fax, $Email]);
                }
        
                // If no rows were affected, the customer does not exist OR the data is the same
                if (!$statement -> rowCount()) {
                    return false;
                }
            } catch (Exception $e) {
                return false;
            }
            return true;
        }
        
    }
?>