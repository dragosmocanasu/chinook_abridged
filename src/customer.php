<?php
    require_once('db_connection.php'); 
    // Customer class
    class Customer extends DB {

        public int $CustomerId;
        public string $firstName, $lastName, $password, $company, $address, $city, $state, 
            $country, $postalCode, $phone, $fax, $email;

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
        function create($firstName, $lastName, $password, $company, $address, $city, $state, 
                $country, $postalCode, $phone, $fax, $email) {
            try {
                // Check if the user exists already
                $query = <<<'SQL'
                    SELECT COUNT(*) AS total 
                    FROM customer
                    WHERE Email = ? 
                SQL;

                $statement = $this -> pdo -> prepare($query);
                $statement -> execute([$email]);
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
                $statement -> execute([$firstName, $lastName, password_hash($password, PASSWORD_DEFAULT), $company, $address, $city, $state, 
                    $country, $postalCode, $phone, $fax, $email]);

            } catch (Exception $e) {
                return false;
            }

            $this -> disconnect();
            return true;
        }
        
        // Updates a customer
        function update($firstName, $lastName, $company, $address, $city, $state, 
        $country, $postalCode, $phone, $fax, $email, $newPassword) {
            try {
                $passwordChange = (trim($newPassword) !== '');

                $query = <<<'SQL'
                    UPDATE customer
                    SET FirstName = ?, LastName = ?, Company = ?, Address = ?, City = ?,
                        State = ?, Country = ?, PostalCode = ?, Phone = ?, Fax = ?
                SQL;

                if ($passwordChange) {
                    $NewPassword = password_hash($newPassword, PASSWORD_DEFAULT);
                    $query .= ', Password = ?';
                }
                $query .= ' WHERE Email = ?;';

                $statement = $this -> pdo -> prepare($query);
                if($passwordChange) {
                    $statement -> execute ([$firstName, $lastName, $company, $address, $city, 
                        $state, $country, $postalCode, $phone, $fax, $newPassword, $email]);
                } else {
                    $statement -> execute ([$firstName, $lastName, $company, $address, $city, 
                    $state, $country, $postalCode, $phone, $fax, $email]);
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