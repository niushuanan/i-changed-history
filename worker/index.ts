import handler from "vinext/server/app-router-entry";
import {
  handleDeepSeekProxy,
  type DeepSeekProxyEnv,
  type WorkerExecutionContext,
} from "./deepseek-proxy";

type WorkerEnv = DeepSeekProxyEnv & {
  ASSETS: { fetch(request: Request): Promise<Response> };
};

const worker = {
  async fetch(
    request: Request,
    env: WorkerEnv,
    context: WorkerExecutionContext,
  ): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname === "/api/deepseek/completions") {
      return handleDeepSeekProxy(request, env, context);
    }
    return handler.fetch(request, env, context);
  },
};

export default worker;
