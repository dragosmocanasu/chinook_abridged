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

        /* Recursively sanitizing a nested array OR a string
        * ENT_COMPAT converts double quotes to entities
        * ENT_HTML_5 treats the output as HTML5
        * UTF-8 sets the encoding to UTF-8 
        * false turns off the double encoding of HTML characters
        * &amp; will not become &amp;amp;
        * array_map submits every element of the array to the function in the 1st param
        * array_map takes a native function, not an object method as the 1st param. Therefore, we call it as array($this, 'funcName')
        */
        public function sanitize ($text) {
            if (is_array($text)) {
                return (array_map(array($this, 'sanitize'), $text));
              } else {
                return htmlspecialchars($text, ENT_COMPAT|ENT_HTML5, 'UTF-8', false);
              }
        }
    }
?>