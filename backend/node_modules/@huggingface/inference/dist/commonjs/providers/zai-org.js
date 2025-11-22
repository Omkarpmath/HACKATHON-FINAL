"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZaiConversationalTask = void 0;
/**
 * See the registered mapping of HF model ID => ZAI model ID here:
 *
 * https://huggingface.co/api/partners/zai-org/models
 *
 * This is a publicly available mapping.
 *
 * If you want to try to run inference for a new model locally before it's registered on huggingface.co,
 * you can add it to the dictionary "HARDCODED_MODEL_ID_MAPPING" in consts.ts, for dev purposes.
 *
 * - If you work at zai and want to update this mapping, please use the model mapping API we provide on huggingface.co
 * - If you're a community member and want to add a new supported HF model to zai, please open an issue on the present repo
 * and we will tag zai team members.
 *
 * Thanks!
 */
const providerHelper_js_1 = require("./providerHelper.js");
const ZAI_API_BASE_URL = "https://api.z.ai";
class ZaiConversationalTask extends providerHelper_js_1.BaseConversationalTask {
    constructor() {
        super("zai-org", ZAI_API_BASE_URL);
    }
    prepareHeaders(params, binary) {
        const headers = super.prepareHeaders(params, binary);
        headers["x-source-channel"] = "hugging_face";
        headers["accept-language"] = "en-US,en";
        return headers;
    }
    makeRoute() {
        return "/api/paas/v4/chat/completions";
    }
}
exports.ZaiConversationalTask = ZaiConversationalTask;
