export default function Footer() {
  return (
    <footer className="border-t border-border px-6 py-4 text-center">
      <span className="text-xs text-muted-foreground">© {new Date().getFullYear()} Aegis</span>
    </footer>
  );
}
