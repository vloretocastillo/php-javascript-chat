<?php

    function create_db()
    {
        $db = new SQLite3('mydb.db');
        return $db;
    }

    function create_users_table($db)
    {
        $db->exec("CREATE TABLE users(id INTEGER PRIMARY KEY, name TEXT, token INTEGER)");
    }

    function create_mesages_table($db)
    {
        $db->exec("CREATE TABLE messages(id INTEGER PRIMARY KEY,  userid REFERENCES users(id) ,text TEXT)");
    }

    function insert_into_users_table($db, $username)
    {
        
        $token = rand(100,10000);
        $db->exec("INSERT INTO users(name, token) VALUES('$username', '$token')");
        $user = $db->query("SELECT * FROM users where token = '$token' ");
        $data = $user->fetchArray();
        return [
            "token" => $data['token'],
            "name" => $data['name'],
            "id" => $data['id']
        ];
    }

    function insert_into_messages_table($db, $text, $userid)
    {
        $userid = $userid + 0;
        $db->exec("INSERT INTO messages(text, userid) VALUES('$text', '$userid')");
    }

    function print_users_table($db)
    {
        $users = $db->query('SELECT * FROM users');
        while ($row = $users->fetchArray()) {
            echo "{$row['id']} {$row['name']}\n";
        }
    }

    // print_users_table($db);

    function print_messages_table($db)
    {
        $messages = $db->query('SELECT * FROM messages');
        while ($row = $messages->fetchArray()) {
            echo "{$row['id']} {$row['text']} {$row['userid']}\n";
        }
    }

    // print_messages_table($db);

    function get_user_name_by_id($db, $id)
    {
      
        $user = $db->query("SELECT * FROM users where id =  $id");
        $user = $user->fetchArray();
        return "{$user['name']}";
    }

    // get_user_name_by_id($db, 3);

    function get_messages($db)
    {
        $messages = $db->query("SELECT * FROM messages");
        $data = [];
        while ($row = $messages->fetchArray()) {
            array_push($data, [
                "message" => $row['text'],
                "userid" => $row['userid'],
                "username" => get_user_name_by_id($db, $row['userid'])
            ]);
        };


        return $data;
    }

    // get_messages($db)

?>