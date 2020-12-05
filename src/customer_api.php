<?php
    session_start();
    if (!isset($_SESSION['userType']) || $_SESSION['userType'] !== 'customer') {
        echo 'Customer not authenticated';
    } else if (!isset($_POST['entity']) || !isset($_POST['action'])){
        echo 'Entity and action not found';
    } else {
        $entity = $_POST['entity'];
        $action = $_POST['action'];

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
                }
                break;
            case 'customer':
                require_once('customer.php');
                $customer = new Customer();

                switch($action) {
                    case 'update':
                        if (!isset($_POST['firstName']) || !isset($_POST['lastName']) || !isset($_POST['company']) || !isset($_POST['address']) || !isset($_POST['city'])
                        || !isset($_POST['state']) || !isset($_POST['country']) || !isset($_POST['postalCode']) 
                        || !isset($_POST['phone']) || !isset($_POST['fax']) || !isset($_POST['email']) || !isset($_POST['newPassword'])) {
                            echo 'User creation could not be processed';
                    } else {
                        echo json_encode($customer -> update($_POST['firstName'], $_POST['lastName'], 
                            $_POST['company'], $_POST['address'], $_POST['city'], $_POST['state'], $_POST['country'], 
                                $_POST['postalCode'], $_POST['phone'], $_POST['fax'], $_POST['email'], $_POST['newPassword']));
                    }
                        break;
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
?>