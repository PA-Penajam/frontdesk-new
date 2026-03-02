export function Footer() {
  return (
    <footer className="border-t bg-muted/40">
      <div className="container mx-auto flex h-16 items-center justify-center px-4">
        <p className="text-sm text-muted-foreground text-center">
          &copy; {new Date().getFullYear()} Pengadilan Agama Penajam. Hak Cipta Dilindungi.
        </p>
      </div>
    </footer>
  );
}
