<?php
    // Artist class

    require_once('src/db_connection.php'); 
    class Artist extends DB {
        // Retrieves the artist whose name includes a certain text
        function search($searchText) {
            $query = <<<'SQL'
                SELECT ArtistId, Name
                FROM artist
                WHERE Name LIKE ?
                ORDER BY Name;
            SQL;

            $statement = $this -> pdo -> prepare($query);
            $statement -> execute(['%' . $searchText . '%']);
            $results = $statement -> fetchAll();

            $this -> disconnect();
            
            return $results;
        }   
        
        // Retrieves the artist by id
        function get($id) {
            $query = <<<'SQL'
                SELECT ArtistId, Name
                FROM artist
                WHERE ArtistId = ?
            SQL;

            $statement = $this -> pdo -> prepare($query);
            $statement -> execute([$id]);
            $results = $statement -> fetch();

            $this -> disconnect();
        
            return $results;
        }
        
        // Creates a new artist 
        function add($info) {
            try {
                $this -> pdo -> beginTransaction();
                
                // Checks if the artist exists already
                $query = <<<'SQL'
                    SELECT COUNT(*) AS total 
                    FROM artist 
                    WHERE Name = ?
                SQL;

                $statement = $this -> pdo -> prepare($query);
                $statement -> execute([$info['Name']]);
                // If exists, rollback and disconnect
                if ($statement -> fetch()['total'] > 0) {
                    $this -> pdo -> rollBack();
                    $this -> disconnect();    
                    return 0;
                }

                // If not, insert the new artist
                $query = <<<'SQL'
                    INSERT INTO artist (Name)
                    VALUES (?);
                SQL;

                $statement = $this -> pdo -> prepare($query);
                $statement -> execute([$info['Name']]);
                $newId = $this -> pdo -> lastInsertId();
                $this -> pdo -> commit();
            } catch (Exception $e) {
                $newId = -1;
                $this -> pdo -> rollBack();
            }

            $this -> disconnect();
            
            return $newId;
        }

        // Updates an artist
        function update($info) {
            try {
                $this -> pdo -> beginTransaction();

                $query = <<<'SQL'
                    UPDATE artist
                    SET Name = ?
                    WHERE ArtistId = ?
                SQL;

                $statement = $this -> pdo -> prepare($query);
                $statement -> execute([$info['Name'], $info['ArtistId']]);
                $this -> pdo -> commit();
                // If no rows were affected, the artist does not exist OR the data is the same
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

        // Deletes an artist
        function delete($id) {
            try {
                $this -> pdo -> beginTransaction();

                $query = <<<'SQL'
                    DELETE 
                    FROM artist
                    WHERE ArtistId = ?
                SQL;

                $statement = $this -> pdo -> prepare($query);
                $statement -> execute([$id]);
                $this -> pdo -> commit();
                // If no rows were affected, the artist does not exist OR the data is the same
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