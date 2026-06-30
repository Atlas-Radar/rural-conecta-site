import { spawn } from "node:child_process";
import net from "node:net";

const HOST = "127.0.0.1";
const PORT = 4321;

function checkPortAvailable() {
  return new Promise((resolve, reject) => {
    const server = net.createServer();

    server.once("error", (error) => {
      reject(error);
    });

    server.once("listening", () => {
      server.close(() => resolve());
    });

    server.listen(PORT, HOST);
  });
}

function createAstroProcessConfig() {
  if (process.platform === "win32") {
    return {
      command: "cmd.exe",
      args: [
        "/d",
        "/s",
        "/c",
        `node_modules\\.bin\\astro.CMD dev --host ${HOST} --port ${PORT}`,
      ],
    };
  }

  return {
    command: "node_modules/.bin/astro",
    args: ["dev", "--host", HOST, "--port", String(PORT)],
  };
}

try {
  await checkPortAvailable();
} catch (error) {
  const code = error && typeof error === "object" && "code" in error ? error.code : "UNKNOWN";
  // eslint-disable-next-line no-console
  console.error(
    `Porta ${PORT} indisponível (${code}). A landing local deve rodar somente em http://${HOST}:${PORT}/ porque a API/CORS local aponta para essa origem. Encerre o processo nessa porta e tente novamente.`,
  );
  process.exit(1);
}

const astroProcess = createAstroProcessConfig();
const child = spawn(astroProcess.command, astroProcess.args, { stdio: "inherit" });

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 0);
});
