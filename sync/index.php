<?php
	header('Content-Type: application/json');

	// 1. Sprawdzenie pochodzenia (tylko własna domena)
	$referer = $_SERVER['HTTP_REFERER'] ?? '';
	$host = $_SERVER['HTTP_HOST'];

	// if (empty($referer) || parse_url($referer, PHP_URL_HOST) !== $host) {
	// 	http_response_code(403);
	// 	echo json_encode(['error' => 'Forbidden: Cross-domain requests not allowed']);
	// 	exit;
	// }

	// 2. Obsługa tylko metody POST
	if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
		http_response_code(405);
		echo json_encode(['error' => 'Method Not Allowed']);
		exit;
	}

	// 3. Pobranie danych i walidacja JSON
	$rawData = file_get_contents('php://input');
	$decodedData = json_decode($rawData, true);

	if (json_last_error() !== JSON_ERROR_NONE) {
		http_response_code(400);
		echo json_encode(['error' => 'Invalid JSON format']);
		exit;
	}

	// 4. Pobranie nazwy pliku i sanityzacja (kluczowe dla bezpieczeństwa!)
	$fileName = $_GET['name'] ?? '';
	// Usuwamy wszystko, co mogłoby pozwolić na Directory Traversal (np. ../)
	$safeFileName = preg_replace('/[^a-zA-Z0-9_\-\.]/', '', $fileName) . ".json";

	if (empty($safeFileName)) {
		http_response_code(400);
		echo json_encode(['error' => 'Invalid file name']);
		exit;
	}

	// 5. Zapis do pliku
	$path = __DIR__ . '/../storage/' . $safeFileName;

	if (file_put_contents($path, $rawData)) {
		echo json_encode(['status' => 'success', 'file' => $safeFileName]);
	} else {
		http_response_code(500);
		echo json_encode(['error' => 'Failed to write file. Check directory permissions.']);
	}