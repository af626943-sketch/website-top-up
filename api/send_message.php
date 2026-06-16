<?php
require_once 'db.php';

// Get posted data
$data = json_decode(file_get_contents("php://input"));

if (!empty($data->name) && !empty($data->email) && !empty($data->message)) {
    $name = trim($data->name);
    $email = trim(strtolower($data->email));
    $message = trim($data->message);
    
    try {
        $query = "INSERT INTO contacts SET name = :name, email = :email, message = :message";
        $stmt = $conn->prepare($query);
        $stmt->bindParam(':name', $name);
        $stmt->bindParam(':email', $email);
        $stmt->bindParam(':message', $message);
        
        if ($stmt->execute()) {
            http_response_code(201);
            echo json_encode(["message" => "Pesan Anda berhasil dikirim!"]);
        } else {
            http_response_code(500);
            echo json_encode(["error" => "Gagal mengirim pesan!"]);
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
