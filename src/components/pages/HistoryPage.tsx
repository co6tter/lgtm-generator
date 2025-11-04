"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Clock, Trash2, Download, ExternalLink } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/common/Button";
import { Loading } from "@/components/common/Loading";
import { getRecentConfigs, deleteConfig, clearAllConfigs } from "@/lib/storage/localStorage";
import { encodeConfigToURL } from "@/lib/utils/url";
import type { LGTMConfig } from "@/types";

export function HistoryPage() {
  const [configs, setConfigs] = useState<LGTMConfig[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadConfigs();
  }, []);

  const loadConfigs = () => {
    setIsLoading(true);
    const configs = getRecentConfigs();
    setConfigs(configs);
    setIsLoading(false);
  };

  const handleDelete = (id: string) => {
    deleteConfig(id);
    loadConfigs();
  };

  const handleClearAll = () => {
    if (confirm("Are you sure you want to clear all history?")) {
      clearAllConfigs();
      loadConfigs();
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Unknown";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="bg-gray-50">
        <Container size="lg" className="py-8">
          <Loading size="lg" text="Loading history..." />
        </Container>
      </div>
    );
  }

  return (
    <div className="bg-gray-50">
      <Container size="lg" className="py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">History</h1>
            <p className="mt-1 text-sm text-gray-600">Your recent LGTM configurations (max 20)</p>
          </div>
          <div className="flex items-center gap-3">
            {configs.length > 0 && (
              <Button variant="outline" size="sm" onClick={handleClearAll}>
                <Trash2 className="mr-2 h-4 w-4" aria-hidden="true" />
                Clear All
              </Button>
            )}
            <Link href="/">
              <Button variant="primary" size="sm">
                New LGTM
              </Button>
            </Link>
          </div>
        </div>

        {configs.length === 0 ? (
          <div className="rounded-lg bg-white p-12 text-center shadow-sm">
            <Clock className="mx-auto mb-4 h-12 w-12 text-gray-400" aria-hidden="true" />
            <h2 className="mb-2 text-lg font-semibold text-gray-900">No history yet</h2>
            <p className="mb-4 text-sm text-gray-600">
              Your recent LGTM configurations will appear here
            </p>
            <Link href="/">
              <Button variant="primary">Create Your First LGTM</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {configs.map((config) => (
              <div
                key={config.id}
                className="rounded-lg bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="mb-3 flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="line-clamp-1 font-semibold text-gray-900">{config.text}</h3>
                    <p className="mt-1 text-xs text-gray-500">
                      <Clock className="mr-1 inline h-3 w-3" aria-hidden="true" />
                      {formatDate(config.createdAt)}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(config.id!)}
                    className="ml-2 rounded p-1 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
                    aria-label="Delete configuration"
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>

                <div className="mb-3 space-y-1 text-xs text-gray-600">
                  <div className="flex items-center justify-between">
                    <span>Template:</span>
                    <span className="font-medium capitalize">{config.template}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Font Size:</span>
                    <span className="font-medium capitalize">{config.fontSize}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Position:</span>
                    <span className="font-medium capitalize">{config.textPosition}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Colors:</span>
                    <div className="flex gap-1">
                      <div
                        className="h-4 w-4 rounded border border-gray-300"
                        style={{ backgroundColor: config.textColor }}
                        title={`Text: ${config.textColor}`}
                      />
                      <div
                        className="h-4 w-4 rounded border border-gray-300"
                        style={{ backgroundColor: config.backgroundColor }}
                        title={`Background: ${config.backgroundColor}`}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Link href={`/?${encodeConfigToURL(config).split("?")[1]}`} className="flex-1">
                    <Button variant="primary" size="sm" fullWidth>
                      <Download className="mr-1 h-3 w-3" aria-hidden="true" />
                      Load
                    </Button>
                  </Link>
                  <Link
                    href={`/?${encodeConfigToURL(config).split("?")[1]}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="outline" size="sm" aria-label="Open in new tab">
                      <ExternalLink className="h-3 w-3" aria-hidden="true" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}
