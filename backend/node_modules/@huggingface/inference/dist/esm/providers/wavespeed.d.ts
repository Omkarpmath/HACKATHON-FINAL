import type { TextToImageArgs } from "../tasks/cv/textToImage.js";
import type { ImageToImageArgs } from "../tasks/cv/imageToImage.js";
import type { TextToVideoArgs } from "../tasks/cv/textToVideo.js";
import type { ImageToVideoArgs } from "../tasks/cv/imageToVideo.js";
import type { BodyParams, RequestArgs, UrlParams } from "../types.js";
import type { TextToImageTaskHelper, TextToVideoTaskHelper, ImageToImageTaskHelper, ImageToVideoTaskHelper } from "./providerHelper.js";
import { TaskProviderHelper } from "./providerHelper.js";
/**
 * Response structure for initial task submission
 */
interface WaveSpeedAISubmitResponse {
    id: string;
    urls: {
        get: string;
    };
}
/**
 * Response structure for WaveSpeed AI API with submit response data
 */
interface WaveSpeedAISubmitTaskResponse {
    code: number;
    message: string;
    data: WaveSpeedAISubmitResponse;
}
declare abstract class WavespeedAITask extends TaskProviderHelper {
    constructor(url?: string);
    makeRoute(params: UrlParams): string;
    preparePayload(params: BodyParams<ImageToImageArgs | TextToImageArgs | TextToVideoArgs | ImageToVideoArgs>): Record<string, unknown>;
    getResponse(response: WaveSpeedAISubmitTaskResponse, url?: string, headers?: Record<string, string>): Promise<Blob>;
}
export declare class WavespeedAITextToImageTask extends WavespeedAITask implements TextToImageTaskHelper {
    constructor();
}
export declare class WavespeedAITextToVideoTask extends WavespeedAITask implements TextToVideoTaskHelper {
    constructor();
}
export declare class WavespeedAIImageToImageTask extends WavespeedAITask implements ImageToImageTaskHelper {
    constructor();
    preparePayloadAsync(args: ImageToImageArgs): Promise<RequestArgs>;
}
export declare class WavespeedAIImageToVideoTask extends WavespeedAITask implements ImageToVideoTaskHelper {
    constructor();
    preparePayloadAsync(args: ImageToVideoArgs): Promise<RequestArgs>;
}
export {};
//# sourceMappingURL=wavespeed.d.ts.map