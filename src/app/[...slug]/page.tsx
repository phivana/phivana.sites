export default function CatchAllPage({
  params,
}: {
  params: { slug?: string[] };
}) {
  const host = typeof window !== "undefined" ? window.location.host : "server";
  const path = "/" + (params.slug?.join("/") ?? "");
  return (
    <main style={{padding:"3rem"}}>
      <h1>phivana.site renderer</h1>
      <p><strong>Host:</strong> {host}</p>
      <p><strong>Path:</strong> {path}</p>
      <p>If you see the correct host here after DNS, wildcard is working ✅</p>
    </main>
  );
}