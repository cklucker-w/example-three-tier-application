export default function HelloWorld() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 py-16 px-4 flex items-center justify-center">
      <div className="max-w-lg mx-auto text-center">
        <h1 className="text-5xl font-bold text-zinc-900 dark:text-zinc-50 mb-4">
          Hello World
        </h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-8">
          Welcome to the Hello World page!
        </p>
        <a
          href="/"
          className="inline-block rounded-lg bg-zinc-900 dark:bg-zinc-50 px-6 py-3 font-medium text-white dark:text-zinc-900 hover:bg-zinc-700 dark:hover:bg-zinc-200 transition-colors"
        >
          Back to To-Do List
        </a>
      </div>
    </div>
  );
}
