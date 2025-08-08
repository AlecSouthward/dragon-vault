function App(): React.JSX.Element {
  return (
    <div className="flex h-screen w-full flex-col bg-zinc-900">
      <h1 className="font-primary text-4xl font-bold text-zinc-300 select-none">
        Dragon Vault
      </h1>

      <img
        className="pointer-events-none w-32 fill-zinc-300 select-none"
        src="/icon.svg"
        alt="Dragon Vault Icon"
      />
    </div>
  );
}

export default App;
