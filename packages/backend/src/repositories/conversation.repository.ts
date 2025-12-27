/** Implementation of conversation repository 
 * export public interface to get and set last response id for a conversation
*/

// let lastResponseId: string | null = null;
const conversations = new Map<string, string>();

// export public interface to interact with conversations
// export const getLastResponseId = (conversationId: string) => {
//     return conversations.get(conversationId) || null;
// }

// export const setLastResponseId = (conversationId: string, responseId: string) => {
//     conversations.set(conversationId, responseId);
// }

// object of two methods to be used in other files
export const conversationRepository = {
    getLastResponseId(conversationId: string) {
    return conversations.get(conversationId) || null;
},
setLastResponseId (conversationId: string, responseId: string) {
    conversations.set(conversationId, responseId);
}
}