/* exported createMessageObject */
function createMessageObject (
    message,
    date,
    sender,
    isRead,
    id
) {
    return {
        sender: sender,
        message: message,
        read: isRead,
        date: date,
        id: id
    };
}