export default function MenuLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex-1 mx-auto w-full max-w-lg bg-background min-h-screen flex flex-col">
      {children}
    </main>
  );
}
