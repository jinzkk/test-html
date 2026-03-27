#!/usr/bin/env node
/**
 * Figma 이미지 에셋 Export 스크립트
 *
 * 사용법:
 *   node --env-file=.env scripts/figma-export.js \
 *     --url "https://www.figma.com/design/FILEKEY/..." \
 *     --page "wish-home" \
 *     --format png \
 *     --scale 2
 *
 * 옵션:
 *   --url     Figma 디자인 URL (필수)
 *   --page    저장 경로용 페이지명 (기본값: "contents")
 *   --format  이미지 포맷: png | jpg | svg | pdf (기본값: png)
 *   --scale   배율: 1 | 2 | 3 | 4 (기본값: 2)
 *   --force   기존 파일 덮어쓰기
 *   --node    특정 노드 ID 지정 (콤마 구분)
 */

"use strict";

const https = require("https");
const fs = require("fs");
const path = require("path");
const { URL } = require("url");

// ─────────────────────────────────────────────
// 1. CLI 인수 파싱
// ─────────────────────────────────────────────

/**
 * CLI 인수를 파싱하여 옵션 객체 반환
 * @returns {{ url: string, page: string, format: string, scale: number, force: boolean, nodeIds: string[] }}
 */
function parseArgs() {
  const args = process.argv.slice(2);
  const opts = {
    url: "https://www.figma.com/design/eHNm3zDt8ucf3v4vFEl4Hx/-%EC%A0%9C%EC%95%88--%ED%95%9C%EA%B5%AD%ED%88%AC%EC%9E%90%EC%8B%A0%ED%83%81%EC%9A%B4%EC%9A%A9?node-id=2-7&p=f&m=dev",
    page: "contents",
    format: "png",
    scale: 2,
    force: false,
    nodeIds: [],
  };

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case "--url":
        opts.url = args[++i];
        break;
      case "--page":
        opts.page = args[++i];
        break;
      case "--format":
        opts.format = args[++i];
        break;
      case "--scale":
        opts.scale = Number(args[++i]);
        break;
      case "--force":
        opts.force = true;
        break;
      case "--node":
        opts.nodeIds = args[++i].split(",").map((s) => s.trim());
        break;
    }
  }

  return opts;
}

// ─────────────────────────────────────────────
// 2. URL 파서 — fileKey / nodeId 추출
// ─────────────────────────────────────────────

/**
 * Figma URL에서 fileKey와 nodeId를 추출
 * 지원 형식:
 *   figma.com/design/:fileKey/:name?node-id=:nodeId
 *   figma.com/file/:fileKey/:name?node-id=:nodeId
 * @param {string} rawUrl
 * @returns {{ fileKey: string, nodeId: string | null }}
 */
function parseFigmaUrl(rawUrl) {
  let parsed;
  try {
    parsed = new URL(rawUrl);
  } catch {
    throw new Error(`올바르지 않은 URL입니다: ${rawUrl}`);
  }

  const segments = parsed.pathname.split("/").filter(Boolean);
  // 예: ['design', 'ABC123', 'file-name']  또는  ['file', 'ABC123', ...]
  const typeIdx = segments.findIndex((s) => s === "design" || s === "file");
  if (typeIdx === -1 || !segments[typeIdx + 1]) {
    throw new Error("Figma URL에서 fileKey를 찾을 수 없습니다.");
  }

  const fileKey = segments[typeIdx + 1];
  // node-id 파라미터의 '-'를 ':'으로 변환 (Figma API 형식)
  const rawNodeId = parsed.searchParams.get("node-id") || null;
  const nodeId = rawNodeId ? rawNodeId.replace(/-/g, ":") : null;

  return { fileKey, nodeId };
}

// ─────────────────────────────────────────────
// 3. Figma API 클라이언트
// ─────────────────────────────────────────────

/**
 * Figma REST API 호출 (Node.js 내장 https 모듈)
 * @param {string} endpoint  예: /v1/files/ABC123/nodes?ids=1:2
 * @param {string} token     Figma Personal Access Token
 * @returns {Promise<object>}
 */
function figmaRequest(endpoint, token) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: "api.figma.com",
      path: endpoint,
      method: "GET",
      headers: {
        "X-Figma-Token": token,
      },
    };

    const req = https.request(options, (res) => {
      // 429 Rate Limit 처리
      if (res.statusCode === 429) {
        const retryAfter = Number(res.headers["retry-after"] || 1);
        console.warn(`[경고] Rate Limit 도달. ${retryAfter}초 후 재시도...`);
        setTimeout(() => {
          figmaRequest(endpoint, token).then(resolve).catch(reject);
        }, retryAfter * 1000);
        return;
      }

      let body = "";
      res.on("data", (chunk) => {
        body += chunk;
      });
      res.on("end", () => {
        if (res.statusCode !== 200) {
          reject(new Error(`Figma API 오류 ${res.statusCode}: ${body}`));
          return;
        }
        try {
          resolve(JSON.parse(body));
        } catch {
          reject(new Error("응답 JSON 파싱 실패"));
        }
      });
    });

    req.on("error", reject);
    req.end();
  });
}

/**
 * 파일 메타데이터 조회
 * @param {string} fileKey
 * @param {string} token
 * @returns {Promise<{ name: string, lastModified: string }>}
 */
async function getFileMeta(fileKey, token) {
  const data = await figmaRequest(`/v1/files/${fileKey}?depth=1`, token);
  return { name: data.name, lastModified: data.lastModified };
}

/**
 * 특정 노드 트리 조회
 * @param {string} fileKey
 * @param {string[]} nodeIds
 * @param {string} token
 * @returns {Promise<object>}
 */
async function getNodes(fileKey, nodeIds, token) {
  const ids = nodeIds.map((id) => encodeURIComponent(id)).join(",");
  return figmaRequest(`/v1/files/${fileKey}/nodes?ids=${ids}`, token);
}

/**
 * 전체 파일 노드 트리 조회 (nodeIds 미지정 시)
 * @param {string} fileKey
 * @param {string} token
 * @returns {Promise<object>}
 */
async function getFullFile(fileKey, token) {
  return figmaRequest(`/v1/files/${fileKey}`, token);
}

/**
 * 이미지 Export URL 조회
 * @param {string} fileKey
 * @param {string[]} nodeIds
 * @param {string} format
 * @param {number} scale
 * @param {string} token
 * @returns {Promise<Record<string, string>>}  nodeId → S3 URL 맵
 */
async function getImageUrls(fileKey, nodeIds, format, scale, token) {
  const ids = nodeIds.map((id) => encodeURIComponent(id)).join(",");
  const endpoint = `/v1/images/${fileKey}?ids=${ids}&format=${format}&scale=${scale}`;
  const data = await figmaRequest(endpoint, token);
  if (data.err) throw new Error(`이미지 URL 조회 실패: ${data.err}`);
  return data.images || {};
}

// ─────────────────────────────────────────────
// 4. 노드 스캐너 — IMAGE fill 노드 추출
// ─────────────────────────────────────────────

/**
 * 노드 트리에서 IMAGE fill을 가진 노드를 재귀 탐색
 * @param {object} node  Figma 노드 객체
 * @param {object[]} results  수집 배열
 */
function scanImageNodes(node, results = []) {
  if (!node) return results;

  // fills 배열에 IMAGE 타입이 있는 노드 수집
  if (Array.isArray(node.fills)) {
    const hasImageFill = node.fills.some((f) => f.type === "IMAGE");
    if (hasImageFill) {
      results.push({ id: node.id, name: node.name || "untitled" });
    }
  }

  // 자식 노드 재귀 탐색
  if (Array.isArray(node.children)) {
    for (const child of node.children) {
      scanImageNodes(child, results);
    }
  }

  return results;
}

/**
 * Figma 파일 응답에서 이미지 노드 목록 추출
 * @param {object} fileData  getFullFile() 또는 getNodes() 응답
 * @returns {{ id: string, name: string }[]}
 */
function extractImageNodes(fileData) {
  const results = [];

  // getFullFile() 응답: document.children
  if (fileData.document) {
    scanImageNodes(fileData.document, results);
  }

  // getNodes() 응답: nodes[id].document
  if (fileData.nodes) {
    for (const nodeId of Object.keys(fileData.nodes)) {
      const nodeDoc = fileData.nodes[nodeId]?.document;
      if (nodeDoc) scanImageNodes(nodeDoc, results);
    }
  }

  return results;
}

// ─────────────────────────────────────────────
// 5. 파일명 생성기
// ─────────────────────────────────────────────

/**
 * Figma 노드명을 kebab-case 파일명으로 변환
 * @param {string} name
 * @param {string} format  파일 확장자
 * @returns {string}
 */
function toFileName(name, format) {
  const base = name
    .replace(/[\/\\|]/g, "-") // 슬래시, 백슬래시, 파이프 → 하이픈
    .replace(/[^a-zA-Z0-9\s-]/g, "") // 영문/숫자/공백/하이픈 외 제거
    .replace(/\s+/g, "-") // 공백 → 하이픈
    .replace(/-+/g, "-") // 연속 하이픈 정리
    .replace(/^-|-$/g, "") // 앞뒤 하이픈 제거
    .toLowerCase();

  return `${base || "image"}.${format}`;
}

// ─────────────────────────────────────────────
// 6. 저장 경로 결정기
// ─────────────────────────────────────────────

/** 공통 이미지로 분류할 키워드 */
const COMMON_KEYWORDS = [
  "logo",
  "common",
  "header",
  "footer",
  "icon",
  "gnb",
  "nav",
];

/**
 * 노드명과 페이지명 기반으로 저장 경로 결정
 * @param {string} nodeName
 * @param {string} pageName
 * @returns {{ dir: string, isCommon: boolean }}
 */
function resolveDestDir(nodeName, pageName) {
  const lower = nodeName.toLowerCase();
  const isCommon = COMMON_KEYWORDS.some((kw) => lower.includes(kw));

  const dir = isCommon
    ? path.join("img", "common")
    : path.join("img", "contents", pageName);

  return { dir, isCommon };
}

// ─────────────────────────────────────────────
// 7. 이미지 다운로더
// ─────────────────────────────────────────────

/**
 * URL에서 파일을 스트림으로 다운로드 (리다이렉트 추적)
 * @param {string} fileUrl  S3 또는 CDN URL
 * @param {string} destPath 저장 경로
 * @returns {Promise<number>}  저장된 파일 크기(bytes)
 */
function downloadFile(fileUrl, destPath) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(fileUrl);
    const options = {
      hostname: parsed.hostname,
      path: parsed.pathname + parsed.search,
      method: "GET",
      headers: { "User-Agent": "figma-export-script/1.0" },
    };

    const makeRequest = (url) => {
      const mod = url.startsWith("https") ? https : require("http");
      mod
        .get(url, (res) => {
          // 3xx 리다이렉트 처리
          if (
            res.statusCode >= 300 &&
            res.statusCode < 400 &&
            res.headers.location
          ) {
            makeRequest(res.headers.location);
            return;
          }
          if (res.statusCode !== 200) {
            reject(new Error(`다운로드 실패 (${res.statusCode}): ${url}`));
            return;
          }

          // 저장 디렉토리 생성
          fs.mkdirSync(path.dirname(destPath), { recursive: true });

          const fileStream = fs.createWriteStream(destPath);
          let size = 0;

          res.on("data", (chunk) => {
            size += chunk.length;
          });
          res.pipe(fileStream);
          fileStream.on("finish", () => resolve(size));
          fileStream.on("error", reject);
          res.on("error", reject);
        })
        .on("error", reject);
    };

    makeRequest(fileUrl);
  });
}

// ─────────────────────────────────────────────
// 8. 리포트 출력
// ─────────────────────────────────────────────

/**
 * 바이트 크기를 사람이 읽기 쉬운 형식으로 변환
 * @param {number} bytes
 * @returns {string}
 */
function formatSize(bytes) {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)}MB`;
}

/**
 * 완료 리포트 및 HTML 태그 제안 출력
 * @param {{ destPath: string, nodeName: string, size: number, skipped: boolean }[]} results
 * @param {string} format
 */
function printReport(results, format) {
  console.log("\n[HTML 태그 제안]");

  const imgResults = results.filter((r) => !r.skipped);
  if (imgResults.length === 0) {
    console.log("  (다운로드된 이미지 없음)");
    return;
  }

  for (const r of imgResults) {
    // HTML에서의 상대 경로 (html/ 폴더 기준)
    const srcPath = "../" + r.destPath.replace(/\\/g, "/");
    const altText = r.nodeName;
    console.log(`  <img src="${srcPath}" alt="${altText}" />`);
  }
}

// ─────────────────────────────────────────────
// 9. 메인 실행 흐름
// ─────────────────────────────────────────────

async function main() {
  const opts = parseArgs();

  // 토큰 확인
  const token = process.env.FIGMA_TOKEN || "";
  if (!token || token.startsWith("figd_xxx")) {
    console.error("[오류] FIGMA_TOKEN이 설정되지 않았습니다.");
    console.error("");
    console.error("Figma Personal Access Token 발급 방법:");
    console.error("  1. Figma 접속 → 우측 상단 프로필 클릭");
    console.error("  2. Settings → Security → Personal access tokens");
    console.error("  3. 토큰 생성 후 .env 파일에 저장:");
    console.error("     FIGMA_TOKEN=figd_실제토큰값");
    process.exit(1);
  }

  // URL 확인
  if (!opts.url) {
    console.error("[오류] --url 옵션이 필요합니다.");
    console.error(
      '예시: node --env-file=.env scripts/figma-export.js --url "https://www.figma.com/design/..." --page "wish-home"',
    );
    process.exit(1);
  }

  // URL 파싱
  let fileKey, nodeId;
  try {
    ({ fileKey, nodeId } = parseFigmaUrl(opts.url));
  } catch (err) {
    console.error(`[오류] ${err.message}`);
    process.exit(1);
  }

  console.log("[Figma Export] 시작");

  // 파일 메타데이터 조회
  let fileMeta;
  try {
    fileMeta = await getFileMeta(fileKey, token);
    console.log(`- 파일: ${fileMeta.name}`);
  } catch (err) {
    console.error(`[오류] 파일 메타데이터 조회 실패: ${err.message}`);
    process.exit(1);
  }

  // 노드 트리 조회
  let imageNodes = [];

  if (opts.nodeIds.length > 0) {
    // --node 플래그로 직접 지정한 경우
    imageNodes = opts.nodeIds.map((id) => ({ id, name: id }));
    console.log(`- 지정된 노드: ${imageNodes.length}개`);
  } else if (nodeId) {
    // URL에 node-id가 포함된 경우
    try {
      const nodesData = await getNodes(fileKey, [nodeId], token);
      imageNodes = extractImageNodes(nodesData);
      // IMAGE fill이 없어도 지정 노드 자체를 내보내기 대상으로 추가
      if (imageNodes.length === 0) {
        const nodeName = nodesData.nodes?.[nodeId]?.document?.name || nodeId;
        imageNodes = [{ id: nodeId, name: nodeName }];
      }
    } catch (err) {
      console.error(`[오류] 노드 조회 실패: ${err.message}`);
      process.exit(1);
    }
  } else {
    // 전체 파일 스캔
    console.log("- 전체 파일에서 이미지 노드 탐색 중...");
    try {
      const fileData = await getFullFile(fileKey, token);
      imageNodes = extractImageNodes(fileData);
    } catch (err) {
      console.error(`[오류] 파일 조회 실패: ${err.message}`);
      process.exit(1);
    }
  }

  if (imageNodes.length === 0) {
    console.log("\n[안내] IMAGE fill을 가진 노드를 찾을 수 없습니다.");
    console.log(
      "  - Figma에서 이미지가 fill로 적용된 프레임/레이어를 선택하세요.",
    );
    console.log("  - 또는 --node 옵션으로 특정 노드 ID를 직접 지정하세요.");
    process.exit(0);
  }

  console.log(`- 발견된 이미지 노드: ${imageNodes.length}개\n`);

  // Export URL 조회
  const nodeIdList = imageNodes.map((n) => n.id);
  let imageUrls;
  try {
    imageUrls = await getImageUrls(
      fileKey,
      nodeIdList,
      opts.format,
      opts.scale,
      token,
    );
  } catch (err) {
    console.error(`[오류] 이미지 URL 조회 실패: ${err.message}`);
    process.exit(1);
  }

  // 이미지 다운로드
  const results = [];

  for (const node of imageNodes) {
    const exportUrl = imageUrls[node.id];
    if (!exportUrl) {
      console.warn(`  [스킵] ${node.name} — Export URL 없음`);
      results.push({
        destPath: "",
        nodeName: node.name,
        size: 0,
        skipped: true,
      });
      continue;
    }

    const fileName = toFileName(node.name, opts.format);
    const { dir } = resolveDestDir(node.name, opts.page);
    const destPath = path.join(dir, fileName);

    // 파일 존재 여부 확인
    if (fs.existsSync(destPath) && !opts.force) {
      console.log(
        `  [스킵] ${node.name} → ${destPath} (이미 존재, --force로 덮어쓰기 가능)`,
      );
      results.push({ destPath, nodeName: node.name, size: 0, skipped: true });
      continue;
    }

    // 다운로드
    try {
      const size = await downloadFile(exportUrl, destPath);
      console.log(`  ✓ ${node.name} → ${destPath} (${formatSize(size)})`);
      results.push({ destPath, nodeName: node.name, size, skipped: false });
    } catch (err) {
      console.error(`  ✗ ${node.name} — 다운로드 실패: ${err.message}`);
      results.push({ destPath, nodeName: node.name, size: 0, skipped: true });
    }
  }

  // 완료 리포트
  printReport(results, opts.format);
}

main().catch((err) => {
  console.error(`\n[치명적 오류] ${err.message}`);
  if (process.env.DEBUG) console.error(err.stack);
  process.exit(1);
});
