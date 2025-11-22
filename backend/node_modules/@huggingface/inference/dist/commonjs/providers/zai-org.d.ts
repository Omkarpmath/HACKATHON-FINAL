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
import { BaseConversationalTask } from "./providerHelper.js";
import type { HeaderParams } from "../types.js";
export declare class ZaiConversationalTask extends BaseConversationalTask {
    constructor();
    prepareHeaders(params: HeaderParams, binary: boolean): Record<string, string>;
    makeRoute(): string;
}
//# sourceMappingURL=zai-org.d.ts.map