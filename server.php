<?php
header("Access-Control-Allow-Origin: *");
include 'db.php';

$db;
if ( !file_exists('mydb.db') ) {
    $db = create_db();
    create_users_table($db);
    create_mesages_table($db);
    insert_into_users_table($db, 'TrialUser');
    insert_into_messages_table($db, 'Trial message', 1);
} else {
    $db = create_db();
}

// If we get a GET request from client
if ( isset($_POST['getChat']) ) {
    echo json_encode(get_messages($db));
}

// If we get a post request with a new user info
if ( isset($_POST['newUser']) ) {
    $data = json_decode($_POST['newUser'], true);
    $user = insert_into_users_table($db, $data['name']);
    echo json_encode($user); 
} 

// If we get a post request with a message from a user
if ( isset($_POST['message']) ) {
    $data = json_decode($_POST['message'], true);
    insert_into_messages_table($db, $data['message'], $data['userID']);
} 

?>