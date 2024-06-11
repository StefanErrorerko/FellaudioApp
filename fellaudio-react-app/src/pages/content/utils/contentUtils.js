export const sortComments = (comments) => {
    const sortedComments = comments?.slice().sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0);
        const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0);
        return dateA - dateB;
    });
    return sortedComments
}