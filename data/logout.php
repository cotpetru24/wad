<?php
session_start();
session_unset();
session_destroy();
header("Location: login.html"); //to change location to index.html
exit();
?>
