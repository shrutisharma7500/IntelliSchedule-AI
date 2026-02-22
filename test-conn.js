import axios from "axios";

async function testFetch() {
    try {
        console.log("Hitting backend...");
        const res = await axios.get("http://localhost:5000/");
        console.log("Backend root response:", res.data);

        console.log("Hitting /chat (should be 401/403)...");
        try {
            await axios.post("http://localhost:5000/chat", { message: "hi" });
        } catch (err) {
            console.log("Chat response (expected error):", err.response?.status, err.response?.data);
        }
    } catch (err) {
        console.error("Connection failed:", err.message);
    }
}

testFetch();
