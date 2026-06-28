export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  private: boolean;
  html_url: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  size: number; // in KB
  default_branch: string;
  fork: boolean;
  archived: boolean;
  updated_at: string;
}

export interface FetchProgress {
  type: "page" | "repo" | "rate_limit" | "error" | "done";
  message: string;
  repo?: GitHubRepo;
  page?: number;
  timestamp: string;
}

function getTimestamp(): string {
  return new Date().toLocaleTimeString("en-US", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export async function fetchAllRepos(
  username: string,
  token: string | null,
  onProgress: (progress: FetchProgress) => void
): Promise<GitHubRepo[]> {
  const repos: GitHubRepo[] = [];
  let page = 1;
  const perPage = 100;
  const headers: HeadersInit = {
    Accept: "application/vnd.github.v3+json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const endpoint = token
    ? "https://api.github.com/user/repos"
    : `https://api.github.com/users/${username}/repos`;

  while (true) {
    onProgress({
      type: "page",
      message: `fetching page ${page}...`,
      page,
      timestamp: getTimestamp(),
    });

    try {
      const url = `${endpoint}?per_page=${perPage}&page=${page}&sort=updated`;
      const res = await fetch(url, { headers });

      if (res.status === 403 || res.status === 429) {
        onProgress({
          type: "rate_limit",
          message: "rate limited — add a token for higher limits",
          timestamp: getTimestamp(),
        });
        break;
      }

      if (!res.ok) {
        onProgress({
          type: "error",
          message: `error ${res.status}: ${res.statusText}`,
          timestamp: getTimestamp(),
        });
        break;
      }

      const data: GitHubRepo[] = await res.json();

      if (data.length === 0) break;

      // Filter for the username if using token (returns all accessible repos)
      const userRepos = token
        ? data.filter(
            (r) => r.full_name.split("/")[0].toLowerCase() === username.toLowerCase()
          )
        : data;

      for (const repo of userRepos) {
        repos.push(repo);
        onProgress({
          type: "repo",
          message: repo.private ? `[private] ${repo.name}` : `✓ found ${repo.name}`,
          repo,
          timestamp: getTimestamp(),
        });
        // Small delay for visual effect
        await new Promise((r) => setTimeout(r, 60));
      }

      if (data.length < perPage) break;
      page++;
    } catch (err) {
      onProgress({
        type: "error",
        message: `network error: ${err instanceof Error ? err.message : "unknown"}`,
        timestamp: getTimestamp(),
      });
      break;
    }
  }

  onProgress({
    type: "done",
    message: `done — ${repos.length} repositories found`,
    timestamp: getTimestamp(),
  });

  return repos;
}

export async function downloadRepoZip(
  repo: GitHubRepo,
  token: string | null
): Promise<ArrayBuffer> {
  const headers: HeadersInit = {
    Accept: "application/vnd.github.v3+json",
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const url = `https://api.github.com/repos/${repo.full_name}/zipball/${repo.default_branch}`;
  const res = await fetch(url, { headers });

  if (!res.ok) {
    throw new Error(`Failed to download ${repo.name}: ${res.status}`);
  }

  return res.arrayBuffer();
}
