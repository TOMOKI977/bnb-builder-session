import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const STALLS = {
  portero: 9000,
  critico: 9001,
  cajero: 9002,
  escribano: 9003,
  conserje: 9004,
};

const dir = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PIZARRA_PORT || 5174);

async function proxy(port, reqPath, method, body) {
  const res = await fetch(`http://127.0.0.1:${port}${reqPath}`, {
    method,
    headers: { "content-type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  return {
    status: res.status,
    text: await res.text(),
  };
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url || "/", `http://${req.headers.host}`);
  res.setHeader("Access-Control-Allow-Origin", "*");
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.writeHead(204);
    res.end();
    return;
  }

  if (url.pathname === "/" || url.pathname === "/index.html") {
    res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
    res.end(fs.readFileSync(path.join(dir, "index.html")));
    return;
  }

  const match = url.pathname.match(/^\/api\/([a-z]+)\/(ping|work|card|quote)$/);
  if (!match) {
    res.writeHead(404);
    res.end("no");
    return;
  }

  const stall = match[1];
  const action = match[2];
  const port = STALLS[stall];
  if (!port) {
    res.writeHead(404, { "content-type": "application/json" });
    res.end(JSON.stringify({ error: "puesto desconocido" }));
    return;
  }

  try {
    if (action === "ping") {
      const out = await proxy(port, "/ping", "GET");
      res.writeHead(out.status, { "content-type": "application/json" });
      res.end(out.text);
      return;
    }
    if (action === "card") {
      const out = await proxy(port, "/.well-known/agent-card.json", "GET");
      res.writeHead(out.status, { "content-type": "application/json" });
      res.end(out.text);
      return;
    }
    if (action === "work" && req.method === "POST") {
      const chunks = [];
      for await (const chunk of req) chunks.push(chunk);
      const raw = Buffer.concat(chunks).toString("utf8") || "{}";
      const body = JSON.parse(raw);
      const out = await proxy(port, "/demo/work", "POST", body);
      res.writeHead(out.status, { "content-type": "application/json" });
      res.end(out.text);
      return;
    }
    if (action === "quote" && req.method === "POST") {
      const chunks = [];
      for await (const chunk of req) chunks.push(chunk);
      const raw = Buffer.concat(chunks).toString("utf8") || "{}";
      const body = JSON.parse(raw);
      const rpc = {
        jsonrpc: "2.0",
        id: 1,
        method: "message/send",
        params: {
          message: {
            role: "user",
            messageId: "nego-" + Date.now(),
            parts: [
              {
                kind: "data",
                data: {
                  skill: "negotiate",
                  task_description: body.task_description || "oficio de la feria",
                  terms: {
                    deliverables: body.deliverables || "trabajo del puesto",
                    quality_standards:
                      body.quality_standards || "castellano · no ejecutar",
                  },
                },
              },
            ],
          },
        },
      };
      const out = await proxy(port, "/", "POST", rpc);
      let ticket = { error: "quote ilegible", teatro: true };
      try {
        const j = JSON.parse(out.text);
        const data = j.result?.parts?.[0]?.data;
        const resp = data?.response;
        const sig = String(data?.provider_sig || "");
        ticket = {
          accepted: !!resp?.accepted,
          price: String(resp?.terms?.price ?? "0"),
          sig: sig ? sig.slice(0, 16) + "…" : "",
          chain_id: data?.chain_id ?? 97,
          teatro: "quote real · settle es teatro hasta el deploy",
        };
      } catch {
        /* keep ticket */
      }
      res.writeHead(out.status, { "content-type": "application/json" });
      res.end(JSON.stringify(ticket));
      return;
    }
    res.writeHead(405);
    res.end("method");
  } catch (e) {
    res.writeHead(502, { "content-type": "application/json" });
    res.end(
      JSON.stringify({
        error: "puesto cerrado",
        detail: e instanceof Error ? e.message : String(e),
      }),
    );
  }
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`pizarra  http://127.0.0.1:${PORT}/`);
});
