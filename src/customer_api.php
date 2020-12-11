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

                        case 'users':
                            require_once('customer.php');
                            $user = new Customer();

                            $verb = $_SERVER['REQUEST_METHOD'];
                            switch ($verb) {
                                // Search for a user
                                case 'GET': 
                                    if ($pieces < MAX_PIECES) {
                                        if (!isset($_GET['email'])) {
                                            // Fetch all
                                            $results = $user -> fetchAll();
                                            if (empty($results)) {
                                                $response['Message'] = 'Not found';
                                                echo json_encode($response, http_response_code(404));
                                            } else {
                                                echo json_encode($results, http_response_code(200));
                                            }
                                        } else {
                                            // Fetch by email
                                            $results = $user -> search($_GET['email']);
                                            if (empty($results)) {
                                                $response['Message'] = 'Not found';
                                                echo json_encode($response, http_response_code(404));
                                            } else {
                                                echo json_encode($results, http_response_code(200));
                                            }
                                        }
                                    } else {
                                        // Fetch by id
                                        $results = $user -> get($urlPieces[ID]);
                                        if (empty($results)) {
                                            $response['Message'] = 'Not found';
                                            echo json_encode($response, http_response_code(404));
                                        } else {
                                            echo json_encode($results, http_response_code(200));
                                        }
                                    }
                                    break;
                                
                                // Create a user
                                case 'POST':
                                if ($pieces == ID) {
                                    if (!isset($_POST['firstName']) || !isset($_POST['lastName']) ||
                                    !isset($_POST['address']) || !isset($_POST['postalCode']) || !isset($_POST['company']) ||  
                                    !isset($_POST['city']) || !isset($_POST['state']) || !isset($_POST['country']) || 
                                    !isset($_POST['phone']) || !isset($_POST['fax']) || !isset($_POST['email']) || !isset($_POST['password'])) {
                                        echo formatError();
                                    } else {
                                        $results = $user -> create($_POST['firstName'], $_POST['lastName'],  $_POST['address'], $_POST['postalCode'], 
                                        $_POST['company'], $_POST['city'], $_POST['state'], $_POST['country'],  $_POST['phone'],
                                                $_POST['fax'], $_POST['email'], $_POST['password'], );
                                        if (empty($results)) {
                                            $response['Message'] = 'User with this email address exists already';
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

                                // Update the user's data
                                case 'PUT':
                                    $userData = (array) json_decode(file_get_contents('php://input'), TRUE);

                                    if ($pieces < MAX_PIECES || !isset($userData['firstName']) || !isset($userData['lastName']) ||
                                    !isset($userData['address']) || !isset($userData['postalCode']) || !isset($userData['company']) ||  
                                    !isset($userData['city']) || !isset($userData['state']) || !isset($userData['country']) || 
                                    !isset($userData['phone']) || !isset($userData['fax']) || !isset($userData['email']) || !isset($userData['password'])) {
                                        echo formatError();
                                    } else {
                                        $results = $user -> update($urlPieces[ID], $userData['firstName'], $userData['lastName'], $userData['address'], $userData['postalCode'],
                                        $userData['company'], $userData['city'], $userData['state'], $userData['country'], $userData['phone'], $userData['fax'], $userData['email'], $userData['password']);
                                        if (empty($results)) {
                                                $response['Message'] = 'User does not exist / Update data is the same';
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

                                // Delete an user
                                case 'DELETE':
                                    if ($pieces < MAX_PIECES) {
                                        echo formatError();
                                    } else {
                                        $results = $user -> delete($urlPieces[ID]);
                                        if (empty($results)) {
                                            $response['Message'] = 'User does not exist';
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

                            $user = null;
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