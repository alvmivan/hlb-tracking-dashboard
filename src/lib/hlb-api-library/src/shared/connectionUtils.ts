export type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export async function handleError(response: any) {
    if (!response.ok) {
        //response message
        console.error("response error status: ", response.status, " response data : ", response);
        const errorData = await response.text();
        console.error(errorData);
        throw new Error(errorData + 'Network response was not ok ' + "status code: " + response.status);
    }
}

export type ErrorData = { errorCode: number, details: string, isError: true };

export async function encapsulateEitherError<TReturnType>(response: any, okData: TReturnType):
    Promise<TReturnType | ErrorData> {
    if (response.ok) {
        return okData;
    }
    console.error("response error status: ", response.status, " response data : ", response);
    const errorData = await response.text();
    console.error(errorData);
    const errorCode = response.status;
    return {errorCode, details: errorData, isError: true};
}


export async function globalFetch<T>(url: string, method: HTTPMethod, body: T, extraHeaders: any = {}): Promise<Response> {
    const init: RequestInit = {
        method: method,
        headers: {
            'Content-Type': 'application/json',
            ...extraHeaders
        },
        body: body!==null ? JSON.stringify(body) : undefined
    }

    return fetch(url, init);
}

export const sendPost = async <T>(url: string, body: T, extraHeaders: any = {}): Promise<Response> => globalFetch(url, 'POST', body, extraHeaders);
export const sendGet = async <T>(url: string, extraHeaders: any = {}): Promise<Response> => globalFetch(url, 'GET', undefined, extraHeaders);
export const sendPut = async <T>(url: string, body: T, extraHeaders: any = {}): Promise<Response> => globalFetch(url, 'PUT', body, extraHeaders);
export const sendDelete = async <T>(url: string, extraHeaders: any = {}): Promise<Response> => globalFetch(url, 'DELETE', undefined, extraHeaders);






