import { useMutation } from "convex/react";

import { api } from "@/convex/_generated/api";
import { useCallback, useMemo, useState } from "react";
import { Doc, Id } from "@/convex/_generated/dataModel";

// we want to know if there's any error
// we want to know if we succeeded, and if we did, what data did we get back

type RequestType = { id: Id<"workspaces">, name: string };
type ResponseType = Id<"workspaces"> | null;

// everytime we create a mutation, the data is passed thru here
type Options = {
    onSuccess?: (data: ResponseType) => void; 
    onError?: (error: Error) => void;
    onSettled?: () => void;
    throwError?:  boolean;
    //user can add to mutation, do something after it succeeds, error, or settled, basically regardless if we finish request, do this
};

export const useUpdateWorkspace = () => {

    const [data, setData] = useState<ResponseType>(null);
    const [error, setError] = useState<Error | null>(null);
    const [status, setStatus] = useState<"success" | "error" | "settled" | "pending" | null>(null);

    const isPending = useMemo(() => status ==="pending", [status]);
    const isSuccess = useMemo(() => status ==="success", [status]);
    const isError = useMemo(() => status ==="error", [status]);
    const isSettled = useMemo(() => status ==="settled", [status]);

    const mutation = useMutation(api.workspaces.update);

    const mutate = useCallback(async (values: RequestType, options?: Options) => { 
        try {
            setData(null);
            setError(null);
            setStatus("pending");


            const response = await mutation(values)
            options?.onSuccess?.(response);
            return response;
        } catch {
            setStatus("error");
            options?.onError?.(error as Error);
            if(options?.throwError) {
                throw error;
            }
        } finally {
            setStatus("settled");
            options?.onSettled?.();
        }

    }, [mutation]);

    // return mutate method
    return {
        mutate,
        data,
        error,
        isPending,
        isSettled,
        isError,
        isSuccess,
    };
};
