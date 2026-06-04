import Twin from '@/components/twin';

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8 h-screen flex">
        <div className="w-full max-w-4xl mx-auto h-full pb-8">
          <Twin />
        </div>
      </div>
    </main>
  );
}

