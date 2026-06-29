"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Shield } from "lucide-react";
import type { CloudProvider, CloudConfig, S3Config, GCSConfig, AzureConfig } from "@/lib/cloudUpload";
import { uploadToCloud } from "@/lib/cloudUpload";
import type { UploadProgress } from "@/lib/cloudUpload";
import TerminalLog, { type LogLine } from "./TerminalLog";

interface CloudModalProps {
  provider: CloudProvider;
  zipBlob: Blob | null;
  onClose: () => void;
  onSuccess: () => void;
}

const providerNames: Record<CloudProvider, string> = {
  s3: "AWS S3",
  gcs: "Google Cloud Storage",
  azure: "Azure Blob Storage",
};

export default function CloudModal({
  provider,
  zipBlob,
  onClose,
  onSuccess,
}: CloudModalProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [logs, setLogs] = useState<LogLine[]>([]);
  const [progress, setProgress] = useState(0);

  // S3 fields
  const [s3Bucket, setS3Bucket] = useState("");
  const [s3Region, setS3Region] = useState("us-east-1");
  const [s3AccessKey, setS3AccessKey] = useState("");
  const [s3SecretKey, setS3SecretKey] = useState("");

  // GCS fields
  const [gcsBucket, setGcsBucket] = useState("");
  const [gcsServiceAccount, setGcsServiceAccount] = useState("");

  // Azure fields
  const [azureContainer, setAzureContainer] = useState("");
  const [azureConnString, setAzureConnString] = useState("");

  const getConfig = (): CloudConfig | null => {
    switch (provider) {
      case "s3":
        if (!s3Bucket || !s3AccessKey || !s3SecretKey) return null;
        return {
          bucket: s3Bucket,
          region: s3Region,
          accessKey: s3AccessKey,
          secretKey: s3SecretKey,
        } as S3Config;
      case "gcs":
        if (!gcsBucket || !gcsServiceAccount) return null;
        return {
          bucket: gcsBucket,
          serviceAccountJson: gcsServiceAccount,
        } as GCSConfig;
      case "azure":
        if (!azureContainer || !azureConnString) return null;
        return {
          container: azureContainer,
          connectionString: azureConnString,
        } as AzureConfig;
    }
  };

  const handleUpload = useCallback(async () => {
    const config = getConfig();
    if (!config || !zipBlob) return;

    setIsUploading(true);
    setLogs([]);
    setProgress(0);

    let lineId = 0;

    await uploadToCloud(provider, zipBlob, config, (p: UploadProgress) => {
      setLogs((prev) => [
        ...prev,
        {
          id: `upload-${lineId++}`,
          timestamp: p.timestamp,
          message: p.message,
          type: p.type === "success" ? "done" : p.type === "error" ? "error" : "info",
        },
      ]);
      if (p.percent) setProgress(p.percent);
    });

    setTimeout(() => {
      onSuccess();
      onClose();
    }, 1500);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [provider, zipBlob, onSuccess, onClose, s3Bucket, s3Region, s3AccessKey, s3SecretKey, gcsBucket, gcsServiceAccount, azureContainer, azureConnString]);

  const inputClass = "w-full bg-transparent font-mono py-3 px-3";
  const inputStyle = {
    fontSize: "13px" as const,
    color: "#fff",
    background: "var(--bg-inset)",
    border: "1px solid var(--border)",
    borderRadius: "4px",
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 flex items-end justify-center"
        style={{
          zIndex: 50,
          backdropFilter: "blur(8px)",
          background: "rgba(0,0,0,0.6)",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={(e) => {
          if (e.target === e.currentTarget && !isUploading) onClose();
        }}
      >
        <motion.div
          className="w-full"
          style={{
            maxWidth: "520px",
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "8px 8px 0 0",
            maxHeight: "85vh",
            overflowY: "auto",
          }}
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 30,
          }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-6 py-4"
            style={{ borderBottom: "1px solid var(--border)" }}
          >
            <span
              className="font-sans"
              style={{ fontSize: "16px", fontWeight: 500, color: "#fff" }}
            >
              {providerNames[provider]}
            </span>
            {!isUploading && (
              <motion.button
                onClick={onClose}
                className="cursor-pointer"
                style={{
                  background: "transparent",
                  border: "none",
                  color: "rgba(255,255,255,0.4)",
                  padding: "4px",
                }}
                whileHover={{ color: "rgba(255,255,255,0.8)" }}
              >
                <X size={16} />
              </motion.button>
            )}
          </div>

          {/* Content */}
          <div className="px-6 py-4 flex flex-col gap-3">
            {!isUploading ? (
              <>
                {/* S3 fields */}
                {provider === "s3" && (
                  <>
                    <input
                      type="text"
                      placeholder="Bucket name"
                      value={s3Bucket}
                      onChange={(e) => setS3Bucket(e.target.value)}
                      className={inputClass}
                      style={inputStyle}
                    />
                    <input
                      type="text"
                      placeholder="Region (e.g. us-east-1)"
                      value={s3Region}
                      onChange={(e) => setS3Region(e.target.value)}
                      className={inputClass}
                      style={inputStyle}
                    />
                    <input
                      type="password"
                      placeholder="Access Key ID"
                      value={s3AccessKey}
                      onChange={(e) => setS3AccessKey(e.target.value)}
                      className={inputClass}
                      style={inputStyle}
                    />
                    <input
                      type="password"
                      placeholder="Secret Access Key"
                      value={s3SecretKey}
                      onChange={(e) => setS3SecretKey(e.target.value)}
                      className={inputClass}
                      style={inputStyle}
                    />
                  </>
                )}

                {/* GCS fields */}
                {provider === "gcs" && (
                  <>
                    <input
                      type="text"
                      placeholder="Bucket name"
                      value={gcsBucket}
                      onChange={(e) => setGcsBucket(e.target.value)}
                      className={inputClass}
                      style={inputStyle}
                    />
                    <textarea
                      placeholder="Service Account JSON"
                      value={gcsServiceAccount}
                      onChange={(e) => setGcsServiceAccount(e.target.value)}
                      className="w-full bg-transparent font-mono py-3 px-3 resize-none"
                      style={{
                        ...inputStyle,
                        minHeight: "120px",
                      }}
                    />
                  </>
                )}

                {/* Azure fields */}
                {provider === "azure" && (
                  <>
                    <input
                      type="text"
                      placeholder="Container name"
                      value={azureContainer}
                      onChange={(e) => setAzureContainer(e.target.value)}
                      className={inputClass}
                      style={inputStyle}
                    />
                    <input
                      type="password"
                      placeholder="Connection string"
                      value={azureConnString}
                      onChange={(e) => setAzureConnString(e.target.value)}
                      className={inputClass}
                      style={inputStyle}
                    />
                  </>
                )}

                {/* Security notice */}
                <div
                  className="flex items-center gap-1.5 font-mono"
                  style={{ fontSize: "11px", color: "var(--text-safe)" }}
                >
                  <Shield size={11} />
                  keys used once, never stored
                </div>

                {/* Upload button */}
                <motion.button
                  onClick={handleUpload}
                  className="w-full font-mono cursor-pointer mt-2"
                  style={{
                    fontSize: "13px",
                    fontWeight: 500,
                    background: "var(--accent)",
                    color: "var(--bg-base)",
                    border: "none",
                    borderRadius: "4px",
                    padding: "12px",
                  }}
                  whileHover={{ filter: "brightness(1.1)", scale: 1.005 }}
                  whileTap={{ scale: 0.995 }}
                >
                  upload backup
                </motion.button>
              </>
            ) : (
              <TerminalLog
                lines={logs}
                showCursor={progress < 100}
                progress={progress}
              />
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
