import { NextRequest, NextResponse } from "next/server";
import { runProductResearch as runResearch } from "@/agents/agent1-research";
import { runPricing } from "@/agents/agent2-pricing";
import { runInventory } from "@/agents/agent3-inventory";
import { runOrderFulfillment } from "@/agents/agent4-fulfillment";
import { runShipping } from "@/agents/agent5-shipping";
import { runDeliveryConfirmation } from "@/agents/agent6-delivery";
import { runSEOOptimization } from "@/agents/agent7-seo";
import { runReporting } from "@/agents/agent8-reporting";
import { runReviewRequests } from "@/agents/agent9-reviews";
import { runAnalyticsAlert } from "@/agents/agent10-analytics";

const agentMap: Record<string, () => Promise<unknown>> = {
  research: runResearch,
  pricing: runPricing,
  inventory: runInventory,
  fulfillment: runOrderFulfillment,
  shipping: runShipping,
  delivery: runDeliveryConfirmation,
  seo: runSEOOptimization,
  reporting: runReporting,
  reviews: runReviewRequests,
  analytics: runAnalyticsAlert,
};

export async function POST(req: NextRequest) {
  const { agent, secret } = await req.json();

  if (secret !== process.env.AGENT_SECRET && process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const fn = agentMap[agent];
  if (!fn) {
    return NextResponse.json({ error: "Unknown agent: " + agent }, { status: 400 });
  }

  try {
    const result = await fn();
    return NextResponse.json({ success: true, agent, result });
  } catch (error) {
    return NextResponse.json({ success: false, agent, error: String(error) }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ agents: Object.keys(agentMap) });
}
