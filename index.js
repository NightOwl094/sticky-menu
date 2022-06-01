// dropzone manager
class DropZoneManager {
  constructor() {
    this._$dropzones = document.querySelectorAll(".dropzone");
    this._cssClassName = "dropzone";
    this._verticalDropzoneCssClassNames = ["dropzone-left", "dropzone-right"];
  }

  // dropzone 표시
  visible() {
    this._$dropzones.forEach((it) => (it.style.background = "gold"));
  }

  // dropzone 숨기기
  hide() {
    this._$dropzones.forEach((it) => (it.style.background = "transparent"));
  }

  // dropzone 영역에 들어왔는지
  isDropToZone(targetClassNames) {
    return targetClassNames.includes(this.getCssClassName());
  }

  // 세로 dropzone 영역에 들어왔는지
  isDropToVerticalZone(targetClassNames) {
    return this.getVerticalDropzoneCssClassNames().some((it) =>
      targetClassNames.includes(it)
    );
  }

  // dropzone css class name
  getCssClassName() {
    return this._cssClassName;
  }

  // vertical dropzone css class name
  getVerticalDropzoneCssClassNames() {
    return this._verticalDropzoneCssClassNames;
  }
}

class ContainerManager {
  // 드래그중인 타겟
  _dragged;

  constructor(dropZoneManager) {
    this._dropZoneManager = dropZoneManager;
    this._$container = document.querySelector(".drag-drop__container");

    this._subscribeDragStartEvent();
    this._subscribeDragEndEvent();
    this._subscribeDragOverEvent();
    this._subscribeDragEnterEvent();
    this._subscribeDragLeaveEvent();
    this._subscribeDropEvent();
  }

  // 드래그 시작 시
  _subscribeDragStartEvent() {
    this._$container.addEventListener(
      "dragstart",
      (e) => {
        // 드래그한 요소에 대한 참조 변수
        this._dragged = e.target;
        // 요소를 반투명하게 함
        e.target.style.opacity = 0.5;

        this._dropZoneManager.visible();
      },
      false
    );
  }

  // 드래그 종료 시
  _subscribeDragEndEvent() {
    this._$container.addEventListener(
      "dragend",
      (e) => {
        // 투명도를 리셋
        e.target.style.opacity = "";
      },
      false
    );
  }

  // 드롭 대상에서 이벤트 발생
  _subscribeDragOverEvent() {
    this._$container.addEventListener(
      "dragover",
      (e) => {
        // 드롭을 허용하도록 preventDefault() 호출
        e.preventDefault();
      },
      false
    );
  }

  // 드래그 대상이 드랍존에 진입시
  _subscribeDragEnterEvent() {
    this._$container.addEventListener(
      "dragenter",
      (e) => {
        // 요소를 드롭하려는 대상 위로 드래그했을 때 대상의 배경색 변경
        if (
          e.target.className.includes(this._dropZoneManager.getCssClassName())
        )
          e.target.style.background = "purple";
      },
      false
    );
  }

  // 드래그 대상이 드랍존에서 탈출 시
  _subscribeDragLeaveEvent() {
    this._$container.addEventListener(
      "dragleave",
      (e) => {
        // 요소를 드래그하여 드롭하려던 대상으로부터 벗어났을 때 배경색 리셋
        if (
          e.target.className.includes(this._dropZoneManager.getCssClassName())
        )
          e.target.style.background = "";
      },
      false
    );
  }

  // 드래그 대상을 드랍존에 드랍 시
  _subscribeDropEvent() {
    this._$container.addEventListener(
      "drop",
      (e) => {
        const dropZoneManager = this._dropZoneManager;
        const dragged = this._dragged;

        e.preventDefault();

        dropZoneManager.hide();

        // 드래그한 요소를 드롭 대상으로 이동
        const handle = () => {
          e.target.style.background = "";
          dragged.parentNode.removeChild(dragged);
          e.target.appendChild(dragged);
        };

        if (dropZoneManager.isDropToVerticalZone(e.target.className)) {
          handle();

          const menus = e.target.querySelectorAll("[draggable='true']");
          menus.forEach((it) => (it.style.flexDirection = "column"));

          return;
        }

        if (dropZoneManager.isDropToZone(e.target.className)) {
          handle();

          const menus = e.target.querySelectorAll("[draggable='true']");
          menus.forEach((it) => (it.style.flexDirection = "row"));

          return;
        }
      },
      false
    );
  }
}

const dropZoneManager = new DropZoneManager();
const containerManager = new ContainerManager(dropZoneManager);
