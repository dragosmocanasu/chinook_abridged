<?php
    session_start();
    
    //if (!isset($_SESSION['userType']) || $_SESSION['userType'] !== 'customer') {
        //echo 'Customer not authenticated';
    //} else {

        define('ENTITY', 5);
        define('ID', 6);
        define('MAX_PIECES', 7);

        // GET parameters are removed
        $url = strtok($_SERVER['REQUEST_URI'], '?'); 

        // If there is a trailing slash, it is removed, thus not being take into account by explode()
        if (substr($url, strlen($url) - 1) ==  '/') {
            $url = substr($url, 0, strlen($url) - 1);
        }
        $urlPieces = explode('/', urldecode($url));

        header('Content-Type: application/json');
        header('Accept-version: v1');

        $pieces = count($urlPieces);
        //echo $pieces;
        //echo '<pre>';
        //print_r($urlPieces);

        if ($pieces == 5) {
            echo 'For the API description, please chech the README file';
        }   else {
                if ($pieces > MAX_PIECES) {
                    echo formatError();
                } else {
                    $entity = $urlPieces[ENTITY];
                    switch ($entity) {
                        case 'artists':
                            require_once('artist.php');
                            $artist = new Artist();

                            $verb = $_SERVER['REQUEST_METHOD'];
                            switch ($verb) {
                                // Search for an artist
                                case 'GET': 
                                    if ($pieces < MAX_PIECES) {
                                        if (!isset($_GET['name'])) {
                                            // Fetch all
                                            $results = $artist -> fetchAll();
                                            if (empty($results)) {
                                                $response['Message'] = 'Not found';
                                                echo json_encode($response, http_response_code(404));
                                            } else {
                                                echo json_encode($results, http_response_code(200));
                                            }
                                        } else {
                                            // Fetch by name
                                            $results = $artist -> search($_GET['name']);
                                            if (empty($results)) {
                                                $response['Message'] = 'Not found';
                                                echo json_encode($response, http_response_code(404));
                                            } else {
                                                echo json_encode($results, http_response_code(200));
                                            }
                                        }
                                    } else {
                                        // Fetch by id
                                        $results = $artist -> get($urlPieces[ID]);
                                        if (empty($results)) {
                                            $response['Message'] = 'Not found';
                                            echo json_encode($response, http_response_code(404));
                                        } else {
                                            echo json_encode($results, http_response_code(200));
                                        }
                                    }
                                    break;
                            }
                            $artist = null;
                            break;

                        case 'albums':
                            require_once('album.php');
                            $album = new Album();

                            $verb = $_SERVER['REQUEST_METHOD'];
                            switch ($verb) {
                                // Search an album
                                case 'GET':
                                    if ($pieces < MAX_PIECES) {
                                        if (!isset($_GET['title'])) {
                                            // Fetch all
                                            $results = $album -> fetchAll();
                                            if (empty($results)) {
                                                $response['Message'] = 'Not found';
                                                echo json_encode($response, http_response_code(404));
                                            } else {
                                                echo json_encode($results, http_response_code(200));
                                            }
                                        } else {
                                            // Fetch by title
                                            $results = $album -> search($_GET['title']);
                                            if (empty($results)) {
                                                $response['Message'] = 'Not found';
                                                echo json_encode($response, http_response_code(404));
                                            } else {
                                                echo json_encode($results, http_response_code(200));
                                            }
                                        }
                                    } else {
                                        // Fetch by id
                                        $results = $album -> get($urlPieces[ID]);
                                        if (empty($results)) {
                                            $response['Message'] = 'Not found';
                                            echo json_encode($response, http_response_code(404));
                                        } else {
                                            echo json_encode($results, http_response_code(200));
                                        }
                                    }
                                    break;
                            }
                            $album = null;
                            break;

                        case 'tracks':
                        require_once('track.php');
                            $track = new Track();

                            $verb = $_SERVER['REQUEST_METHOD'];
                            switch ($verb) {
                                // Search for a track
                                case 'GET':
                                    if ($pieces < MAX_PIECES) {
                                        if (!isset($_GET['name'])) {
                                            // Fetch all
                                            $results = $track -> fetchAll();
                                            if (empty($results)) {
                                                $response['Message'] = 'Not found';
                                                echo json_encode($response, http_response_code(404));
                                            } else {
                                                echo json_encode($results, http_response_code(200));
                                            }
                                        } else {
                                            // Fetch by name
                                            $results = $track -> search($_GET['name']);
                                            if (empty($results)) {
                                                $response['Message'] = 'Not found';
                                                echo json_encode($response, http_response_code(404));
                                            } else {
                                                echo json_encode($results, http_response_code(200));
                                            }
                                        }
                                    } else {
                                        // Fetch by id
                                        $results = $track -> get($urlPieces[ID]);
                                        if (empty($results)) {
                                            $response['Message'] = 'Not found';
                                            echo json_encode($response, http_response_code(404));
                                        } else {
                                            echo json_encode($results, http_response_code(200));
                                        }
                                    }
                                    break;
                            }
                            $track = null;
                            break;

                            case 'mediatypes':
                                require_once('mediatype.php');
                                $mediaType = new MediaType();
        
                                $verb = $_SERVER['REQUEST_METHOD'];
                                switch ($verb) {
                                    // Search for a mediatype
                                    case 'GET': 
                                        if ($pieces < MAX_PIECES) {
                                            if (!isset($_GET['name'])) {
                                                // Fetch all
                                                $results = $mediaType -> fetchAll();
                                                if (empty($results)) {
                                                    $response['Message'] = 'Not found';
                                                    echo json_encode($response, http_response_code(404));
                                                } else {
                                                    echo json_encode($results, http_response_code(200));
                                                }
                                            } else {
                                                // Fetch by name
                                                $results = $mediaType -> search($_GET['name']);
                                                if (empty($results)) {
                                                    $response['Message'] = 'Not found';
                                                    echo json_encode($response, http_response_code(404));
                                                } else {
                                                    echo json_encode($results, http_response_code(200));
                                                }
                                            }
                                        } else {
                                            // Fetch by id
                                            $results = $mediaType -> get($urlPieces[ID]);
                                            if (empty($results)) {
                                                $response['Message'] = 'Not found';
                                                echo json_encode($response, http_response_code(404));
                                            } else {
                                                echo json_encode($results, http_response_code(200));
                                            }
                                        }
                                        break;       
                                }
                                $mediaType = null;
                                break;

                                case 'genres':
                                    require_once('genre.php');
                                    $genre = new Genre();
            
                                    $verb = $_SERVER['REQUEST_METHOD'];
                                    switch ($verb) {
                                        // Search for a genre
                                        case 'GET': 
                                            if ($pieces < MAX_PIECES) {
                                                if (!isset($_GET['name'])) {
                                                    // Fetch all
                                                    $results = $genre -> fetchAll();
                                                    if (empty($results)) {
                                                        $response['Message'] = 'Not found';
                                                        echo json_encode($response, http_response_code(404));
                                                    } else {
                                                        echo json_encode($results, http_response_code(200));
                                                    }
                                                } else {
                                                    // Fetch by name
                                                    $results = $genre -> search($_GET['name']);
                                                    if (empty($results)) {
                                                        $response['Message'] = 'Not found';
                                                        echo json_encode($response, http_response_code(404));
                                                    } else {
                                                        echo json_encode($results, http_response_code(200));
                                                    }
                                                }
                                            } else {
                                                // Fetch by id
                                                $results = $genre -> get($urlPieces[ID]);
                                                if (empty($results)) {
                                                    $response['Message'] = 'Not found';
                                                    echo json_encode($response, http_response_code(404));
                                                } else {
                                                    echo json_encode($results, http_response_code(200));
                                                }
                                            }
                                            break;       
                                    }
                                    $genre = null;
                                    break;
        
                        default:
                            echo formatError();
                    }
                }
            }
    //}

    function formatError() {
        $output['Message'] = 'Incorrect format';
        return json_encode($output, http_response_code(400));
    }
?>