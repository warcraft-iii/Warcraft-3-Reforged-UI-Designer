export enum FrameType {
    ORIGIN = 0,
    BACKDROP = 1,
    BUTTON = 2,
    SCRIPT_DIALOG_BUTTON = 3,
    BROWSER_BUTTON = 4,
    CHECKLIST_BOX = 5,
    ESC_MENU_BACKDROP = 6,
    OPTIONS_POPUP_MENU_BACKDROP_TEMPLATE = 7,
    QUEST_BUTTON_BASE_TEMPLATE = 8,
    QUEST_BUTTON_DISABLED_BACKDROP_TEMPLATE = 9,
    QUEST_BUTTON_PUSHED_BACKDROP_TEMPLATE = 10,
    CHECKBOX = 11,
    INVIS_BUTTON = 12,
    TEXT_FRAME = 13,
    HORIZONTAL_BAR = 14,
    HOR_BAR_BACKGROUND = 15,
    HOR_BAR_TEXT = 16,
    HOR_BAR_BACKGROUND_TEXT = 17,
    TEXTAREA = 18,
    EDITBOX = 19,
}

export const FrameRequire = {
    TEXTAREA: `UI\\FrameDef\\UI\\escmenutemplates.fdf`,
    EDITBOX: `UI\\FrameDef\\UI\\escmenutemplates.fdf`,
}
