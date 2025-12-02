import app from "./app";

// Port
const PORT: number = Number(process.env.PORT) || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
