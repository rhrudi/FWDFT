// DEBUG: confirm JS is loaded
console.log("REGISTER JS LOADED");

document.getElementById("registerForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!name || !email || !password) {
    alert("All fields are required");
    return;
  }

  try {
    const response = await fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name,
        email,
        password
      })
    });

    const data = await response.json();
    console.log("Register response:", data);

    if (response.ok) {
      alert("User registered successfully!");
      window.location.href = "login.html";
    } else {
      alert(data.message || "Registration failed");
    }

  } catch (error) {
    console.error("Register error:", error);
    alert("Server error");
  }
});