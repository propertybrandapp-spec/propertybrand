import { AwsClient } from "aws4fetch";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: corsHeaders(request),
      });
    }

    // POST /presign
    if (url.pathname === "/presign" && request.method === "POST") {
      return handlePresign(request, env);
    }

    // GET /file/:key
    if (url.pathname.startsWith("/file/") && request.method === "GET") {
      return handleFileGet(request, env);
    }

    return new Response("Not found", {
      status: 404,
      headers: corsHeaders(request),
    });
  },
};

// ── Presign endpoint ────────────────────────────────────────────────────────
async function handlePresign(request, env) {
  const authHeader = request.headers.get("Authorization");

  if (!authHeader) {
    return json(
      { error: "Missing Authorization header" },
      401,
      request
    );
  }

  const body = await request.json();
  const { fileName, fileType, folder } = body;

  if (!fileName || !fileType || !folder) {
    return json(
      {
        error: "fileName, fileType, and folder are required",
      },
      400,
      request
    );
  }

  const ALLOWED_FOLDERS = [
    "listings",
    "blog",
    "avatars",
    "agents",
  ];

  if (!ALLOWED_FOLDERS.includes(folder)) {
    return json(
      {
        error: `folder must be one of: ${ALLOWED_FOLDERS.join(", ")}`,
      },
      400,
      request
    );
  }

  const ALLOWED_TYPES = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/avif",
  ];

  if (!ALLOWED_TYPES.includes(fileType)) {
    return json(
      {
        error: "Only image uploads are allowed",
      },
      400,
      request
    );
  }

  const safeFileName = fileName.replace(
    /[^a-zA-Z0-9._-]/g,
    "_"
  );

  const key = `${folder}/${Date.now()}-${crypto
    .randomUUID()
    .slice(0, 8)}-${safeFileName}`;

  const client = new AwsClient({
    accessKeyId: env.R2_ACCESS_KEY_ID,
    secretAccessKey: env.R2_SECRET_ACCESS_KEY,
  });

  const r2Endpoint =
    `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com/` +
    `${env.R2_BUCKET_NAME}/${key}`;

  const signedRequest = await client.sign(
    new Request(r2Endpoint, {
      method: "PUT",
      headers: {
        "Content-Type": fileType,
      },
    }),
    {
      aws: { signQuery: true },
      expiresIn: 300,
    }
  );

  return json(
    {
      uploadUrl: signedRequest.url,
      key,
      publicUrl: `${env.R2_PUBLIC_BASE_URL}/${key}`,
    },
    200,
    request
  );
}

// ── Public file read proxy ─────────────────────────────────────────────────
async function handleFileGet(request, env) {
  const url = new URL(request.url);
  const key = decodeURIComponent(
    url.pathname.replace("/file/", "")
  );

  const object = await env.R2_BUCKET.get(key);

  if (!object) {
    return new Response("Not found", {
      status: 404,
      headers: corsHeaders(request),
    });
  }

  const headers = new Headers(
    corsHeaders(request)
  );

  object.writeHttpMetadata(headers);
  headers.set("etag", object.httpEtag);
  headers.set(
    "cache-control",
    "public, max-age=31536000, immutable"
  );

  return new Response(object.body, {
    headers,
  });
}

// ── Helpers ────────────────────────────────────────────────────────────────
function corsHeaders(request) {
  const origin = request.headers.get("Origin");

  const allowedOrigins = [
    "http://localhost:5173",
    "https://propertybrand.vercel.app",
  ];

  return {
    "Access-Control-Allow-Origin":
      allowedOrigins.includes(origin)
        ? origin
        : "",
    "Access-Control-Allow-Methods":
      "GET, POST, PUT, OPTIONS",
    "Access-Control-Allow-Headers":
      "Content-Type, Authorization",
  };
}

function json(data, status, request) {
  return new Response(
    JSON.stringify(data),
    {
      status,
      headers: {
        "Content-Type":
          "application/json",
        ...corsHeaders(request),
      },
    }
  );
}