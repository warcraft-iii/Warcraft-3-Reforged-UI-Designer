/* eslint-disable @typescript-eslint/no-explicit-any */
import { Export } from "../Classes & Functions/Export";
import { FrameBuilder } from "./FrameLogic/FrameBuilder";
import { FrameType } from "./FrameLogic/FrameType";
import { RibbonMenu } from "./Menus/RibbonMenu";
import { RibbonOption } from "./Menus/RibbonOption";
import { TabsMenu } from "./Menus/TabsMenu";
import { ParameterEditor } from "./ParameterEditor";
import { ProjectTree } from "./ProjectTree";
import { ICallableDivInstance } from "../Classes & Functions/ICallableDivInstance";
import { debugText } from '../Classes & Functions/Mini-Functions'
import Save from "../Persistence/Save";
import Load from "../Persistence/Load";
import ChangeStack from "./ChangeStack";
import Undo from "../Commands/Undo";
import Redo from "../Commands/Redo";
import CreateFrameAtSelected from "../Commands/Implementation/CreateFrameAtSelected";

export class Editor {

    //Application bars      
    public readonly panelDebug: HTMLElement;

    public readonly btnCloseTreePanel: HTMLButtonElement;
    public readonly btnCloseParameterPanel: HTMLButtonElement;

    //Workspace
    public readonly workspaceImage: HTMLImageElement;
    public readonly workspace: HTMLElement;

    //Debug
    public readonly debugLine: HTMLElement;
    public readonly debugGameCoordinates: HTMLElement;

    //functional units
    public readonly projectTree: ProjectTree;
    public readonly changeStack : ChangeStack;
    public readonly parameterEditor: ParameterEditor;
    public readonly tabsMenu: TabsMenu;    

    //UI
    public readonly treeButton: HTMLButtonElement;
    public readonly panelButton: HTMLButtonElement;

    private initializeMenus(): TabsMenu {

        const tabsMenu = new TabsMenu();

        const fileMenu = new RibbonMenu('File')
        const editMenu = new RibbonMenu('Edit');
        const viewMenu = new RibbonMenu('View');
        const insertMenu = new RibbonMenu('Insert');
        const windowMenu = new RibbonMenu('Window');

        tabsMenu.addTab(fileMenu);
        tabsMenu.addTab(editMenu);
        tabsMenu.addTab(viewMenu);
        tabsMenu.addTab(insertMenu);
        tabsMenu.addTab(windowMenu);

        fileMenu.addRibbonOption(new RibbonOption('New', new RibbonOptionsNew()));
        fileMenu.addRibbonOption(new RibbonOption('Open', new Load()));
        fileMenu.addRibbonOption(new RibbonOption('Save', new Save()));
        fileMenu.addRibbonOption(new RibbonOption('Export', new Export()));

        editMenu.addRibbonOption(new RibbonOption('Undo', new Undo()));
        editMenu.addRibbonOption(new RibbonOption('Redo', new Redo()));

        viewMenu.addRibbonOption(new RibbonOption('Color Theme(Not made)', null));

        windowMenu.addRibbonOption(new RibbonOption('About(Not made)', null));

        let newFrameBuilder = new FrameBuilder(true);
        newFrameBuilder.texture = './files/images/CustomFrame.png';
        newFrameBuilder.type = FrameType.BACKDROP;
        insertMenu.addRibbonOption(new RibbonOption('Custom Frame', new CreateFrameAtSelected(newFrameBuilder)));

        newFrameBuilder = new FrameBuilder(true);
        newFrameBuilder.type = FrameType.TEXT_FRAME;
        newFrameBuilder.text = "Text Frame"
        insertMenu.addRibbonOption(new RibbonOption('Custom Text', new CreateFrameAtSelected(newFrameBuilder)));

        newFrameBuilder = new FrameBuilder(true);
        newFrameBuilder.texture = './files/images/ScriptDialogButton.png';
        newFrameBuilder.type = FrameType.SCRIPT_DIALOG_BUTTON;
        insertMenu.addRibbonOption(new RibbonOption('Script Dialog Button', new CreateFrameAtSelected(newFrameBuilder)));

        newFrameBuilder = new FrameBuilder(true);
        newFrameBuilder.texture = './files/images/BrowserButton.png';
        newFrameBuilder.type = FrameType.BROWSER_BUTTON;
        insertMenu.addRibbonOption(new RibbonOption('Browser Button', new CreateFrameAtSelected(newFrameBuilder)));

        // here mr insanity:
        newFrameBuilder = new FrameBuilder(true);
        newFrameBuilder.texture = './files/images/InvisButton.png';
        newFrameBuilder.type = FrameType.INVIS_BUTTON;
        insertMenu.addRibbonOption(new RibbonOption('Invis Button', new CreateFrameAtSelected(newFrameBuilder)));
        //end of mr insanity.

        newFrameBuilder = new FrameBuilder(true);
        newFrameBuilder.texture = './files/images/QuestCheckBox.png';
        newFrameBuilder.type = FrameType.QUEST_CHECKBOX;
        insertMenu.addRibbonOption(new RibbonOption('Quest Check Box', new CreateFrameAtSelected(newFrameBuilder)));

        newFrameBuilder = new FrameBuilder(true);
        newFrameBuilder.texture = './files/images/CheckListBox.png';
        newFrameBuilder.type = FrameType.CHECKLIST_BOX;
        insertMenu.addRibbonOption(new RibbonOption('Checklist Box', new CreateFrameAtSelected(newFrameBuilder)));

        newFrameBuilder = new FrameBuilder(true);
        newFrameBuilder.texture = './files/images/OptionsPopupMenuBackdropTemplate.png';
        newFrameBuilder.type = FrameType.OPTIONS_POPUP_MENU_BACKDROP_TEMPLATE;
        insertMenu.addRibbonOption(new RibbonOption('Options Popup Menu Backdrop', new CreateFrameAtSelected(newFrameBuilder)));

        newFrameBuilder = new FrameBuilder(true);
        newFrameBuilder.texture = './files/images/QuestButtonBaseTemplate.png';
        newFrameBuilder.type = FrameType.QUEST_BUTTON_BASE_TEMPLATE;
        insertMenu.addRibbonOption(new RibbonOption('Quest Button Base', new CreateFrameAtSelected(newFrameBuilder)));

        newFrameBuilder = new FrameBuilder(true);
        newFrameBuilder.texture = './files/images/QuestButtonPushedBackdropTemplate.png';
        newFrameBuilder.type = FrameType.QUEST_BUTTON_PUSHED_BACKDROP_TEMPLATE;
        insertMenu.addRibbonOption(new RibbonOption('Quest Button Pushed Backdrop', new CreateFrameAtSelected(newFrameBuilder)));

        newFrameBuilder = new FrameBuilder(true);
        newFrameBuilder.texture = './files/images/QuestButtonDisabledBackdropTemplate.png';
        newFrameBuilder.type = FrameType.QUEST_BUTTON_DISABLED_BACKDROP_TEMPLATE;
        insertMenu.addRibbonOption(new RibbonOption('Quest Button Disabled Backdrop', new CreateFrameAtSelected(newFrameBuilder)));

        newFrameBuilder = new FrameBuilder(true);
        newFrameBuilder.texture = './files/images/EscMenuBackdrop.png';
        newFrameBuilder.type = FrameType.ESC_MENU_BACKDROP;
        insertMenu.addRibbonOption(new RibbonOption('Esc Menu Backdrop', new CreateFrameAtSelected(newFrameBuilder)));

        fileMenu.run();
        return tabsMenu;

    }

    public constructor(document: HTMLDocument) {

        (document as any).editor = this;

        this.panelDebug = document.getElementById('panelDebug');

        this.btnCloseTreePanel = document.getElementById('treeClose') as HTMLButtonElement;
        this.btnCloseParameterPanel = document.getElementById('panelClose') as HTMLButtonElement;

        this.workspaceImage = document.getElementById('workspace') as HTMLImageElement;
        this.workspace = document.getElementById('workspaceContainer') as HTMLElement;

        this.debugLine = document.getElementById('debugLine');
        this.debugGameCoordinates = document.getElementById('debugGameCoordinates');

        this.projectTree = new ProjectTree();
        this.changeStack = new ChangeStack();
        this.parameterEditor = new ParameterEditor();
        this.tabsMenu = this.initializeMenus();

        this.treeButton = document.getElementById('treeClose') as HTMLButtonElement;
        this.panelButton = document.getElementById('panelClose') as HTMLButtonElement;

    }

    public static GetDocumentEditor(): Editor {
        return (document as any).editor;
    }
}

class RibbonOptionsNew implements ICallableDivInstance {
    public run() {
        for (const el of Editor.GetDocumentEditor().projectTree.getIterator()) {
            if (el.type == FrameType.ORIGIN) {
                continue;
            }
            el.destroy()
            debugText('New page.')
        }

        Editor.GetDocumentEditor().changeStack.clear();
    }
}