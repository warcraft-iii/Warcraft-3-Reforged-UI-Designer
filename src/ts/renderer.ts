/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-var-requires */
// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process unless
// nodeIntegration is set to true in webPreferences.
// Use preload.js to selectively enable features
// needed in the renderer process.

import { ipcRenderer, remote } from "electron";
import { Titlebar, Color, RGBA } from 'custom-electron-titlebar'

import { GUIEvents } from "./Classes & Functions/GUIEvents";
import { Editor } from "./Editor/Editor";
import * as path from "path";
import { CustomText } from "./Editor/FrameLogic/CustomText";
import { ProjectTree } from "./Editor/ProjectTree";
import { Modals } from "./modals/modals Init";
import bootstrap = require("bootstrap");
import { electron } from "webpack";
import Undo from "./Commands/Undo";
import Redo from "./Commands/Redo";
import RemoveFrame from "./Commands/Implementation/RemoveFrame";
import { ParameterEditor } from "./Editor/ParameterEditor";

window.addEventListener('mousemove', GUIEvents.DisplayGameCoords);
ipcRenderer.on('Delete', GUIEvents.DeleteSelectedImage);
ipcRenderer.on('Duplicate', GUIEvents.DuplicateSelectedImage);

ipcRenderer.on('TableArray', () => {try{
  const win = new remote.BrowserWindow( {
    height: 400,
    width: 300,
    resizable: false,
    movable: true,
    alwaysOnTop: true,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true,
    },
    
  })
  win.show()
  win.focus()
  if(ProjectTree.getSelected().getParent().getName().indexOf('[') >= 0) {
    win.loadFile(path.join(__dirname, "./TableArrayArrayOn.html"));
  } else {
    win.loadFile(path.join(__dirname, "./TableArrayArrayOff.html"));
  }


}catch(e){alert(e)}});

ipcRenderer.on('TableArraySubmit', (event, args) => {try{
  const source = Editor.GetDocumentEditor().projectTree.getSelectedFrame().custom;
  GUIEvents.DuplicateArrayTable(source.getLeftX(), source.getBotY() - source.getHeight(), args[0], args[1], args[2], args[3], args[4])
}catch(e){alert(e)}})

// ipcRenderer.on('CircularArraySubmit', (event, args) => {
//   const source = Editor.GetDocumentEditor().projectTree.getSelectedFrame().custom;
//   GUIEvents.DuplicateArrayCircular(source.getLeftX(), source.getBotY(), args[0], args[1], args[2])
// })
const mod = new bootstrap.Modal(document.getElementById('CircArray'))
const CircParent = document.getElementById('CircCheckParent') as HTMLInputElement 
ipcRenderer.on('CircularArray', () => {
  CircParent.checked = false
  if(ProjectTree.getSelected().getParent().getName().indexOf('[') >= 0) {
      CircParent.disabled = false
  } else {
    CircParent.disabled = true
  }
  mod.show();
});

const CircArraySubmit = document.getElementById('CircArraySubmit')
const radius = document.getElementById('radius') as HTMLInputElement
const count = document.getElementById('count') as HTMLInputElement
const initAng = document.getElementById('initAng') as HTMLInputElement

CircArraySubmit.onclick = (e) => {
  try {
      //conditions plz
      e.preventDefault();
      if (+radius.value < 0 || +radius.value > .4 || +count.value <= 0 || +initAng.value < 0 || +initAng.value > 360) {

          if (+radius.value < 0 || +radius.value > .4) { radius.value = "" }
          if (+count.value <= 0) { count.value = '' }
          if (+initAng.value < 0 || +initAng.value > 360) { initAng.value = '' }
          return;
      }

      const source = Editor.GetDocumentEditor().projectTree.getSelectedFrame().custom;
      GUIEvents.DuplicateArrayCircular(source.getLeftX(), source.getBotY(), radius.valueAsNumber, count.valueAsNumber, initAng.valueAsNumber, CircParent.checked)
      mod.hide();
      
  } catch (e) { alert(e) }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
/*const input = document.getElementById('imgFile') as HTMLInputElement

Element.formIMG.addEventListener("submit", e => {
  e.preventDefault()
  const frameBuilder = new FrameBuilder();

  frameBuilder.name = "name";
  frameBuilder.texture =  URL.createObjectURL(input.files[0]);
  
  frameBuilder.Run();
})
*/
try{

  window.onresize = () =>{
    const editor = Editor.GetDocumentEditor();

        for(const el of editor.projectTree.getIterator()) {
          if(el.type == 0) { //base
            continue;
          }
          
          const image = el.custom.getElement()
          const rect = editor.workspaceImage.getBoundingClientRect() 
          const workspace = Editor.GetDocumentEditor().workspaceImage
          const horizontalMargin = Editor.getInnerMargin()
      
          const x = el.custom.getLeftX();
          const y = el.custom.getBotY();
          const w = el.custom.getWidth();
          const h = el.custom.getHeight();
      
          image.style.width = w / 0.8 * (workspace.width-2*horizontalMargin) + "px"
          image.style.height = `${+h / 0.6 * workspace.getBoundingClientRect().height}px`;

          image.style.left = `${ x*(rect.width-2*horizontalMargin)/0.8 + rect.left + horizontalMargin}px`
          image.style.top = `${rect.bottom - y*rect.height/0.6 - image.offsetHeight - 120}px`

          if(el.custom instanceof CustomText) {
              image.style.fontSize = (el.custom.getScale()) * rect.width / 100 + "px"
          }
      
        }
  }

new Titlebar({
  backgroundColor: new Color( new RGBA(69,49,26,255)),
  icon: "./files/icon.png",
  menu: null,

})

//keyboard shortcuts
window.addEventListener('keydown', function (event) {
  if (event.ctrlKey && event.code === 'KeyZ') {
      new Undo().run()
  }
  if (event.ctrlKey && event.code === 'KeyY') {
      new Redo().run()
  }
  if (event.which === 46) {
      if(ProjectTree.getSelected()) {
        const command = new RemoveFrame(ProjectTree.getSelected());
        command.action();
      }
  }

  const par = ParameterEditor.inst()
  if (event.which === 37) { //left
    if(ProjectTree.getSelected()) {
      par.inputElementCoordinateX.value = +par.inputElementCoordinateX.value - 0.001 + ""
      if(!event.shiftKey) par.inputElementCoordinateX.value = +par.inputElementCoordinateX.value - 0.009 + ""
      par.inputElementCoordinateX.dispatchEvent(new Event('change'));
    }
  } 

  if (event.which === 38) { //up
    if(ProjectTree.getSelected()) {
      par.inputElementCoordinateY.value = +par.inputElementCoordinateY.value + 0.001 + ""
      if(!event.shiftKey) par.inputElementCoordinateY.value = +par.inputElementCoordinateY.value + 0.009 + ""
      par.inputElementCoordinateY.dispatchEvent(new Event('change'));
    }
  }

  if (event.which === 39) { //right
    if(ProjectTree.getSelected()) {
      par.inputElementCoordinateX.value = +par.inputElementCoordinateX.value + 0.001 + ""
      if(!event.shiftKey) par.inputElementCoordinateX.value = +par.inputElementCoordinateX.value + 0.009 + ""
      par.inputElementCoordinateX.dispatchEvent(new Event('change'));
    }
  }

  if (event.which === 40) { //down
    if(ProjectTree.getSelected()) {
      par.inputElementCoordinateY.value = +par.inputElementCoordinateY.value - 0.001 + ""
      if(!event.shiftKey) par.inputElementCoordinateY.value = +par.inputElementCoordinateY.value - 0.009 + ""
      par.inputElementCoordinateY.dispatchEvent(new Event('change'));
    }
  }
});

//general Initializations
const editor = new Editor(document)
editor.parameterEditor.fieldElement.style.display = "none"
document.getElementById("panelTree").style.visibility = "visible"
document.getElementById("panelParameters").style.visibility = "visible"

//general Initializations
editor.parameterEditor.fieldElement.style.display = "none"
document.getElementById("panelTree").style.visibility = "visible"
document.getElementById("panelParameters").style.visibility = "visible"

editor.panelButton.onclick                 = GUIEvents.PanelOpenClose;
editor.treeButton.onclick                 = GUIEvents.TreeOpenClose;

}catch(e){alert("renderer"+e)}

new Modals();

var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
  return new bootstrap.Tooltip(tooltipTriggerEl)
})
//# sourceMappingURL=renderer.js.map