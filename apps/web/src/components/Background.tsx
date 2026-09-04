export function Background() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_15%_25%,rgba(212,175,55,0.12)_0%,transparent_50%),radial-gradient(ellipse_at_85%_20%,rgba(212,175,55,0.08)_0%,transparent_40%),radial-gradient(ellipse_at_50%_75%,rgba(212,175,55,0.06)_0%,transparent_50%)]" />
      <img
        src="/img/logocerveria.png"
        alt=""
        className="absolute -left-8 -top-8 w-56 opacity-20 drop-shadow-[0_0_30px_rgba(212,175,55,0.1)] sm:w-72"
      />
      <img
        src="/img/logo_UNAH.png"
        alt=""
        className="absolute -bottom-8 -right-8 w-56 opacity-20 drop-shadow-[0_0_30px_rgba(212,175,55,0.1)] sm:w-72"
      />
    </div>
  );
}
