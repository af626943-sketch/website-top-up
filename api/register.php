<?php
require_once 'db.php';

// Get posted data
$data = json_decode(file_get_contents("php://input"));

if (!empty($data->name) && !empty($data->email) && !empty($data->password)) {
    $name = trim($data->name);
    $email = trim(strtolower($data->email));
    $password = $data->password;
    $role = 'user'; // default role is user
    
    try {
        // Check if email already exists
        $checkQuery = "SELECT id FROM users WHERE email = :email LIMIT 0,1";
        $checkStmt = $conn->prepare($checkQuery);
        $checkStmt->bindParam(':email', $email);
        $checkStmt->execute();
        
        if ($checkStmt->rowCount() > 0) {
            http_response_code(400);
            echo json_encode(["error" => "Email sudah terdaftar!"]);
            exit();
        }
        
        // Insert user
        $query = "INSERT INTO users SET name = :name, email = :email, password = :password, role = :role";
        $stmt = $conn->prepare($query);
        
        $stmt->bindParam(':name', $name);
        $stmt->bindParam(':email', $email);
        $stmt->bindParam(':password', $password);
        $stmt->bindParam(':role', $role);
        
        if ($stmt->execute()) {
            http_response_code(201);
            echo json_encode(["message" => "Registrasi berhasil!"]);
        } else {
            http_response_code(500);
            echo json_encode(["error" => "Gagal membuat akun!"]);
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
