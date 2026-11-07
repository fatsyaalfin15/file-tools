import { useState } from "react";
import CertificateTool from "./components/CertificateTool";
import CompressTool from "./components/CompressTool";
import Features from "./components/Features";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Hero from "./components/Hero";
import PdfTool from "./components/PdfTool";
import ToolCards, { type Tool } from "./components/ToolCards";
import MetadataTool from "./components/MetadataTool";
import WatermarkTool from "./components/WatermarkTool";

const WORKSPACE: Record<Tool, { title: string; desc: string }> = {
  compress: {
    title: "Kompres Gambar",
    desc: "Unggah gambar, atur kualitas dan ukuran, lalu bandingkan hasilnya sebelum mengunduh.",
  },
  pdf: {
    title: "Gambar ke PDF",
    desc: "Unggah beberapa gambar, atur urutannya, lalu gabungkan menjadi satu dokumen PDF.",
  },
  certificate: {
    title: "Generator Sertifikat",
    desc: "Isi data penerima, lihat pratinjaunya, lalu unduh sertifikat dalam format PDF.",
  },
  metadata: {
    title: "Info dan Metadata Gambar",
    desc: "Lihat data tersembunyi di dalam gambar, seperti lokasi, kamera, dan waktu, lalu hapus sebelum dibagikan.",
  },
  watermark: {
    title: "Watermark",
    desc: "Tambahkan teks hak cipta ke gambar dengan posisi, ukuran, dan kepekatan yang bisa diatur.",
  },
};

export default function App() {
  const [tool, setTool] = useState<Tool>("compress");

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 dark:bg-slate-950 dark:text-slate-100">
      <Header />

      <main>
        <Hero />

        <section id="alat" className="mx-auto max-w-5xl scroll-mt-20 px-4 pb-16">
          <ToolCards active={tool} onChange={setTool} />

          <div className="mt-6 rounded-3xl bg-white p-4 shadow-xl ring-1 ring-slate-200 sm:p-6 dark:bg-slate-900 dark:ring-slate-800">
            <div className="mb-5">
              <h2 className="text-xl font-bold">{WORKSPACE[tool].title}</h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {WORKSPACE[tool].desc}
              </p>
            </div>

            {tool === "compress" && <CompressTool />}
            {tool === "pdf" && <PdfTool />}
            {tool === "certificate" && <CertificateTool />}
            {tool === "metadata" && <MetadataTool />}
            {tool === "watermark" && <WatermarkTool />}
          </div>
        </section>

        <Features />
      </main>

      <Footer />
    </div>
  );
}
