<?php
    // Album class

    require_once('db_connection.php'); 
    class Album extends DB {
        // Retrieves the album whose name includes a certain text
        function search($text) {
            $query = <<<'SQL'
                SELECT AlbumId, Title, ArtistId
                FROM album
                WHERE Title LIKE ?;
            SQL;

            $statement = $this -> pdo -> prepare($query);
            $statement -> execute(['%' . $text . '%']);
            $results = $statement -> fetchAll();

            $this -> disconnect();
            
            return $this -> sanitize($results);
        }   

        // Retrieves all albums
        function fetchAll() {
            $query = <<<'SQL'
                SELECT *
                FROM album
            SQL;

            $statement = $this -> pdo -> prepare($query);
            $statement -> execute([]);
            $results = $statement -> fetchAll();

            $this -> disconnect();
            
            return $this -> sanitize($results);
        }   
        
        // Retrieves the album by id
        function get($id) {
            $query = <<<'SQL'
                SELECT AlbumId, Title, ArtistId
                FROM album
                WHERE AlbumId = ?
            SQL;

            $statement = $this -> pdo -> prepare($query);
            $statement -> execute([$id]);
            $results = $statement -> fetch();

            $this -> disconnect();
        
            return $this -> sanitize($results);
        }
        
        // Creates a new album
        function add($title, $artistId) {
            try {
                $this -> pdo -> beginTransaction();

                // Check if the album exists already
                $query = <<<'SQL'
                    SELECT COUNT(*) AS total 
                    FROM album
                    WHERE Title = ? AND ArtistId = ?
                SQL;

                $statement = $this -> pdo -> prepare($query);
                $statement -> execute([$title, $artistId]);
                // If exists, rollback and disconnect 
                if ($statement -> fetch()['total'] > 0) {
                    $this -> pdo -> rollBack();
                    $this -> disconnect();
                    return 0;
                }   

                // If not, insert the new album
                $query = <<<'SQL'
                    INSERT INTO album (Title, ArtistId)
                    VALUES (?, ?);
                SQL;

                $statement = $this -> pdo -> prepare($query);
                $statement -> execute([$title, $artistId]);
                $newId = $this -> pdo -> lastInsertId();
                $this -> pdo -> commit();
            } catch (Exception $e) {
                $newId = -1;
                $this -> pdo -> rollBack();
            }

            $this -> disconnect();
            
            return $this -> sanitize($newId);
        }

        // Updates an album
        function update($id, $title, $artistId) {
            try {
                $this -> pdo -> beginTransaction();
                
                $query = <<<'SQL'
                    UPDATE album
                    SET Title = ?, ArtistId = ?
                    WHERE AlbumId = ?
                SQL;

                $statement = $this -> pdo -> prepare($query);
                $statement -> execute([$title, $artistId, $id]);
                $this -> pdo -> commit();
                // If no rows were affected, the album does not exist OR the data is the same
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

            return $this -> sanitize($response);
        }

        // Deletes an album
        function delete($id) {
            try {
                $this -> pdo -> beginTransaction();

                $query = <<<'SQL'
                    DELETE 
                    FROM album
                    WHERE AlbumId = ?
                SQL;

                $statement = $this -> pdo -> prepare($query);
                $statement -> execute([$id]);
                $this -> pdo -> commit();
                // If no rows were affected, the album does not exist OR the data is the same
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

            return $this -> sanitize($response);
        }
    }
?>