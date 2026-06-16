<?php
require_once 'db.php';

try {
    // Select games from DB
    $query = "SELECT id, name, publisher, badge, image, description, has_server AS hasServer, server_placeholder AS serverPlaceholder FROM games ORDER BY id DESC";
    $stmt = $conn->prepare($query);
    $stmt->execute();
    
    $games = [];
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        // cast hasServer to boolean
        $row['hasServer'] = $row['hasServer'] == 1 ? true : false;
        
        // Fetch packages for this game
        $packageQuery = "SELECT id, name, price, formatted_price AS formattedPrice FROM packages WHERE game_id = :game_id ORDER BY price ASC";
        $packageStmt = $conn->prepare($packageQuery);
        $packageStmt->bindParam(':game_id', $row['id']);
        $packageStmt->execute();
        
        $row['packages'] = [];
        while ($pkg = $packageStmt->fetch(PDO::FETCH_ASSOC)) {
            $pkg['price'] = (int)$pkg['price'];
            $row['packages'][] = $pkg;
        }
        
        $games[] = $row;
    }
    
    echo json_encode($games);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Failed to retrieve games data: " . $e->getMessage()]);
}
?>
