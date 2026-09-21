
// Patch Payload 
export type patchOpType = "replace" | "add" | "remove" | "copy" | "test";
export interface PatchPayload {
    value: string,
    path: string,
    op: patchOpType,
    from?: string
}