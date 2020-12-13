<?php
    // Invoice class

    require_once('db_connection.php'); 
    class Invoice extends DB {
        // Retrieves the invoice(s) by customer Id
        function search($customerId) {
            $query = <<<'SQL'
                SELECT *
                FROM invoice
                WHERE CustomerId = ?
                ORDER BY InvoiceDate;
            SQL;

            $statement = $this -> pdo -> prepare($query);
            $statement -> execute([$customerId]);
            $results = $statement -> fetchAll();

            $this -> disconnect();

            return $results;
        }   

          // Retrieves all invoices
          function fetchAll() {
            $query = <<<'SQL'
                SELECT *
                FROM invoice
                ORDER BY CustomerId, InvoiceDate;
            SQL;

            $statement = $this -> pdo -> prepare($query);
            $statement -> execute([]);
            $results = $statement -> fetchAll();

            $this -> disconnect();

            return $results;
        }
        
        // Retrieves the invoice by id
        function get($id) {
            $query = <<<'SQL'
                SELECT *
                FROM invoice
                WHERE InvoiceId = ?
            SQL;

            $statement = $this -> pdo -> prepare($query);
            $statement -> execute([$id]);
            $results = $statement -> fetch();

            $this -> disconnect();
        
            return $results;
        }
        
        // Creates a new invoice
        function add($customerId, $invoiceDate, $billingAddress, $billingCity, $billingState, $billingCountry, 
            $billingPostalCode, $total) {
            try {
                $this -> pdo -> beginTransaction();

                // Check if the invoice exists already
                $query = <<<'SQL'
                    SELECT COUNT(*) AS total 
                    FROM invoice
                    WHERE CustomerId = ? AND InvoiceDate = ? AND BillingAddress = ? AND BillingCity = ? AND BillingState = ? 
                        AND BillingCountry = ? and BillingPostalCode = ? AND Total = ? 
                SQL;

                $statement = $this -> pdo -> prepare($query);
                $statement -> execute([$customerId, $invoiceDate, $billingAddress, $billingCity, $billingState, $billingCountry, 
                    $billingPostalCode, $total]);
                // If exists, rollback and disconnect 
                if ($statement -> fetch()['total'] > 0) {
                    $this -> pdo -> rollBack();
                    $this -> disconnect();
                    return 0;
                }

                // If not, insert the new invoice
                $query = <<<'SQL'
                    INSERT INTO invoice (CustomerId, InvoiceDate, BillingAddress, BillingCity, BillingState, BillingCountry, BillingPostalCode, Total)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?);
                SQL;

                $statement = $this -> pdo -> prepare($query);
                $statement -> execute([$customerId, $invoiceDate, $billingAddress, $billingCity, $billingState, $billingCountry, 
                $billingPostalCode, $total]);
                $newId = $this -> pdo -> lastInsertId();
                $this -> pdo -> commit();
            } catch (Exception $e) {
                $newId = -1;
                $this -> pdo -> rollBack();
            }

            $this -> disconnect();
            
            return $newId;
        }

        // Updates an invoice
        function update($invoiceId, $customerId, $invoiceDate, $billingAddress, $billingCity, $billingState, $billingCountry, 
        $billingPostalCode, $total) {
            try {
                $this -> pdo -> beginTransaction();

                $query = <<<'SQL'
                    UPDATE invoice
                    SET CustomerId = ?, InvoiceDate = ?, BillingAddress = ?, BillingCity = ?, BillingState = ?, BillingCountry = ?, BillingPostalCode = ?, Total = ?
                    WHERE InvoiceId = ?
                SQL;

                $statement = $this -> pdo -> prepare($query);
                $statement -> execute([$customerId, $invoiceDate, $billingAddress, $billingCity, $billingState, $billingCountry, 
                $billingPostalCode, $total, $invoiceId]);
                $this -> pdo -> commit();
                // If no rows were affected, the invoice does not exist OR the data is the same
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

        // Deletes an invoice
        function delete($id) {
            try {
                $this -> pdo -> beginTransaction();

                $query = <<<'SQL'
                    DELETE 
                    FROM invoice
                    WHERE InvoiceId = ?
                SQL;

                $statement = $this -> pdo -> prepare($query);
                $statement -> execute([$id]);
                $this -> pdo -> commit();
                // If no rows were affected, the invoice does not exist OR the data is the same
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