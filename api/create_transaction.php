<?php
require_once 'db.php';

// Get posted data
$data = json_decode(file_get_contents("php://input"));

if (
    !empty($data->id) &&
    !empty($data->user_email) &&
    !empty($data->game_id) &&
    !empty($data->package_id) &&
    !empty($data->user_game_id) &&
    !empty($data->payment_method) &&
    isset($data->price) &&
    !empty($data->formatted_price)
) {
    try {
        $query = "INSERT INTO transactions SET 
            id = :id,
            user_email = :user_email,
            game_id = :game_id,
            package_id = :package_id,
            user_game_id = :user_game_id,
            server_id = :server_id,
            payment_method = :payment_method,
            price = :price,
            formatted_price = :formatted_price,
            status = :status";
            
        $stmt = $conn->prepare($query);
        
        $status = !empty($data->status) ? $data->status : 'SUCCESS';
        $serverId = !empty($data->server_id) ? trim($data->server_id) : null;
        
        $stmt->bindParam(':id', $data->id);
        $stmt->bindParam(':user_email', $data->user_email);
        $stmt->bindParam(':game_id', $data->game_id);
        $stmt->bindParam(':package_id', $data->package_id);
        $stmt->bindParam(':user_game_id', $data->user_game_id);
        $stmt->bindParam(':server_id', $serverId);
        $stmt->bindParam(':payment_method', $data->payment_method);
        $stmt->bindParam(':price', $data->price);
        $stmt->bindParam(':formatted_price', $data->formatted_price);
        $stmt->bindParam(':status', $status);
        
        if ($stmt->execute()) {
            http_response_code(201);
            echo json_encode(["message" => "Transaksi berhasil dicatat!"]);
        } else {
            http_response_code(500);
            echo json_encode(["error" => "Gagal mencatat transaksi!"]);
        }
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => "Database error: " . $e->getMessage()]);
    }
} else {
    http_response_code(400);
    echo json_encode(["error" => "Data transaksi tidak lengkap!"]);
}
?>
