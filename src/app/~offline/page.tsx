import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Offline",
};

export default function OfflinePage() {
  return (
    <main
      style={{
        minHeight: "100dvh",
        display: "grid",
        placeItems: "center",
        padding: "24px",
        fontFamily: "system-ui, sans-serif",
        textAlign: "center",
        backgroundColor: "#ffffff",
        color: "#171717",
      }}
    >
      <div>
        <h1 style={{ marginBottom: "8px", fontSize: "1.5rem" }}>You are offline</h1>

        <p style={{ margin: 0, color: "#5f6368" }}>
          Check your internet connection, then reopen SHG Portal.
        </p>
      </div>
    </main>
  );
}
