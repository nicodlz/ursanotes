import { Layout } from "@/components/layout/index.js";

function App() {
  return (
    <Layout>
      <div className="p-4">
        <h1 className="text-2xl font-bold">Welcome to vaultmd</h1>
        <p className="text-muted-foreground mt-2">
          Your secure, end-to-end encrypted markdown notes.
        </p>
      </div>
    </Layout>
  );
}

export default App;
