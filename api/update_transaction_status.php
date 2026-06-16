<?php
require_once 'db.php';

// Get posted data
$data = json_decode(file_get_contents("php://input"));

if (!empty($data->admin_email) && !empty($data->transaction_id) && !empty($data->status)) {
    $admin_email = trim(strtolower($data->admin_email));
    $transaction_id = trim($data->transaction_id);
    $status = trim(strtoupper($data->status));
    
    // Validate status values
    if (!in_array($status, ['PENDING', 'SUCCESS', 'FAILED'])) {
        http_response_code(400);
        echo json_encode(["error" => "Status tidak valid!"]);
        exit();
    }
    
    try {
        // Authorize admin
        $authQuery = "SELECT role FROM users WHERE email = :email LIMIT 0,1";
        $authStmt = $conn->prepare($authQuery);
        $authStmt->bindParam(':email', $admin_email);
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
        
        // Update transaction
        $query = "UPDATE transactions SET status = :status WHERE id = :id";
        $stmt = $conn->prepare($query);
        $stmt->bindParam(':status', $status);
        $stmt->bindParam(':id', $transaction_id);
        
        if ($stmt->execute()) {
            http_response_code(200);
            echo json_encode(["message" => "Status transaksi berhasil diperbarui!"]);
        } else {
            http_response_code(500);
            echo json_encode(["error" => "Gagal memperbarui status transaksi!"]);
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
