import type { IncomingMessage, ServerResponse } from "node:http";
import { handlePublicApi } from "../server/http.ts";
export default function handler(
  request: IncomingMessage,
  response: ServerResponse,
) {
  return handlePublicApi(request, response, "health");
}
