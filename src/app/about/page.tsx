"use client";

import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faIdCard, faSpinner } from "@fortawesome/free-solid-svg-icons";
import type { ApiResponse } from "@/app/_types/ApiResponse";
import type { About } from "@/app/_types/About";
import { AboutView } from "@/app/_components/AboutView";

const Page: React.FC = () => {
  const [aboutList, setAboutList] = useState<About[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPublicAbouts = async () => {
      try {
        const res = await fetch("/api/about", {
          credentials: "same-origin",
          cache: "no-store",
        });
        const data: ApiResponse<About[]> = await res.json();
        
        if (data.success) {
          setAboutList(data.payload || []);
        } else {
          setError(data.message || "データの取得に失敗しました。");
        }
      } catch (e) {
        setError("サーバーとの通信に失敗しました。");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPublicAbouts();
  }, []);

  if (isLoading) {
    return (
      <main>
        <div className="text-2xl font-bold">
          <FontAwesomeIcon icon={faIdCard} className="mr-1.5" />
          公開プロフィール
        </div>
        <div className="mt-4 flex items-center gap-x-2">
          <FontAwesomeIcon
            icon={faSpinner}
            className="animate-spin text-gray-500"
          />
          <div>Loading... </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main>
        <div className="text-2xl font-bold">
          <FontAwesomeIcon icon={faIdCard} className="mr-1.5" />
          公開プロフィール
        </div>
        <div className="mt-4 text-red-600">
          エラー: {error}
        </div>
      </main>
    );
  }

  return (
    <main>
      <div className="text-2xl font-bold">
        <FontAwesomeIcon icon={faIdCard} className="mr-1.5" />
        公開プロフィール
      </div>

      {aboutList.length === 0 ? (
        <div className="mt-4 text-gray-600">
          現在、公開されているプロフィールはありません。
        </div>
      ) : (
        <div className="mt-4 space-y-6">
          {aboutList.map((about, index) => (
            <div key={index} className="rounded-lg border border-gray-200 p-4 bg-white shadow-sm">
              <div className="mb-2 text-sm text-gray-500">
                公開URL: /about/{about.aboutSlug}
              </div>
              <AboutView about={about} />
            </div>
          ))}
        </div>
      )}
    </main>
  );
};

export default Page;
