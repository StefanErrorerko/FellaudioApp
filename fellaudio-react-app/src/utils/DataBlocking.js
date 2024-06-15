let blockedContentId = []
let blockedUserId = []

export const blockContentWithId = contentId => {
    blockedContentId.push(contentId)
    return blockedContentId
}

export const blockUserWithId = userId => {
    blockedUserId.push(userId)
    return blockedUserId
}

export const unblockContentWithId = contentId => {
    blockedContentId = blockedContentId.filter(c => c.id !== contentId);
}

export const unblockUserWithId = userId => {
    blockedUserId = blockedUserId.filter(u => u.id !== userId);
}

export const getBlockedContentIds = () => {return blockedContentId}
export const getBlockedUserIds = () => {return blockedUserId}