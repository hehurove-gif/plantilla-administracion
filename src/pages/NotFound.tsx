import { Button } from '@/components/ui/Button';

export function NotFound() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-24 text-center">
      <h1 className="text-5xl font-extrabold">404</h1>
      <p className="mt-3 text-muted">No encontramos la página que buscas.</p>
      <div className="mt-6 flex justify-center">
        <Button href="/">Volver al inicio</Button>
      </div>
    </section>
  );
}
