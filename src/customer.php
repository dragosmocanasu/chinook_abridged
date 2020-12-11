<?php
    require_once('db_connection.php'); 
    // Customer class
    class Customer extends DB {

        public int $CustomerId;

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

            $this -> CustomerId = $row['CustomerId'];

            // Check the password
            return (password_verify($password, $row['Password']));
        }

        // Retrieves the user whose email is the provided text
        function search($text) {
            $query = <<<'SQL'
                SELECT *
                FROM customer
                WHERE Email = ?
                ORDER BY FirstName, LastName;
            SQL;

            $statement = $this -> pdo -> prepare($query);
            $statement -> execute([$text]);
            $results = $statement -> fetch();
            $this -> disconnect();
            
            return $results;
        }   

        // Retrieves all users
        function fetchAll() {
            $query = <<<'SQL'
                SELECT *
                FROM customer
                ORDER BY FirstName, LastName;
            SQL;

            $statement = $this -> pdo -> prepare($query);
            $statement -> execute([]);
            $results = $statement -> fetchAll();

            $this -> disconnect();
            
            return $results;
        }   


        // Retrieves the user by id
        function get($id) {
            $query = <<<'SQL'
                SELECT *
                FROM customer
                WHERE CustomerId = ?
            SQL;

            $statement = $this -> pdo -> prepare($query);
            $statement -> execute([$id]);
            $results = $statement -> fetch();

            $this -> disconnect();
        
            return $results;
        }
        
        // Create a new user
        function create($firstName, $lastName, $address, $postalCode, $company,  $city, $state, 
        $country,  $phone, $fax, $email, $password) {
            try {
                $this -> pdo -> beginTransaction();
                
                // Check if a user already exists with this email
                $query = <<<'SQL'
                    SELECT COUNT(*) AS total 
                    FROM customer
                    WHERE Email = ? 
                SQL;

                $statement = $this -> pdo -> prepare($query);
                $statement -> execute([$email]);
                // If exists, return false
                if ($statement -> fetch()['total'] > 0) {
                    $this -> pdo -> rollBack();
                    $this -> disconnect();
                    return 0;
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
                $newId = $this -> pdo -> lastInsertId();
                $this -> pdo -> commit();
            } catch (Exception $e) {
                echo $e;
                $newId = -1;
                $this -> pdo -> rollBack();
            }

            $this -> disconnect();
            return $newId;
        }
        
        // Updates a user
        function update($id, $firstName, $lastName, $address, $postalCode, $company,  $city, $state, 
            $country,  $phone, $fax, $email, $password) {
            try {
                $this -> pdo -> beginTransaction();

                $passwordChange = (trim($password) !== '');

                $query = <<<'SQL'
                    UPDATE customer
                    SET FirstName = ?, LastName = ?, Company = ?, Address = ?, City = ?,
                        State = ?, Country = ?, PostalCode = ?, Phone = ?, Fax = ?, Email = ?
                SQL;

                if ($passwordChange) {
                    $password = password_hash($password, PASSWORD_DEFAULT);
                    $query .= ', Password = ?';
                }

                $query .= ' WHERE CustomerId = ?;';

                $statement = $this -> pdo -> prepare($query);

                if($passwordChange) {
                    $statement -> execute ([$firstName, $lastName, $company, $address, $city, 
                        $state, $country, $postalCode, $phone, $fax, $email, $password, $id]);
                } else {
                    $statement -> execute ([$firstName, $lastName, $company, $address, $city, 
                    $state, $country, $postalCode, $phone, $fax, $email, $id]);
                }

                $this -> pdo -> commit();
                // If no rows were affected, the user does not exist OR the data is the same
                if (!$statement -> rowCount()) {
                    $this -> disconnect();
                    return 0;
                }
                $response = true;
            } catch (Exception $e) {
                $response = -1;
                $this -> pdo -> rollBack();
            }
            $this -> disconnect();

            return $response;
        }

        // Deletes a user
        function delete($id) {
            try {
                $this -> pdo -> beginTransaction();

                $query = <<<'SQL'
                    DELETE 
                    FROM customer
                    WHERE CustomerId = ?
                SQL;

                $statement = $this -> pdo -> prepare($query);
                $statement -> execute([$id]);
                $this -> pdo -> commit();
                // If no rows were affected, the artist does not exist
                if (!$statement -> rowCount()) {
                    $this -> disconnect();
                    return 0;
                }
                $response = true;
            } catch (Exception $e) {
                $response = -1;
                $this -> pdo -> rollBack();
            }
            $this -> disconnect();

            return $response;
        }
        
    }
?>