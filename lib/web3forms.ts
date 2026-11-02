/** Envía un formulario a Web3Forms (llega al correo de VORTEX). La clave es pública por diseño. */
export async function sendWeb3Form(fields: Record<string, string>): Promise<"ok" | "error" | "missing-key"> {
  const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_KEY;
  if (!accessKey) return "missing-key";
  try {
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ access_key: accessKey, from_name: "Web VORTEX", ...fields }),
    });
    const result = await response.json().catch(() => null);
    return response.ok && result?.success ? "ok" : "error";
  } catch {
    return "error";
  }
}
