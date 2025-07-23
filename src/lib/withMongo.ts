import connectMongo from './mongodb';

/**
 * Higher-order function that wraps API handlers with automatic MongoDB connection
 * @param handler - The API route handler function
 * @returns A wrapped handler that automatically connects to MongoDB before execution
 */
export function withMongo<T extends (...args: any[]) => Promise<any>>(
    handler: T
): T {
    return (async (...args: any[]) => {
        try {
            // Automatically connect to MongoDB before running the handler
            await connectMongo();

            // Execute the original handler with all its arguments
            return await handler(...args);
        } catch (error) {
            console.error('Error in withMongo wrapper:', error);
            throw error;
        }
    }) as T;
}

export default withMongo;
