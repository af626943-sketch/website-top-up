<?php
require_once 'db.php';

$email = isset($_GET['email']) ? trim(strtolower($_GET['email'])) : '';

if (!empty($email)) {
    try {
        // Authorize admin
        $authQuery = "SELECT role FROM users WHERE email = :email LIMIT 0,1";
        $authStmt = $conn->prepare($authQuery);
        $authStmt->bindParam(':email', $email);
        $authStmt->execute();
        
        $authorized = false;
        if ($authStmt->rowCount() > 0) {
            $user = $authStmt->fetch(PDO::FETCH_ASSOC);
            if ($user['role'] === 'admin') {
                $authorized = true;
            }
        }
        
        if (!$authorized) {
            http_response_code(403);
            echo json_encode(["error" => "Akses Ditolak! Anda bukan administrator."]);
            exit();
        }
        
        // Fetch contacts
        $query = "SELECT * FROM contacts ORDER BY created_at DESC";
        $stmt = $conn->prepare($query);
        $stmt->execute();
        
        $messages = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $messages[] = $row;
        }
        
        echo json_encode($messages);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => "Database error: " . $e->getMessage()]);
    }
} else {
    http_response_code(400);
    echo json_encode(["error" => "Email tidak disertakan!"]);
}
?>
