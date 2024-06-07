<?php

// Logging user out, stopping the session and redirecting the user to index.php
session_start();
session_unset();
session_destroy();
header("Location: ../index.php");
exit();
