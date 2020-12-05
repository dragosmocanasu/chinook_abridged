<?php
    session_start();

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
    //echo '<pre>';
    //print_r($urlPieces);

    if ($pieces == 4) {
        // TODO: replace with APIDescription();
        echo 'description';
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
                            // Search artists
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
                                            echo 'Database could not process your request';
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
                                        echo 'Database could not process your request';
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
                                        echo 'Database could not process your request';
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
                       
                        break;

                    case 'tracks':
                        
                        break;

                    default :
                        echo formatError();
                }
            }
        }
    // --------------------------------------------
    /*
    if (!isset($_SESSION['userType']) || $_SESSION['userType'] !== 'admin') {
        echo 'Admin not authenticated';
    } else if (!isset($_POST['entity']) || !isset($_POST['action'])){
        echo 'Entity and action not found';
    } else {
        switch ($entity) {
            case 'artists':
                require_once('artist.php');
                $artist = new Artist();
                
                switch($action) {
                    case 'search':
                        if (!isset($_POST['text'])) {
                            echo 'Artist search could not be processed';
                        } else {
                            echo json_encode($artist -> search($_POST['text']));
                        }
                        break;
                    case 'fetchAll':
                        echo json_encode($artist -> search($_POST['']));
                        break;
                    case 'add':
                        if (!isset($_POST['name'])) {
                            echo 'Artist creation could not be processed';
                        } else {
                            echo json_decode($artist -> add($_POST['name']));
                        }
                        break;
                    case 'update':
                        if (!isset($_POST['name']) || !isset($_POST['id'])) {
                            echo 'Artist update could not be processed';
                        } else {
                            echo json_decode($artist -> update($_POST['name'], $_POST['id']));
                        }
                        break;
                    case 'delete':
                        if (!isset($_POST['id'])) {
                            echo 'Artist deletion could not be processed';
                        } else {
                            echo json_decode($artist -> delete($_POST['id']));
                        }   
                        break;
                }
                break;
            case 'albums':
                require_once('album.php');
                $album = new Album();
                
                switch($action) {
                    case 'search':
                        if (!isset($_POST['text'])) {
                            echo 'Album search could not be processed';
                        } else {
                            echo json_encode($album -> search($_POST['text']));
                        }
                        break;
                    case 'fetchAll':
                        echo json_encode($album -> search($_POST['']));
                        break;
                    case 'add':
                        if (!isset($_POST['title']) || !isset($_POST['artistId'])) {
                            echo 'Album creation could not be processed';
                        } else {
                            echo json_decode($album -> add($_POST['title'], $_POST['artistId']));
                        }
                        break;
                    case 'update':
                        if (!isset($_POST['title']) || !isset($_POST['id']) || !isset($_POST['artistId'])) {
                            echo 'Album update could not be processed';
                        } else {
                            echo json_decode($album -> update($_POST['title'], $_POST['id'], $_POST['artistId']));
                        }
                        break;
                    case 'delete':
                        if (!isset($_POST['id'])) {
                            echo 'Album deletion could not be processed';
                        } else {
                            echo json_decode($album -> delete($_POST['id']));
                        }
                        break;
                }
                break;
            case 'tracks':
                require_once('track.php');
                $track = new Track();
                
                switch($action) {
                    case 'search':
                        if (!isset($_POST['text'])) {
                            echo 'Track search could not be processed';
                        } else {
                            echo json_encode($track -> search($_POST['text']));
                        }
                        break;
                    case 'fetchAll':
                        echo json_encode($track -> search($_POST['']));
                        break;
                    case 'add':
                        if (!isset($_POST['name']) || !isset($_POST['albumId']) || !isset($_POST['mediaTypeId']) || !isset($_POST['genreId']) 
                            || !isset($_POST['composer']) || !isset($_POST['milliseconds']) || !isset($_POST['bytes']) || !isset($_POST['unitPrice'])) {
                            echo 'Track creation could not be processed';
                        } else {
                            echo json_decode($track -> add($_POST['name'], $_POST['albumId'], $_POST['mediaTypeId'], $_POST['genreId'], 
                                $_POST['composer'], $_POST['milliseconds'], $_POST['bytes'], $_POST['unitPrice']));
                        }
                        break;
                    case 'update':
                        if (!isset($_POST['name']) || !isset($_POST['albumId']) || !isset($_POST['mediaTypeId']) || !isset($_POST['genreId']) 
                        || !isset($_POST['composer']) || !isset($_POST['milliseconds']) || !isset($_POST['bytes']) || !isset($_POST['unitPrice'],
                            $_POST['trackId'])) {
                            echo 'Track update could not be processed';
                        } else {
                            echo json_decode($track -> update($_POST['name'], $_POST['albumId'], $_POST['mediaTypeId'], $_POST['genreId'], 
                                $_POST['composer'], $_POST['milliseconds'], $_POST['bytes'], $_POST['unitPrice'], $_POST['trackId']));
                        }
                        break;
                    case 'delete':
                        if (!isset($_POST['id'])) {
                            echo 'Track deletion could not be processed';
                        } else {
                            echo json_decode($track -> delete($_POST['id']));
                        }
                        break;
                }
                break;
            case 'session':
                switch($action) {
                    case 'destroy':
                        session_destroy();
                        break;
                }
        }  
    }
    */
    // --------------------------------------------

    // TODO:
    /*
    function APIDescription() {
        $apiBaseUrl = 'http://{server}/chinook_abridged';
        $entityArtists = '/artists';
        $entityAlbums = '/albums';
        $entityTracks = '/tracks';

        $apiDescription['api-description'] = array('method' => 'GET', 'url' => $apiBaseUrl);
        $apiDescription['search-artists'] = array('method' => 'GET', 'url' => $apiBaseUrl . $entityFilms . '?title={film-search-text}');
        $apiDescription['get-artist'] = array('method' => 'GET', 'url' => $apiBaseUrl . $entityFilms . '/{film-id}');
        $apiDescription['add-artist'] = array('method' => 'POST', 'url' => $apiBaseUrl . $entityFilms, 'request-body' => array('title' => '', 'overview' => '', 'releaseDate' => '', 'runtime' => '', 'directors' => [], 'actors' => []));
        $apiDescription['update-artist'] = array('method' => 'PUT', 'url' => $apiBaseUrl . $entityFilms . '/{film-id}', 'request-body' => array('title' => '', 'overview' => '', 'releaseDate' => '', 'runtime' => '', 'directors' => [], 'actors' => []));
        $apiDescription['delete-artist'] = array('method' => 'DELETE', 'url' => $apiBaseUrl . $entityFilms . '/{film-id}');
        $apiDescription['search-persons'] = array('method' => 'GET', 'url' => $apiBaseUrl . $entityPersons . '?title={person-search-text}');
        $apiDescription['add-person'] = array('method' => 'POST', 'url' => $apiBaseUrl . $entityPersons, 'request-body' => array('name' => ''));
        $apiDescription['delete-person'] = array('method' => 'DELETE', 'url' => $apiBaseUrl . $entityPersons . '/{person-id}');

        return json_encode($apiDescription);
        
    }
    */

    function formatError() {
        $output['error'] = 'Incorrect format';
        return json_encode($output, http_response_code(400));
    }
?>