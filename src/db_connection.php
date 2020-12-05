<?php
    class DB {
        protected $pdo;

        // Opens and establishes the connection to the DB
        public function __construct() {
            include('db_connection_data.php');

            $dsn="mysql:host=$host;dbname=$db;charset=$charset";
            $options = [
                // Throwing exceptions in case of error
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                // Results returned in associative arrays
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
            ];

            try {
                $this -> pdo = new PDO($dsn, $username, $password, $options);
                //echo 'Connection to DB is sucessful';
            } catch (\PDOException $e) {
                echo $e;
                die('Connection unsuccessful: ' . $e->getMessage());
                exit();
            }
        }
    
        // Closes the connection to the DB
        public function disconnect() {
            $this -> pdo = null;            
        }
    }
?>