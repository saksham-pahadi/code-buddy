import { NextRequest, NextResponse } from "next/server";

const allowedExtensions = [
  ".js",
  ".ts",
  ".tsx",
  ".jsx",
  ".py",
  ".java",
  "cpp",
  ".c",
  ".cs",
  ".go",
  ".rb",
  ".php",
  ".html",
  ".css",
  ".scss",
  ".md",
  ".json",
  ".config.js" ,
  ".config.ts" ,
  ".config.mjs" ,

];

const ignoredFolders = ["node_modules", ".git", ".next", "dist", "build"];

async function getRepoContents(
  owner: string,
  repo: string,
  path = "",
  files: any[] = [],
) {
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    },
  });

  const data = await res.json();

  if (!Array.isArray(data)) return files;

  for (const item of data) {
    // Ignore folders
    if (item.type === "dir" && ignoredFolders.includes(item.name)) {
      continue;
    }

    // Open folders recursively
    if (item.type === "dir") {
      await getRepoContents(owner, repo, item.path, files);
    }

    // Read allowed files only
    if (item.type === "file") {
      const isAllowed = allowedExtensions.some((ext) =>
        item.name.endsWith(ext),
      );

      if (!isAllowed) continue;

      // Skip huge files
      if (item.size > 50000) continue;

      const fileRes = await fetch(item.download_url);

      const code = await fileRes.text();

      files.push({
        name: item.name,
        path: item.path,
        code,
      });
    }
  }

  return files;
}

export async function POST(req: NextRequest) {
  try {
    const { repoUrl } = await req.json();

    // Extract owner + repo
    const parts = repoUrl.replace("https://github.com/", "").split("/");

    const owner = parts[0];
    const repo = parts[1];

    if (!owner || !repo) {
      return NextResponse.json(
        { error: "Invalid GitHub URL" },
        { status: 400 },
      );
    }

    const files = await getRepoContents(owner, repo);

    return NextResponse.json({
        owner,
        name: repo,
      success: true,
      totalFiles: files.length,
      files,
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
