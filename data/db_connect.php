<?php

$servername = "localhost";
$username = "root";
$password = "123456789";
$database = "recipes";

//create the connection
$conn = new mysqli($servername, $username, $password, $database);

if ($conn->connect_error) {
die("connection failed". $conn->connect_error);
}

