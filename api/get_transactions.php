<?php
require_once 'db.php';

$email = isset($_GET['email']) ? trim(strtolower($_GET['email'])) : '';

if (!empty($email)) {
    try {
        // Query user role to check authorization
        $roleQuery = "SELECT role FROM users WHERE email = :email LIMIT 0,1";
        $roleStmt = $conn->prepare($roleQuery);
        $roleStmt->bindParam(':email', $email);
        $roleStmt->execute();
        
        $isAdmin = false;
        if ($roleStmt->rowCount() > 0) {
            $user = $roleStmt->fetch(PDO::FETCH_ASSOC);
            if ($user['role'] === 'admin') {
                $isAdmin = true;
            }
        }
        
        if ($isAdmin) {
            // Admin sees all transactions
            $query = "SELECT t.*, g.name AS game_name, g.image AS game_image, p.name AS package_name 
                      FROM transactions t
                      LEFT JOIN games g ON t.game_id = g.id
                      LEFT JOIN packages p ON t.package_id = p.id
                      ORDER BY t.created_at DESC";
            $stmt = $conn->prepare($query);
        } else {
            // Normal user sees only their own transactions
            $query = "SELECT t.*, g.name AS game_name, g.image AS game_image, p.name AS package_name 
                      FROM transactions t
                      LEFT JOIN games g ON t.game_id = g.id
                      LEFT JOIN packages p ON t.package_id = p.id
                      WHERE t.user_email = :email
                      ORDER BY t.created_at DESC";
            $stmt = $conn->prepare($query);
            $stmt->bindParam(':email', $email);
        }
        
        $stmt->execute();
        $transactions = [];
        
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $row['price'] = (int)$row['price'];
            $transactions[] = $row;
        }
        
        echo json_encode($transactions);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => "Database error: " . $e->getMessage()]);
    }
} else {
    http_response_code(400);
    echo json_encode(["error" => "Email tidak disertakan!"]);
}
?>
