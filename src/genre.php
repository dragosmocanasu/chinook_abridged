<?php
    // Genre class

    require_once('db_connection.php'); 
    class Genre extends DB {
        // Retrieves the genres whose name includes a certain text
        function search($text) {
            $query = <<<'SQL'
                SELECT GenreId, Name
                FROM genre
                WHERE Name LIKE ?
            SQL;

            $statement = $this -> pdo -> prepare($query);
            $statement -> execute(['%' . $text . '%']);
            $results = $statement -> fetchAll();

            $this -> disconnect();
            
            return $this -> sanitize($results); 
        }   

        // Retrieves all genres
        function fetchAll() {
            $query = <<<'SQL'
                SELECT *
                FROM genre
            SQL;

            $statement = $this -> pdo -> prepare($query);
            $statement -> execute([]);
            $results = $statement -> fetchAll();

            $this -> disconnect();
            
            return $this -> sanitize($results); 
        }   
        
        // Retrieves the genre by id
        function get($id) {
            $query = <<<'SQL'
                SELECT GenreId, Name
                FROM genre
                WHERE GenreId = ?
            SQL;

            $statement = $this -> pdo -> prepare($query);
            $statement -> execute([$id]);
            $results = $statement -> fetch();

            $this -> disconnect();
        
            return $this -> sanitize($results); 
        }
    }
?>