
"use client";

import { useEffect, useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useParams } from "next/navigation";

interface BadgeData {
  name: string;
  company: string;
  designation: string;
  type: "Visitor" | "Exhibitor";
  qrId: string;
}

export default function BadgePage() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { token } = useParams();
  const [badgeData, setBadgeData] = useState<BadgeData | null>(null);

  useEffect(() => {
    if (!token) return;

    const fetchData = async () => {
      const captchaToken = await new Promise<string>((resolve) => {
        window.grecaptcha.ready(() => {
          window.grecaptcha
            .execute('6LczrR0rAAAAAOgAYqgFiME6l-Sl5bs1ErIKJQla', {
              action: "badge_view",
            })
            .then(resolve);
        });
      });

      const res = await fetch(`https://www.jeddah-vision.com/expo-registration/${token}?captchaToken=${captchaToken}`);
      const data = await res.json();

      if (res.ok) {
        setBadgeData(data.data);
      } else {
        alert(data.message || "Unable to load badge data.");
      }
    };

    fetchData();
  }, [token]);

  const handleDownload = async () => {
    if (!iframeRef.current) return;

    const iframeDoc = iframeRef.current.contentDocument;
    const badgeElement = iframeDoc?.getElementById("badge");
    if (!badgeElement) return;

    const canvas = await html2canvas(badgeElement as HTMLElement, {
      backgroundColor: "#ffffff",
      scale: 3,
      useCORS: true,
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: [canvas.width / 3, canvas.height / 3],
    });

    pdf.addImage(imgData, "PNG", 0, 0, canvas.width / 3, canvas.height / 3);
    pdf.save(`${badgeData?.name || "badge"}.pdf`);
  };

  const renderIframeContent = () => {
    if (!badgeData) return "";

    const qr = `<img src="https://api.qrserver.com/v1/create-qr-code/?data=https://hotel-hospitality-register.vercel.app/badge-registration/${badgeData.qrId}&size=150x150" style='border: 1px solid #ccc; padding: 6px; border-radius: 4px;'/>`;

    return `
      <html>
        <body style="margin:0;padding:0;font-family:Arial,sans-serif;">
          <div id="badge" style="
            width: 320px;
            height: 500px;
            background: white;
            color: #000;
            border: 1px solid #ccc;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
          ">
            <div style="background:#000;color:#fff;font-size:10px;padding:6px 10px">
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">
                <img src='/banner.png' style="height:20px" />
                <img src='/banner.png' style="height:20px" />
                <img src='/banner.png' style="height:20px" />
              </div>
              <div style="font-weight:bold;text-align:center; padding-top: 3px;">17 – 19 SEPTEMBER 2024 | 2PM – 10PM</div>
              <div style="text-align:center; padding-bottom: 8px;">RIYADH FRONT EXHIBITION & CONFERENCE CENTER</div>
            </div>

            <div style="text-align:center;padding:20px 20px 16px 20px">
              <div style="font-size:22px;font-weight:bold;margin-bottom:4px">${badgeData.name}</div>
              <div style="font-size:14px;color:#555;margin-bottom:4px">${badgeData.designation}</div>
              <div style="font-size:15px;font-weight:500;margin-bottom:10px;color:#000; padding-bottom: 8px;">${badgeData.company}</div>
              <div>${qr}</div>
              <div style="font-size:10px;color:#666;margin-top:10px;word-break:break-word">${badgeData.qrId}</div>
            </div>

            <div style="background:#1A2330;color:#fff;text-align:center;padding:14px 10px 26px;font-size:16px;font-weight:bold">
              ${badgeData.type === "Visitor" ? "VISITOR" : "EXHIBITOR"}
            </div>
          </div>
        </body>
      </html>
    `;
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center py-10 px-4">
      <iframe
        ref={iframeRef}
        title="badge-preview"
        style={{ width: 340, height: 520, border: "none" }}
        srcDoc={renderIframeContent()}
      />

      <button
        onClick={handleDownload}
        style={{
          marginTop: 20,
          backgroundColor: "#000",
          color: "#fff",
          padding: "10px 24px",
          borderRadius: 6,
          fontSize: 14,
          border: "none",
          cursor: "pointer",
        }}
      >
        Download Badge as PDF
      </button>
    </div>
  );
}
