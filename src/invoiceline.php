<?php
    // InvoiceLine class

    require_once('db_connection.php'); 
    class InvoiceLine extends DB {
        // Retrieves the invoiceline(s) by invoice Id
        function search($invoiceId) {
            $query = <<<'SQL'
                SELECT *
                FROM invoiceline
                WHERE InvoiceId = ?
            SQL;

            $statement = $this -> pdo -> prepare($query);
            $statement -> execute([$invoiceId]);
            $results = $statement -> fetchAll();

            $this -> disconnect();

            return $results;
        }   

          // Retrieves all invoicelines
          function fetchAll() {
            $query = <<<'SQL'
                SELECT *
                FROM invoiceline
                ORDER BY InvoiceId;
            SQL;

            $statement = $this -> pdo -> prepare($query);
            $statement -> execute([]);
            $results = $statement -> fetchAll();

            $this -> disconnect();

            return $results;
        }
        
        // Retrieves the invoiceline by id
        function get($id) {
            $query = <<<'SQL'
                SELECT *
                FROM invoiceline
                WHERE InvoiceLineId = ?
            SQL;

            $statement = $this -> pdo -> prepare($query);
            $statement -> execute([$id]);
            $results = $statement -> fetch();

            $this -> disconnect();
        
            return $results;
        }
        
        // Creates a new invoiceline
        function add($invoiceId, $trackId, $unitPrice, $quantity) {
            try {
                $this -> pdo -> beginTransaction();

                // Check if the invoiceline exists already
                $query = <<<'SQL'
                    SELECT COUNT(*) AS total 
                    FROM invoiceline
                    WHERE InvoiceId = ? AND TrackId  = ? AND UnitPrice = ? AND Quantity  = ?
                SQL;

                $statement = $this -> pdo -> prepare($query);
                $statement -> execute([$invoiceId, $trackId, $unitPrice, $quantity]);
                // If exists, rollback and disconnect 
                if ($statement -> fetch()['total'] > 0) {
                    $this -> pdo -> rollBack();
                    $this -> disconnect();
                    return 0;
                }

                // If not, insert the new invoiceline
                $query = <<<'SQL'
                    INSERT INTO invoiceline (InvoiceId, TrackId, UnitPrice, Quantity)
                    VALUES (?, ?, ?, ?);
                SQL;

                $statement = $this -> pdo -> prepare($query);
                $statement -> execute([$invoiceId, $trackId, $unitPrice, $quantity]);
                $newId = $this -> pdo -> lastInsertId();
                $this -> pdo -> commit();
            } catch (Exception $e) {
                $newId = -1;
                $this -> pdo -> rollBack();
            }

            $this -> disconnect();
            
            return $newId;
        }

        // Updates an invoiceline
        function update($invoiceLineId, $invoiceId, $trackId, $unitPrice, $quantity) {
            try {
                $this -> pdo -> beginTransaction();

                $query = <<<'SQL'
                    UPDATE invoiceline
                    SET InvoiceId = ?, TrackId = ?, UnitPrice = ?, Quantity = ? 
                    WHERE InvoiceLineId = ?
                SQL;

                $statement = $this -> pdo -> prepare($query);
                $statement -> execute([$invoiceId, $trackId, $unitPrice, $quantity, $invoiceLineId]);
                $this -> pdo -> commit();
                // If no rows were affected, the invoiceline does not exist OR the data is the same
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

        // Deletes an invoiceline
        function delete($id) {
            try {
                $this -> pdo -> beginTransaction();

                $query = <<<'SQL'
                    DELETE 
                    FROM invoiceline
                    WHERE InvoiceLineId = ?
                SQL;

                $statement = $this -> pdo -> prepare($query);
                $statement -> execute([$id]);
                $this -> pdo -> commit();
                // If no rows were affected, the invoiceline does not exist OR the data is the same
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