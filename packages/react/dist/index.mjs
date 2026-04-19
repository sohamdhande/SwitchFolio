// src/useSwitchfolio.ts
import { useState, useEffect, useCallback } from "react";
function useSwitchfolio(options) {
  const { apiKey, username, viewSlug, baseUrl = "https://switchfolio.app" } = options;
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fetchCount, setFetchCount] = useState(0);
  const refetch = useCallback(() => {
    setFetchCount((c) => c + 1);
  }, []);
  useEffect(() => {
    let cancelled = false;
    const fetchProjects = async () => {
      setLoading(true);
      setError(null);
      try {
        const url = `${baseUrl}/api/v1/projects?user=${encodeURIComponent(username)}&view=${encodeURIComponent(viewSlug)}`;
        const response = await fetch(url, {
          headers: { Authorization: `Bearer ${apiKey}` }
        });
        if (!response.ok) {
          const body = await response.json().catch(() => ({}));
          throw new Error(body.error ?? `HTTP ${response.status}`);
        }
        const projects = await response.json();
        if (!cancelled) {
          setData(projects);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Unknown error");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };
    fetchProjects();
    return () => {
      cancelled = true;
    };
  }, [apiKey, username, viewSlug, baseUrl, fetchCount]);
  return { data, loading, error, refetch };
}
export {
  useSwitchfolio
};
