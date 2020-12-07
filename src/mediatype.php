<?php
    // MediaType class

    require_once('db_connection.php'); 
    class MediaType extends DB {
        // Retrieves the mediatype whose name includes a certain text
        function search($text) {
            $query = <<<'SQL'
                SELECT MediaTypeId, Name
                FROM mediatype
                WHERE Name LIKE ?
                ORDER BY Name;
            SQL;

            $statement = $this -> pdo -> prepare($query);
            $statement -> execute(['%' . $text . '%']);
            $results = $statement -> fetchAll();

            $this -> disconnect();
            
            return $results;
        }   

        // Retrieves all mediatypes
        function fetchAll() {
            $query = <<<'SQL'
                SELECT *
                FROM mediatype
                ORDER BY Name;
            SQL;

            $statement = $this -> pdo -> prepare($query);
            $statement -> execute([]);
            $results = $statement -> fetchAll();

            $this -> disconnect();
            
            return $results;
        }   
        
        // Retrieves the mediatype by id
        function get($id) {
            $query = <<<'SQL'
                SELECT MediaTypeId, Name
                FROM mediatype
                WHERE MediaTypeId = ?
            SQL;

            $statement = $this -> pdo -> prepare($query);
            $statement -> execute([$id]);
            $results = $statement -> fetch();

            $this -> disconnect();
        
            return $results;
        }
    }
?>