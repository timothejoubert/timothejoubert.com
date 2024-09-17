enum EventType {
    RESIZE = 'resize',
    ABOUT_TRANSITION_ENTERED = 'aboutTransitionEntered',
    SETTING_TRANSITION_END = 'settingTransitionEnd',
    PAGE_MOUNTED = 'pageMounted',
    BLOCK_MOUNTED = 'blockMounted',
    BLOCK_BEFORE_DESTROY = 'blockBeforeDestroy',
    PAGE_UPDATED = 'pageUpdated',
    PAGE_TRANSITION_LEAVE = 'pageTransitionLeave',
    PAGE_TRANSITION_AFTER_LEAVE = 'pageTransitionAfterLeave',
    PAGE_TRANSITION_ENTER = 'pageTransitionEnter',
    PAGE_TRANSITION_AFTER_ENTER = 'pageTransitionAfterEnter',
}

export default EventType
