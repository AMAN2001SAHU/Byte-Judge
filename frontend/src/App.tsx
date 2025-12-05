import Layout from './components/Layout';

function App() {
  return (
    <>
      <Layout>
        <div className="flex-1 px-6 py-6">
          <h2 className="text-xl font-bold">Dashboard</h2>
          <p className="text-muted-foreground">Welcome to ByteJudge.</p>
        </div>
      </Layout>
    </>
  );
}

export default App;
