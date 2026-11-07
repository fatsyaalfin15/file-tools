export type CertificateTheme = "orange" | "green" | "blue";

export type CertificateData = {
  recipient: string;
  title: string;
  description: string;
  date: string; // yyyy-mm-dd
  place: string;
  signerName: string;
  signerRole: string;
  number: string;
  theme: CertificateTheme;
};
