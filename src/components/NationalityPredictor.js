import React, { useState, useEffect, useRef } from "react";
import { Alert, Button, Form, Container } from "react-bootstrap";

// State variables for managing name input, selected name, country info, and input errors
const NameNationalityPredictor = () => {
  const [nameInput, setNameInput] = useState("");
  const [selectedName, setSelectedName] = useState("");
  const [countryInfo, setCountryInfo] = useState(null);
  const [inputError, setInputError] = useState("");
  const inputElement = useRef(null);

  useEffect(() => {
    inputElement.current.focus(); // Focus the input on component mount
  }, []);

  // Function to fetch nationality predictions from the API
  const getNationality = async () => {
    setInputError("");
    setCountryInfo(null);

    // Validate input
    if (!nameInput.trim()) {
      setInputError("Please provide a valid name.");
      return;
    }

    try {
      const response = await fetch(
        `https://api.nationalize.io?name=${nameInput}`
      );
      const result = await response.json();
      // Check if country data is available
      if (result.country && result.country.length > 0) {
        setSelectedName(nameInput);
        setCountryInfo(result.country[0]);
      } else {
        setInputError("No nationality predictions found.");
      }
    } catch (err) {
      console.error("Error fetching nationality:", err);
      setInputError("Error retrieving nationality. Please try again.");
    }
  };

  // Handle pressing the Enter key to fetch nationality
  const handleEnterPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      getNationality(); // Trigger nationality fetch on Enter key press
    }
  };

  return (
    <Container
      style={{ maxWidth: "400px", textAlign: "center", marginTop: "50px" }}
    >
      <h1 style={{ marginBottom: "20px" }}>
        Predict the Nationality of a Name
      </h1>
      <Form>
        <Form.Group style={{ marginBottom: "20px" }}>
          {/* Input field for entering the name */}
          <Form.Control
            type="text"
            ref={inputElement}
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            onKeyDown={handleEnterPress}
            placeholder="Enter a name"
            style={{ padding: "10px", fontSize: "16px" }}
          />
        </Form.Group>
        {/* Button to trigger nationality prediction */}
        <Button
          variant="primary"
          onClick={getNationality}
          style={{ marginTop: "10px" }}
        >
          Predict Nationality
        </Button>
      </Form>
      {/* Display error message if input is invalid */}
      {inputError && (
        <Alert variant="danger" style={{ marginTop: "20px" }}>
          {inputError}
        </Alert>
      )}
      {/* Display nationality prediction result */}
      {countryInfo && (
        <div style={{ marginTop: "20px" }}>
          <h2>
            <strong>{selectedName}'s</strong> country ID is{" "}
            <strong>{countryInfo.country_id}</strong> with a{" "}
            <strong>{(countryInfo.probability * 100).toFixed(2)}%</strong>{" "}
            probability.
          </h2>
        </div>
      )}
    </Container>
  );
};

export default NameNationalityPredictor;
