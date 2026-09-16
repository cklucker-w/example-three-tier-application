export default function HelloWorld() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-zinc-900 dark:to-indigo-950 flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-indigo-600 dark:text-indigo-400 mb-4">
          Hello World
        </h1>
        <p className="text-xl text-zinc-700 dark:text-zinc-300 mb-8">
          Welcome to the Three-Tier Application
        </p>
        <a
          href="/"
          className="inline-block rounded-lg bg-indigo-600 dark:bg-indigo-500 px-6 py-3 font-medium text-white hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors"
        >
          Go to To-Do List
        </a>
      </div>
    </div>
  );
}
