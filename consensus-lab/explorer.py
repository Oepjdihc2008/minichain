import json
import urllib.request
import html
from http.server import BaseHTTPRequestHandler, HTTPServer

RPC = "http://127.0.0.1:8545"

def rpc(method, params=[]):
    payload = json.dumps({
        "jsonrpc": "2.0",
        "id": 1,
        "method": method,
        "params": params
    }).encode()

    req = urllib.request.Request(
        RPC, data=payload,
        headers={"Content-Type": "application/json"}
    )

    with urllib.request.urlopen(req, timeout=5) as r:
        response = json.load(r)
        return response["result"]

class Explorer(BaseHTTPRequestHandler):

    def do_GET(self):
        try:
            chain_id = int(rpc("eth_chainId"), 16)
            if chain_id != 31337:
                raise ValueError("Incorrect network")

            height = int(rpc("eth_blockNumber"), 16)
            rows = ""

            for n in range(height, max(-1, height-50), -1):
                b = rpc("eth_getBlockByNumber", [hex(n), False])
                txs = b["transactions"]

                details = "".join(
                    f"<p>{html.escape(tx)}</p>"
                    for tx in txs
                )

                rows += f"""
                <tr>
                    <td>#{n}</td>
                    <td>{html.escape(b['hash'])}</td>
                    <td>{len(txs)}</td>
                    <td><details><summary>View</summary>
                    {details}</details></td>
                </tr>"""

            page = f"""<!DOCTYPE html>
            <html><head>
            <meta charset="utf-8">
            <meta http-equiv="refresh" content="5">
            <title>MiniScan</title>
            <style>
            body {{background:#090e17;color:#e2e8f0;
            font-family:system-ui;padding:40px}}
            h1 {{color:#60a5fa}}
            section {{background:#151e2e;padding:24px;
            border-radius:12px;margin:20px 0}}
            table {{width:100%;border-collapse:collapse}}
            td,th {{padding:16px;text-align:left;
            border-bottom:1px solid #334155;
            overflow-wrap:anywhere}}
            small {{color:#94a3b8}}
            </style></head><body>
            <h1>MiniScan</h1>
            <small>LOCAL EVM EXPLORER</small>
            <section>
            <h2>Network Online</h2>
            Chain ID: {chain_id}
            <h2>Latest Block: {height}</h2>
            </section>
            <section><h2>Latest Blocks</h2>
            <table><tr><th>Block</th><th>Hash</th>
            <th>Transactions</th><th>Details</th></tr>
            {rows}</table></section>
            </body></html>"""

            self.send_response(200)
            self.send_header("Content-Type", "text/html")
            self.end_headers()
            self.wfile.write(page.encode())

        except Exception:
            self.send_error(503, "Local node unavailable")

print("MiniScan: http://127.0.0.1:8080")
HTTPServer(("127.0.0.1", 8080), Explorer).serve_forever()
