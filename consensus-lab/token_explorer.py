from http.server import BaseHTTPRequestHandler, HTTPServer
from urllib.parse import urlparse, parse_qs
from html import escape
import subprocess

TOKEN = "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707"
OWNER = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
RPC = "http://127.0.0.1:8545"

def call(method, *args):
    return subprocess.check_output(
        ["cast", "call", TOKEN, method,
         *args, "--rpc-url", RPC],
        text=True, timeout=5
    ).strip()

class Handler(BaseHTTPRequestHandler):

    def do_GET(self):
        params = parse_qs(urlparse(self.path).query)
        query = params.get("q", ["MNC"])[0].strip()

        try:
            if query.lower() not in (
                "mnc", TOKEN.lower(), "minichain coin"
            ):
                content = "<h2>Token not found</h2>"
            else:
                name = escape(call("name()(string)").strip('"'))
                symbol = escape(call("symbol()(string)").strip('"'))
                decimals = int(call("decimals()(uint8)").split()[0])

                supply = int(call(
                    "totalSupply()(uint256)"
                ).split()[0])

                balance = int(call(
                    "balanceOf(address)(uint256)", OWNER
                ).split()[0])

                content = f"""
                <h1>{name} ({symbol})</h1>
                <p>LOCAL EXPERIMENTAL TOKEN</p>
                <hr>
                <p>Total Supply</p>
                <h1>{supply // 10**decimals:,} MNC</h1>
                <p>Deployer Balance:
                {balance // 10**decimals:,} MNC</p>
                <p>Decimals: {decimals}</p>
                <p>Contract Address</p>
                <code>{TOKEN}</code>
                <p>Network: MiniChain Local</p>
                <p>Market Value: N/A</p>
                """

        except Exception:
            content = "<h2>Local node unavailable</h2>"

        page = f"""
        <!DOCTYPE html>
        <html>
        <head>
        <meta charset="utf-8">
        <title>MiniScan Token Explorer</title>
        <style>
        body {{
            background: #0b1220;
            color: #e2e8f0;
            font-family: Arial, sans-serif;
            max-width: 850px;
            margin: 60px auto;
            padding: 20px;
        }}
        main {{
            background: #17243a;
            padding: 35px;
            border-radius: 18px;
        }}
        input {{
            padding: 14px;
            width: 65%;
            border-radius: 8px;
        }}
        button {{
            padding: 14px 22px;
            background: #38bdf8;
            border: none;
            border-radius: 8px;
        }}
        h1 {{ color: #38bdf8; }}
        code {{ overflow-wrap: anywhere; }}
        </style>
        </head>
        <body>
        <h1>MiniScan</h1>
        <form method="GET">
        <input name="q" placeholder="Search token">
        <button>Search</button>
        </form>
        <br>
        <main>{content}</main>
        </body>
        </html>
        """

        self.send_response(200)
        self.send_header(
            "Content-Type", "text/html; charset=utf-8"
        )
        self.end_headers()
        self.wfile.write(page.encode())

print("MINISCAN TOKEN EXPLORER")
print("http://127.0.0.1:8081")

HTTPServer(
    ("127.0.0.1", 8081), Handler
).serve_forever()
