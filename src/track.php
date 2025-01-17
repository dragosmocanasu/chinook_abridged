<?php
    // Track class

    require_once('db_connection.php'); 
    class Track extends DB {
        // Retrieves the track(s) whose name OR composer(s) includes a certain text
        function search($text) {
            $query = <<<'SQL'
                SELECT *
                FROM track
                WHERE Name LIKE ?
            SQL;

            $statement = $this -> pdo -> prepare($query);
            $statement -> execute(['%' . $text . '%']);
            $results = $statement -> fetchAll();

            $this -> disconnect();

            return $this -> sanitize($results);
        }   

          // Retrieves all tracks
          function fetchAll() {
            $query = <<<'SQL'
                SELECT *
                FROM track
            SQL;

            $statement = $this -> pdo -> prepare($query);
            $statement -> execute([]);
            $results = $statement -> fetchAll();

            $this -> disconnect();

            return $this -> sanitize($results);
        }
        
        // Retrieves the track by id
        function get($id) {
            $query = <<<'SQL'
                SELECT *
                FROM track
                WHERE TrackId = ?
            SQL;

            $statement = $this -> pdo -> prepare($query);
            $statement -> execute([$id]);
            $results = $statement -> fetch();

            $this -> disconnect();
        
            return $this -> sanitize($results);
        }
        
        // Creates a new track
        function add($name, $albumId, $mediaTypeId, $genreId, $composer, $milliseconds, 
            $bytes, $unitPrice) {
            try {
                $this -> pdo -> beginTransaction();

                // Check if the track exists already
                $query = <<<'SQL'
                    SELECT COUNT(*) AS total 
                    FROM track
                    WHERE Name = ? AND AlbumId = ?
                SQL;

                $statement = $this -> pdo -> prepare($query);
                $statement -> execute([$name, $albumId]);
                // If exists, rollback and disconnect 
                if ($statement -> fetch()['total'] > 0) {
                    $this -> pdo -> rollBack();
                    $this -> disconnect();
                    return 0;
                }

                // If not, insert the new track
                $query = <<<'SQL'
                    INSERT INTO track (Name, AlbumId, MediaTypeId, GenreId, Composer, Milliseconds, Bytes, UnitPrice)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?);
                SQL;

                $statement = $this -> pdo -> prepare($query);
                $statement -> execute([$name, $albumId, $mediaTypeId, $genreId, $composer, $milliseconds, 
                    $bytes, $unitPrice]);
                $newId = $this -> pdo -> lastInsertId();
                $this -> pdo -> commit();
            } catch (Exception $e) {
                $newId = -1;
                $this -> pdo -> rollBack();
            }

            $this -> disconnect();
            
            return $this -> sanitize($newId);
        }

        // Updates a track
        function update($trackId, $name, $albumId, $mediaTypeId, $genreId, $composer, $milliseconds, 
        $bytes, $unitPrice) {
            try {
                $this -> pdo -> beginTransaction();

                $query = <<<'SQL'
                    UPDATE track
                    SET Name = ?, AlbumId = ?, MediaTypeId = ?, GenreId = ?, Composer = ?, Milliseconds = ?, Bytes = ?, UnitPrice = ?
                    WHERE TrackId = ?
                SQL;

                $statement = $this -> pdo -> prepare($query);
                $statement -> execute([$name, $albumId, $mediaTypeId, $genreId, $composer, $milliseconds, 
                $bytes, $unitPrice, $trackId]);
                $this -> pdo -> commit();
                // If no rows were affected, the track does not exist OR the data is the same
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

        // Deletes a track
        function delete($id) {
            try {
                $this -> pdo -> beginTransaction();

                $query = <<<'SQL'
                    DELETE 
                    FROM track
                    WHERE TrackId = ?
                SQL;

                $statement = $this -> pdo -> prepare($query);
                $statement -> execute([$id]);
                $this -> pdo -> commit();
                // If no rows were affected, the track does not exist OR the data is the same
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