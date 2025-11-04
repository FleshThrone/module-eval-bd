// URL of the raw file on GitHub
const fileUrl =
  "https://raw.githubusercontent.com/FleshThrone/module-eval-bd/main/";

// Function to fetch and display the file content
function fetchFileContent() {
  fetch(fileUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.text();
    })
    .then((data) => {
      // Display the content in a <pre> tag with id 'fileContent'
      document.getElementById("fileContent").textContent = data;
    })
    .catch((error) => {
      console.error("Error fetching the file:", error);
    });
}

// Call the function when the page loads
window.onload = fetchFileContent;
