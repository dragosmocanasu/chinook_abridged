<?php
    session_start();
    
    //if (!isset($_SESSION['userType']) || $_SESSION['userType'] !== 'admin') {
        //echo 'Admin not authenticated';
    //} else {

        define('ENTITY', 2);
        define('ID', 3);
        define('MAX_PIECES', 4);

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

        if ($pieces == ENTITY) {
            header('Location: login.php');
        }   else {
                if ($pieces > MAX_PIECES) {
                    echo formatError();
                } else {
                    $entity = $urlPieces[ENTITY];
                    switch ($entity) {
                        case 'artists':
                            require_once('src/artist.php');
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
                                            } else if ($results == -1) {
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
                                        } else if ($results == -1) {
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
                                        } else if ($results == -1) {
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
                            require_once('src/album.php');
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
                                            } else if ($results == -1) {
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
                                        } else if ($results == -1) {
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
                                        } else if ($results == -1) {
                                            $response['Message'] = 'Database could not process your request';
                                            echo json_encode($response, http_response_code(409));
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
                            require_once('src/track.php');
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
                                                } else if ($results == -1) {
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
                                // Update a track
                                // PHP does not handle PUT explicitly, they must be read from the request body's raw data
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
                                        } else if ($results == -1) {
                                            $response['Message'] = 'Database could not process your request';
                                            echo json_encode($response, http_response_code(400));
                                            } else {
                                                    $response['Message'] = 'Updated';
                                                    echo json_encode($response, http_response_code(200));
                                                }
                                        }
                                    break;
                                // Delete a track
                                case 'DELETE':
                                    if ($pieces < MAX_PIECES) {
                                        echo formatError();
                                    } else {
                                        $results = $track -> delete($urlPieces[ID]);
                                        if (empty($results)) {
                                            $response['Message'] = 'Track does not exist';
                                            echo json_encode($response, http_response_code(400));
                                        } else if ($results == -1) {
                                            $response['Message'] = 'Database could not process your request';
                                            echo json_encode($response, http_response_code(409));
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
                            require_once('src/mediatype.php');
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
                            require_once('src/genre.php');
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
                            require_once('src/customer.php');
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
                                        } else if ($results == -1) {
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
                                        } else if ($results == -1) {
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
                                        } else if ($results == -1) {
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

                        case 'invoices':
                            require_once('src/invoice.php');
                            $invoice = new Invoice();

                            $verb = $_SERVER['REQUEST_METHOD'];
                            switch ($verb) {
                                // Search for an invoice
                                case 'GET':
                                    if ($pieces < MAX_PIECES) {
                                        if (!isset($_GET['customerId'])) {
                                            // Fetch all
                                            $results = $invoice -> fetchAll();
                                            if (empty($results)) {
                                                $response['Message'] = 'Not found';
                                                echo json_encode($response, http_response_code(404));
                                            } else {
                                                echo json_encode($results, http_response_code(200));
                                            }
                                        } else {
                                            // Fetch by customerId
                                            $results = $invoice -> search($_GET['customerId']);
                                            if (empty($results)) {
                                                $response['Message'] = 'Not found';
                                                echo json_encode($response, http_response_code(404));
                                            } else {
                                                echo json_encode($results, http_response_code(200));
                                            }
                                        }
                                    } else {
                                        // Fetch by id
                                        $results = $invoice -> get($urlPieces[ID]);
                                        if (empty($results)) {
                                            $response['Message'] = 'Not found';
                                            echo json_encode($response, http_response_code(404));
                                        } else {
                                            echo json_encode($results, http_response_code(200));
                                        }
                                    }
                                    break;
                                // Create an invoice
                                case 'POST':
                                    if ($pieces == ID) {
                                        if (!isset($_POST['customerId']) || !isset($_POST['invoiceDate']) || !isset($_POST['billingAddress']) || !isset($_POST['billingCity']) 
                                            || !isset($_POST['billingState']) || !isset($_POST['billingCountry']) || !isset($_POST['billingPostalCode']) || !isset($_POST['total'])) {
                                                echo formatError();
                                            } else {
                                                $results = $invoice -> add($_POST['customerId'], $_POST['invoiceDate'], $_POST['billingAddress'], $_POST['billingCity'], 
                                                    $_POST['billingState'], $_POST['billingCountry'], $_POST['billingPostalCode'], $_POST['total']);
                                                if ($results == -1) {
                                                    $response['Message'] = 'Database could not process your request';
                                                    echo json_encode($response, http_response_code(400));
                                                } else {
                                                    $response['Message'] = "Created";
                                                    $response['Id'] = $results;
                                                    echo json_encode($response, http_response_code(201));
                                                }
                                            }
                                    } else {
                                        echo formatError();
                                    }
                                    break;
                                // Update an invoice
                                case 'PUT':
                                    $invoiceData = (array) json_decode(file_get_contents('php://input'), TRUE);

                                    if ($pieces < MAX_PIECES || !isset($invoiceData['customerId']) || !isset($invoiceData['invoiceDate']) || !isset($invoiceData['billingAddress']) || !isset($invoiceData['billingCity']) 
                                        || !isset($invoiceData['billingState']) || !isset($invoiceData['billingCountry']) || !isset($invoiceData['billingPostalCode']) || !isset($invoiceData['total'])) {
                                        echo formatError();
                                    } else {
                                        $results = $invoice -> update($urlPieces[ID], $invoiceData['customerId'], $invoiceData['invoiceDate'], $invoiceData['billingAddress'], $invoiceData['billingCity'],
                                            $invoiceData['billingState'], $invoiceData['billingCountry'], $invoiceData['billingPostalCode'], $invoiceData['total']);
                                        if (empty($results)) {
                                                $response['Message'] = 'Invoice does not exist / update data is the same';
                                                echo json_encode($response, http_response_code(400));
                                        } else if ($results == -1) {
                                            $response['Message'] = 'Database could not process your request';
                                            echo json_encode($response, http_response_code(400));
                                            } else {
                                                    $response['Message'] = 'Updated';
                                                    echo json_encode($response, http_response_code(200));
                                                }
                                        }
                                    break;
                                // Delete an invoice
                                case 'DELETE':
                                    if ($pieces < MAX_PIECES) {
                                        echo formatError();
                                    } else {
                                        $results = $invoice -> delete($urlPieces[ID]);
                                        if (empty($results)) {
                                            $response['Message'] = 'Invoice does not exist';
                                            echo json_encode($response, http_response_code(400));
                                        } else if ($results == -1) {
                                            $response['Message'] = 'Database could not process your request';
                                            echo json_encode($response, http_response_code(409));
                                            } else {
                                                $response['Message'] = 'Deleted';
                                                echo json_encode($response, http_response_code(200));
                                            }
                                    }
                                    break;
                            }

                            $invoice = null;
                            break;
                        
                        case 'invoicelines':
                            require_once('src/invoiceline.php');
                            $invoiceLine = new InvoiceLine();
                            
                            $verb = $_SERVER['REQUEST_METHOD'];
                            switch ($verb) {
                                // Search for an invoiceline
                                case 'GET':
                                    if ($pieces < MAX_PIECES) {
                                        if (!isset($_GET['invoiceId'])) {
                                            // Fetch all
                                            $results = $invoiceLine -> fetchAll();
                                            if (empty($results)) {
                                                $response['Message'] = 'Not found';
                                                echo json_encode($response, http_response_code(404));
                                            } else {
                                                echo json_encode($results, http_response_code(200));
                                            }
                                        } else {
                                            // Fetch by invoiceId
                                            $results = $invoiceLine -> search($_GET['invoiceId']);
                                            if (empty($results)) {
                                                $response['Message'] = 'Not found';
                                                echo json_encode($response, http_response_code(404));
                                            } else {
                                                echo json_encode($results, http_response_code(200));
                                            }
                                        }
                                    } else {
                                        // Fetch by id
                                        $results = $invoiceLine -> get($urlPieces[ID]);
                                        if (empty($results)) {
                                            $response['Message'] = 'Not found';
                                            echo json_encode($response, http_response_code(404));
                                        } else {
                                            echo json_encode($results, http_response_code(200));
                                        }
                                    }
                                        break;
                                // Create an invoiceline
                                case 'POST':
                                if ($pieces == ID) {
                                    if (!isset($_POST['invoiceId']) || !isset($_POST['trackId']) || !isset($_POST['unitPrice']) || !isset($_POST['quantity'])) {
                                            echo formatError();
                                        } else {
                                            $results = $invoiceLine -> add($_POST['invoiceId'], $_POST['trackId'], $_POST['unitPrice'], $_POST['quantity']);
                                            if (empty($results)) {
                                                $response['Message'] = 'Invoiceline exists already';
                                                echo json_encode($response, http_response_code(409));
                                            } else if ($results == -1) {
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
                                // Update an invoiceline
                                case 'PUT':
                                    $invoiceLineData = (array) json_decode(file_get_contents('php://input'), TRUE);

                                    if ($pieces < MAX_PIECES || !isset($invoiceLineData['invoiceId']) || !isset($invoiceLineData['trackId']) || !isset($invoiceLineData['unitPrice']) || 
                                        !isset($invoiceLineData['quantity'])) {
                                        echo formatError();
                                    } else {
                                        $results = $invoiceLine -> update($urlPieces[ID], $invoiceLineData['invoiceId'], $invoiceLineData['trackId'], $invoiceLineData['unitPrice'], $invoiceLineData['quantity']);
                                        if (empty($results)) {
                                                $response['Message'] = 'Invoiceline does not exist / update data is the same';
                                                echo json_encode($response, http_response_code(400));
                                        } else if ($results == -1) {
                                            $response['Message'] = 'Database could not process your request';
                                            echo json_encode($response, http_response_code(400));
                                            } else {
                                                    $response['Message'] = 'Updated';
                                                    echo json_encode($response, http_response_code(200));
                                                }
                                        }
                                    break;
                                // Delete an invoice
                                case 'DELETE':
                                if ($pieces < MAX_PIECES) {
                                    echo formatError();
                                } else {
                                    $results = $invoiceLine -> delete($urlPieces[ID]);
                                    if (empty($results)) {
                                        $response['Message'] = 'Invoiceline does not exist';
                                        echo json_encode($response, http_response_code(400));
                                    } else if ($results == -1) {
                                        $response['Message'] = 'Database could not process your request';
                                        echo json_encode($response, http_response_code(409));
                                        } else {
                                            $response['Message'] = 'Deleted';
                                            echo json_encode($response, http_response_code(200));
                                        }
                                }
                                    break;
                            }

                            $invoiceLine = null;
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