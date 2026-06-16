<?php
require_once 'db.php';

// Get posted data
$data = json_decode(file_get_contents("php://input"));

if (!empty($data->email) && !empty($data->password)) {
    $email = trim(strtolower($data->email));
    $password = $data->password;
    
    try {
        $query = "SELECT name, email, password, role FROM users WHERE email = :email LIMIT 0,1";
        $stmt = $conn->prepare($query);
        $stmt->bindParam(':email', $email);
        $stmt->execute();
        
        if ($stmt->rowCount() > 0) {
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            
            // Plain text check to match original frontend logic
            if ($password === $row['password']) {
                http_response_code(200);
                echo json_encode([
                    "name" => $row['name'],
                    "email" => $row['email'],
                    "role" => $row['role']
                ]);
            } else {
                http_response_code(401);
                echo json_encode(["error" => "Password salah!"]);
            }
        } else {
            http_response_code(404);
            echo json_encode(["error" => "Email tidak terdaftar!"]);
        }
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => "Database error: " . $e->getMessage()]);
    }
} else {
    http_response_code(400);
    echo json_encode(["error" => "Data tidak lengkap!"]);
}
?>
