import { useState } from "react";
import { useCertificate } from "../hooks/useCertificate";
import type { CertificateData } from "../types/certificate";
import Card from "./Card";
import CertificateForm from "./CertificateForm";
import CertificatePreview from "./CertificatePreview";

function today() {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

export default function CertificateTool() {
  const [data, setData] = useState<CertificateData>(() => ({
    recipient: "",
    title: "Sertifikat Penghargaan",
    description: "",
    date: today(),
    place: "",
    signerName: "",
    signerRole: "",
    number: "",
    theme: "orange",
  }));

  const { file, loading, error, setError, generate } = useCertificate();

  function submit() {
    if (!data.recipient.trim()) return setError("Nama penerima wajib diisi");
    if (!data.title.trim()) return setError("Judul sertifikat wajib diisi");
    if (!data.date) return setError("Tanggal wajib diisi");
    generate(data);
  }

  return (
    <div className="space-y-4">
      {error && (
        <p
          role="alert"
          className="rounded-lg bg-red-100 p-3 text-sm text-red-700 dark:bg-red-900/40 dark:text-red-200"
        >
          {error}
        </p>
      )}

      <div className="grid items-start gap-4 lg:grid-cols-2">
        <Card>
          <h3 className="mb-4 text-base font-semibold">Data sertifikat</h3>
          <CertificateForm
            data={data}
            loading={loading}
            onChange={(patch) => setData((prev) => ({ ...prev, ...patch }))}
            onSubmit={submit}
          />
        </Card>

        <Card className="min-w-0">
          <h3 className="mb-4 text-base font-semibold">Pratinjau</h3>
          <CertificatePreview file={file} loading={loading} />
        </Card>
      </div>
    </div>
  );
}
