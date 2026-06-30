import axios from "axios";

async function checkHealth() {
  const url = "https://ais-dev-ov5tffz6ktl2ydm36agxsp-918330054561.europe-west2.run.app/api/health";
  try {
    const res = await axios.get(url);
    console.log("Status:", res.status);
    console.log("Content-Type:", res.headers["content-type"]);
    console.log("Data:", res.data);
  } catch (err: any) {
    if (err.response) {
      console.log("Error status:", err.response.status);
      console.log("Error body:", err.response.data);
    } else {
      console.log("Error:", err.message);
    }
  }
}

checkHealth();
