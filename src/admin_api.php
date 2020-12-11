<?php
    session_start();
    
    //if (!isset($_SESSION['userType']) || $_SESSION['userType'] !== 'admin') {
        //echo 'Admin not authenticated';
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

                                // Create an artist
                                case 'POST':
                                    if ($pieces == ID) {
                                        if (!isset($_POST['name'])) {
                                            echo formatError();
                                        } else {
                                            $results = $artist -> add($_POST['name']);
                                            if (empty($results)) {
                                                $response['Message'] = 'Artist exists already';
                                                echo json_encode($response, http_response_code(409));
                                            } else if ($results === -1) {
                                                $response['Message'] = 'Database could not process your request';
                                                echo json_encode($response, http_response_code(400));
                                                } else {
                                                        $response['Message'] = "Created with id $results";
                                                        echo json_encode($response, http_response_code(201));
                                                }
                                            }
                                    } else {
                                        echo formatError();
                                    }
                                    break;
                                    
                                // Update an artist
                                // PHP does not handle PUT explicitly, they must be read from the request body's raw data
                                case 'PUT':
                                    $artistData = (array) json_decode(file_get_contents('php://input'), TRUE);

                                    if ($pieces < MAX_PIECES || !isset($artistData['name'])) {
                                        echo formatError();
                                    } else {
                                        $results = $artist -> update($urlPieces[ID], $artistData['name']);
                                        if (empty($results)) {
                                                $response['Message'] = 'Artist does not exist / update data is the same';
                                                echo json_encode($response, http_response_code(400));
                                        } else if($results === -1) {
                                            $response['Message'] = 'Database could not process your request';
                                            echo json_encode($response, http_response_code(400));
                                            } else {
                                                    $response['Message'] = 'Updated';
                                                    echo json_encode($response, http_response_code(200));
                                                }
                                        }
                                    break;

                                // Delete an artist
                                case 'DELETE':
                                    if ($pieces < MAX_PIECES) {
                                        echo formatError();
                                    } else {
                                        $results = $artist -> delete($urlPieces[ID]);
                                        if (empty($results)) {
                                            $response['Message'] = 'Artist does not exist';
                                            echo json_encode($response, http_response_code(400));
                                        } else if ($results === -1) {
                                            $response['Message'] = 'Database could not process your request';
                                            echo json_encode($response, http_response_code(400));
                                            } else {
                                                $response['Message'] = 'Deleted';
                                                echo json_encode($response, http_response_code(200));
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
                                    
                                // Create an album
                                case 'POST':
                                    if ($pieces == ID) {
                                        if (!isset($_POST['title']) || !isset($_POST['artistId'])) {
                                            echo formatError();
                                        } else {
                                            $results = $album -> add($_POST['title'], $_POST['artistId']);
                                            if (empty($results)) {
                                                $response['Message'] = 'Album exists already for this artist';
                                                echo json_encode($response, http_response_code(409));
                                            } else if ($results === -1) {
                                                $response['Message'] = 'Database could not process your request';
                                                echo json_encode($response, http_response_code(400));
                                                } else {
                                                        $response['Message'] = "Created with id $results";
                                                        echo json_encode($response, http_response_code(201));
                                                }
                                            }
                                    } else {
                                        echo formatError();
                                    }
                                    break;

                                // Update an album
                                // PHP does not handle PUT explicitly, they must be read from the request body's raw data
                                case 'PUT':
                                    $albumData = (array) json_decode(file_get_contents('php://input'), TRUE);

                                    if ($pieces < MAX_PIECES || !isset($albumData['title']) || !isset($albumData['artistId'])) {
                                        echo formatError();
                                    } else {
                                        $results = $album -> update($urlPieces[ID], $albumData['title'], $albumData['artistId']);
                                        if (empty($results)) {
                                                $response['Message'] = 'Album does not exist / update data is the same';
                                                echo json_encode($response, http_response_code(400));
                                        } else if($results === -1) {
                                            $response['Message'] = 'Database could not process your request';
                                            echo json_encode($response, http_response_code(400));
                                            } else {
                                                    $response['Message'] = 'Updated';
                                                    echo json_encode($response, http_response_code(200));
                                                }
                                        }
                                    break;

                                // Delete an album
                                case 'DELETE':
                                    if ($pieces < MAX_PIECES) {
                                        echo formatError();
                                    } else {
                                        $results = $album -> delete($urlPieces[ID]);
                                        if (empty($results)) {
                                            $response['Message'] = 'Album does not exist';
                                            echo json_encode($response, http_response_code(400));
                                        } else if ($results === -1) {
                                            $response['Message'] = 'Database could not process your request';
                                            echo json_encode($response, http_response_code(400));
                                            } else {
                                                $response['Message'] = 'Deleted';
                                                echo json_encode($response, http_response_code(200));
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
                                // Create a track
                                case 'POST':
                                    if ($pieces == ID) {
                                        if (!isset($_POST['name']) || !isset($_POST['albumId']) || !isset($_POST['mediaTypeId']) || !isset($_POST['genreId']) 
                                            || !isset($_POST['composer']) || !isset($_POST['milliseconds']) || !isset($_POST['bytes']) || !isset($_POST['unitPrice'])) {
                                                echo formatError();
                                            } else {
                                                $results = $track -> add($_POST['name'], $_POST['albumId'], $_POST['mediaTypeId'], $_POST['genreId'], 
                                                    $_POST['composer'], $_POST['milliseconds'], $_POST['bytes'], $_POST['unitPrice']);
                                                if (empty($results)) {
                                                    $response['Message'] = 'Track exists already for this album';
                                                    echo json_encode($response, http_response_code(409));
                                                } else if ($results === -1) {
                                                    $response['Message'] = 'Database could not process your request';
                                                    echo json_encode($response, http_response_code(400));
                                                } else {
                                                    $response['Message'] = "Created with id $results";
                                                    echo json_encode($response, http_response_code(201));
                                                }
                                            }
                                    } else {
                                        echo formatError();
                                    }
                                    break;
                                case 'PUT':
                                    $trackData = (array) json_decode(file_get_contents('php://input'), TRUE);

                                    if ($pieces < MAX_PIECES || !isset($trackData['name']) || !isset($trackData['albumId']) || !isset($trackData['mediaTypeId']) || !isset($trackData['genreId']) 
                                        || !isset($trackData['composer']) || !isset($trackData['milliseconds']) || !isset($trackData['bytes']) || !isset($trackData['unitPrice'])) {
                                        echo formatError();
                                    } else {
                                        $results = $track -> update($urlPieces[ID], $trackData['name'], $trackData['albumId'], $trackData['mediaTypeId'], $trackData['genreId'],
                                            $trackData['composer'], $trackData['milliseconds'], $trackData['bytes'], $trackData['unitPrice']);
                                        if (empty($results)) {
                                                $response['Message'] = 'Track does not exist / update data is the same';
                                                echo json_encode($response, http_response_code(400));
                                        } else if($results === -1) {
                                            $response['Message'] = 'Database could not process your request';
                                            echo json_encode($response, http_response_code(400));
                                            } else {
                                                    $response['Message'] = 'Updated';
                                                    echo json_encode($response, http_response_code(200));
                                                }
                                        }
                                    break;
                                case 'DELETE':
                                    if ($pieces < MAX_PIECES) {
                                        echo formatError();
                                    } else {
                                        $results = $track -> delete($urlPieces[ID]);
                                        if (empty($results)) {
                                            $response['Message'] = 'Track does not exist';
                                            echo json_encode($response, http_response_code(400));
                                        } else if ($results === -1) {
                                            $response['Message'] = 'Database could not process your request';
                                            echo json_encode($response, http_response_code(400));
                                            } else {
                                                $response['Message'] = 'Deleted';
                                                echo json_encode($response, http_response_code(200));
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