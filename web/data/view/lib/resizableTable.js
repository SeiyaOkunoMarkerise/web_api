"use strict";
/*
(c) 2019 Markerise Inc.
テーブルにリサイズ機能を持たせる

- クラス図
  https://docs.google.com/presentation/d/16Gz9WiJ6tQLcgM3BcInpgubyKMP-9DRs0lxaeDPOMyU/edit#slide=id.g5de451e647_0_0
- ヘッダ行の右端をドラッグすることでテーブルを可変にできるようにする

- 可変対象
  - JavaScript読み込み時にtable.resizableが存在しているテーブルを対象とする
    - テーブルヘッダthは、display: none でないか、 style.widthが指定されている必要がある(どちらもないと、ドラッグポイントの取得ができない)
  - 後からHTMLTableElementを追加する場合: TableResizer.add(element: HTMLTableElement)で追加
  - 追加したテーブルにはdata-resizeid属性を付与し、同一テーブルを二回可変対象になることを抑止する

- 可変情報の保存
  - #table.resizable要素に[name=xxxx]属性がある場合、変更した差分情報をLocalStorageにjson形式で保持する
  - 同名の#table.resizable[name=xxxx]が存在する場合、同名のヘッダのサイズは連携して変更される
    e.g. 顧客タブのWeb閲覧テーブル
  - WebStorageRepository.reset() により、保存した情報を削除する
    - 顧客一覧テーブルなどのユーザによって並び順・幅を変更テーブルは、その保存時にリセットする
*/
var defaultSetting = {
  minWidth: 11, // 最小幅
  handle: {
    width: { outer: 15, inner: 7 }, // つかむ判定範囲と表示範囲
    defaultHeight: 30, // display:none の際のデフォルト値
    backgroundColor: "#428bca" // つかむ部分の色
  },
  // ヘッダ要素の識別を行うための情報. data-name="xxx", data-set="yyy" name="xxx" の優先順位で取得する
  headerIdentification: function(el) {
    return el.dataset.name || el.dataset.sort || el.getAttribute("name") || "";
  },
  resizeLine: { backgroundColor: "#428bca", width: 1 },
  resizer: { className: "resizable-handles" }
}
/**
 * メインクラス
 */
function TableResizer(setting) {
  setting = setting ? setting : defaultSetting;
  var _this = this;
  this.handlers = {};
  this.repositories = {};
  this.counter = 0;
  this.setting = setting;
  document.addEventListener("mouseup", function() {
    return _this.onHandleReleased();
  });
  document.addEventListener("touchend", function() {
    return _this.onHandleReleased();
  });
}
/**
 * テーブル要素を追加
 */
TableResizer.prototype.add = function(el, setting) {
  setting = setting || this.setting;
  if (!(el instanceof HTMLTableElement)) return;
  this.validateTable(el);
  var name = el.getAttribute("name") || "";
  if (!this.repositories[name]) {
    this.repositories[name] = new LocalStorageRepository(name + "_width");
  }
  var repo = this.repositories[name];
  if (!el.dataset.resizeid) el.dataset.resizeid = (this.counter++).toString();
  var id = el.dataset.resizeid;
  var creator = new ResizableTableCreator(el, setting);
  var collection = creator.createModels();
  if (!this.handlers[id]) this.handlers[id] = creator.createEventHandler();
  this.handlers[id]
    .removeHandles()
    .createHandles(collection, setting)
    .updateByRecord(repo.records)
    .refresh();
}
/**
 * テーブル要素の幅設定をストレージから削除する
 */
TableResizer.prototype.reset = function(el) {
  if (!el) return;
  var name = el.getAttribute("name") || "";
  this.repositories[name] && this.repositories[name].reset();
}
/**
 * つまみがリリースされた時に
 * そのカラム幅をストレージに保存、
 * 同名テーブルを全てリサイズする
 */
TableResizer.prototype.onHandleReleased = function() {
  var activeHandler = this.getActiveHandler();
  if (!activeHandler) return;
  var activeHandle = activeHandler.getSelectedHandle();
  if (!activeHandle) return;
  var activeHeader = activeHandle.header;
  this.save(activeHandler, activeHeader);
  this.getSameNameTables(activeHandler).forEach(function(handler) {
    handler.filterHandleByName(activeHeader.name).map(function(handle) {
      return handle.resizeColumn(activeHeader.width);
    });
    handler.refresh();
  });
}
/**
 * 現在つかんでいるつまみオブジェクトを返す
 */
TableResizer.prototype.getActiveHandler = function() {
  var _this = this;
  return Object.keys(this.handlers).map(function(key) {
    return _this.handlers[key];
  }).filter(function(handler) {
    return handler.hasSelectedHandle();
  })[0];
}
/**
 * 同名のテーブルイベントハンドラを返す
 */
TableResizer.prototype.getSameNameTables = function(handler) {
  var _this = this;
  var name = handler.getTableName();
  return Object.keys(this.handlers).map(function(key) {
    return _this.handlers[key];
  }).filter(function(handler) {
    return handler.getTableName() === name;
  });
}
/**
 * ローカルストレージに保存する
 */
TableResizer.prototype.save = function(handler, header) {
  var name = handler.getTableName();
  name && this.repositories[name] && this.repositories[name].save(header);
}
/**
 * 対象のテーブル要素にリサイズ可能な情報を含むか判定する
 */
TableResizer.prototype.validateTable = function(el) {
  if (!el || !el.tagName) throw Error("not supported Element.");
  if (el.tagName.toUpperCase() !== "TABLE")
    throw Error(el.tagName + " is not supported Element.");
  var row = el.querySelector("table>thead>tr");
  if (!row) throw Error("table doesn't have tr tag.");
  var headerList = row.querySelectorAll("th");
  if (!headerList.length) throw Error("table doesn't have th tag.");
}
/**
 * 引数を基にインスタンスを作成して返すクラス(ファクトリクラス)
 */
function ResizableTableCreator(el, setting) {
  this.el = el;
  this.setting = setting;
}
/**
 *  テーブルイベントハンドラを作成する
 */
ResizableTableCreator.prototype.createEventHandler = function() {
  var table = new TableView(this.el);
  var eventHandler = new TableEventHandler(table, this.setting);
  table.insertBefore(eventHandler);
  return eventHandler;
}
// ヘッダ要素<th>の情報を基に、HeaderModel配列を作成する
ResizableTableCreator.prototype.createModels = function() {
  var _this = this;
  // リサイズの対象は、テーブルヘッダの1行目だけにする
  var row = this.el.querySelector("table>thead>tr");
  if (!row) return [];
  return this.convertNodeListToArray(row.getElementsByTagName("th"))
    .map(function(th) {
      var name = _this.setting.headerIdentification(th);
      // ヘッダ定義取得に失敗した場合空Objectを返す
      return name ? {
        name: name,
        left: 0,
        //  display:noneの場合、offset系の値は取得できないためデフォルト値を使用する
        height: th.offsetHeight || _this.setting.handle.defaultHeight,
        width: parseFloat(th.style.width || "0") || th.offsetWidth,
        minWidth: _this.setting.minWidth,
        element: th
      } : {};
    })
    .reduce(function(prev, data) {
      if (Object.keys(data).length === 0) return prev;
      var last = prev.slice(-1)[0];
      data.left = last && (last.left || 0) + (last.width || 0);
      prev.push(new HeaderModel(data));
      return prev;
    }, []);
}
// 要素のリストを処理しやすい様に、配列に変換する
ResizableTableCreator.prototype.convertNodeListToArray = function(list) {
  var el = [];
  for (var i in list) if (list.hasOwnProperty(i)) el.push(list[i]);
  return el;
}
/**
 * 列幅を保持するモデルクラス
 */
function HeaderModel(data) {
  this.name = data.name;
  this.left = data.left;
  this.width = Math.max(Math.round(data.width), data.minWidth);
  this.minWidth = data.minWidth;
  this.height = data.height;
  this.element = data.element;
}
/**
 * widthをセットする
 */
HeaderModel.prototype.setWidth = function(width) {
  this.width = Math.max(Math.round(width), this.minWidth);
  return this;
}
/**
 * 現在保持している幅を要素に反映させる
 */
HeaderModel.prototype.resize = function() {
  this.element.style.width = this.width + "px";
  return this;
}
/**
 * テーブル要素のラッパークラス
 */
function TableView(el) {
  this.element = el;
  if (!el.parentElement) throw Error("Tables' parent is not defined");
  this.parent = el.parentElement;
  el.style.tableLayout = "fixed";
}
/**
 * 名前を取得する
 */
TableView.prototype.getName = function() {
  return this.element.getAttribute("name") || "";
}
/**
 * 高さを取得する
 */
TableView.prototype.getHeight = function() {
  return this.element.offsetHeight;
}
/**
 * ヘッダの高さを取得する
 */
TableView.prototype.getHeaderHeight = function() {
  var nodeList = this.element.getElementsByTagName("th");
  return nodeList.length ? nodeList[0].offsetHeight : 0;
}
/**
 * この要素の前にテーブルイベントハンドラの要素を追加する
 */
TableView.prototype.insertBefore = function(resizer) {
  this.parent.insertBefore(resizer.element, this.element);
  return this;
}
/**
 * このテーブルを更新する
 */
TableView.prototype.refresh = function(handles) {
  var sum = 0;
  for (var i = 0; i < handles.length; i++) {
    sum += handles[i].header.width;
  }
  this.resize(sum);
}
/**
 * このテーブルの幅を更新する
 */
TableView.prototype.resize = function(width) {
  this.element.style.width = width + "px";
}
/**
 * テーブルのタッチ・ドラッグなどのイベントを監視し、処理を行う
 */
function TableEventHandler(table, setting) {
  var _this = this;
  this.handles = [];
  this.eventFunctions = {};
  this.element = this.createElement(setting.resizer.className);
  this.table = table;
  document.addEventListener("mousemove", function(e) {
    return _this.onHandleMoved(e);
  });
  document.addEventListener("touchmove", function(e) {
    return _this.onHandleTouchMoved(e);
  }, { passive: false });
  document.addEventListener("mouseup", function() {
    return _this.onHandleReleased();
  });
  document.addEventListener("touchend", function() {
    return _this.onHandleReleased();
  });
}
/**
 * つまみ、テーブルの幅を更新する
 */
TableEventHandler.prototype.refresh = function() {
  this.resetLeftPosition();
  this.handles.forEach(function(handle) { return handle.refresh(); });
  this.table.refresh(this.handles);
  return this;
}
/**
 * つまみのy座標を更新する
 */
TableEventHandler.prototype.resetLeftPosition = function() {
  var left = 0;
  this.handles.forEach(function(handle) {
    handle.header.left = left;
    left += handle.header.width;
  });
}
/**
 * メンバのハンドルを名前で検索する
 */
TableEventHandler.prototype.filterHandleByName = function(name) {
  return this.handles.filter(function(handle) {
    return handle.header.name === name;
  });
}
/**
 * テーブル名を返す
 */
TableEventHandler.prototype.getTableName = function() {
  return this.table.getName();
}
/**
 * 要素を作成する
 */
TableEventHandler.prototype.createElement = function(className) {
  var el = document.createElement("div");
  el.className = className;
  el.style.position = "relative";
  return el;
}
/**
 * つまみ要素を作成する
 */
TableEventHandler.prototype.createHandles = function(models, setting) {
  var _this = this;
  models.forEach(function(model) {
    var handle = new HandleView(model, setting);
    _this.element.appendChild(handle.element);
    var f = (_this.eventFunctions = {
      handleSelected: function(e) {
        return _this.onHandleSelected(handle, e);
      },
      mouseOver: function(e) {
        return _this.onHandleMouseOver(handle, e);
      },
      mouseLeave: function(e) {
        return _this.onHandleMouseLeave(handle, e);
      },
      touchStart: function(e) {
        return _this.onHandleTouchStarted(handle, e);
      }
    });
    handle
      .addEventListener("mousedown", f.handleSelected)
      .addEventListener("touchstart", f.touchStart)
      .addEventListener("mouseover", f.mouseOver)
      .addEventListener("mouseleave", f.mouseLeave);
    _this.handles.push(handle);
  });
  return this;
}
/**
 * つまみ要素を全て削除する
 */
TableEventHandler.prototype.removeHandles = function() {
  var _this = this;
  this.handles.map(function(handle) {
    handle
      .removeEventListener("mousedown", _this.eventFunctions.handleSelected)
      .removeEventListener("touchstart", _this.eventFunctions.touchStart)
      .removeEventListener("mouseover", _this.eventFunctions.mouseOver)
      .removeEventListener("mouseleave", _this.eventFunctions.mouseLeave);
    _this.element.removeChild(handle.element);
  });
  this.handles = [];
  return this;
}
/**
 * ストレージ情報を基に、つまみを更新する
 */
TableEventHandler.prototype.updateByRecord = function(records) {
  var _this = this;
  records.forEach(function(r) {
    _this
      .filterHandleByName(r.name).map(function(handle) {
        return handle.header;
      }).forEach(function(header) {
        return header.setWidth(r.width);
      });
  });
  return this;
}
/**
 * つまみがマウスオーバーしたときに、つまみの高さを更新する
 */
TableEventHandler.prototype.onHandleMouseOver = function(handle) {
  if (!handle.isVisible()) return;
  if (!this.hasSelectedHandle()) handle.show();
  this.updateAllHandleHeight();
}
/**
 * つまみのタッチイベントが開始したときに、線を描写する
 */
TableEventHandler.prototype.onHandleTouchStarted = function(handle, e) {
  if (this.targetHandle || !handle.isVisible() || this.isMultiTouchEvent(e))
    return;
  this.targetHandle = handle;
  var pos = e.targetTouches[0].pageX;
  this.updateAllHandleHeight().renderLine(handle.select(pos));
}
/**
 * つまみを選択(マウスダウン)したときに、線を描写する
 */
TableEventHandler.prototype.onHandleSelected = function(handle, e) {
  if (this.targetHandle || !handle.isVisible()) return;
  this.targetHandle = handle;
  this.updateAllHandleHeight().renderLine(handle.select(e.pageX));
}
/**
 * つまみをタッチし動かしたときに、つまみを移動させる
 */
TableEventHandler.prototype.onHandleTouchMoved = function(e) {
  if (this.isMultiTouchEvent(e) || !this.targetHandle) return;
  e.preventDefault(); // スクロール抑止
  this.targetHandle.move(e.targetTouches[0].pageX);
  this.resetLeftPosition();
}
/**
 * つまみをドラッグし動かしたときに、つまみを移動させる
 */
TableEventHandler.prototype.onHandleMoved = function(e) {
  if (!this.targetHandle) return;
  this.targetHandle.move(e.pageX);
  this.resetLeftPosition();
}
/**
 * つまみを離したときに、つまみを表示しなくする
 */
TableEventHandler.prototype.onHandleReleased = function() {
  if (!this.targetHandle) return;
  this.targetHandle.hide().release();
  this.targetHandle = undefined;
}
/**
 * 複数指によるタッチかどうかを返す
 */
TableEventHandler.prototype.isMultiTouchEvent = function(e) {
  return e.targetTouches.length !== 1;
}
/**
 * マウスが離れたとき、マウスをドラッグ状態でない場合、つまみを表示しなくする
 */
TableEventHandler.prototype.onHandleMouseLeave = function(handle) {
  if (!handle.selected) handle.hide();
}
/**
 * 現在選択中のつまみを返す
 */
TableEventHandler.prototype.getSelectedHandle = function() {
  return this.handles.filter(function(handle) {
    return handle.selected;
  })[0];
}
/**
 * 現在選択中のつまみがあるかどうかを返す
 */
TableEventHandler.prototype.hasSelectedHandle = function() {
  return !!this.getSelectedHandle();
}
/**
 * 全てのつまみの高さを更新する
 */
TableEventHandler.prototype.updateAllHandleHeight = function() {
  var height = this.table.getHeaderHeight();
  this.handles.forEach(function(handle) {
    return handle.setHeight(height);
  });
  return this;
}
/**
 * つまみの下に、テーブルの行数分の高さの線を描写する
 */
TableEventHandler.prototype.renderLine = function(handle) {
  var height = this.table.getHeight();
  handle.renderLine(height);
}
/**
 * つまみ
 */
function HandleView(header, setting) {
  this.backgroundColor = setting.handle.backgroundColor;
  this.header = header;
  this.line = setting.resizeLine;
  this.width = setting.handle.width;
  this.element = this.createElement(header, setting.handle.width);
}
/**
 * イベントを追加する
 */
HandleView.prototype.addEventListener = function(type, listener) {
  this.element.addEventListener(type, listener);
  return this;
}
/**
 * イベントを削除する
 */
HandleView.prototype.removeEventListener = function(type, listener) {
  this.element.removeEventListener(type, listener);
  return this;
}
/**
 * カラムをリサイズする
 */
HandleView.prototype.resizeColumn = function(width) {
  this.header.setWidth(width || this.header.width);
}
/**
 * つまみを表示する
 */
HandleView.prototype.show = function() {
  this.getInnerElement().style.backgroundColor = this.backgroundColor;
  return this;
}
/**
 * つまみの表示部分の要素を取得する
 */
HandleView.prototype.getInnerElement = function() {
  return this.element.getElementsByTagName("div")[0];
}
/**
 * つまみを非表示にする
 */
HandleView.prototype.hide = function() {
  var el = this.getInnerElement();
  el.style.backgroundColor = "";
  el.innerHTML = "";
  return this;
}
/**
 * 高さをセットする
 */
HandleView.prototype.setHeight = function(height) {
  this.header.height = height;
  this.element.style.height = height + "px";
}
/**
 * 幅をstyle属性から取得する
 */
HandleView.prototype.getWidth = function() {
  return parseFloat(this.element.style.width || "0");
}
/**
 * 選択状態を解除する
 */
HandleView.prototype.release = function() {
  delete this.selected;
}
/**
 * 要素を更新する
 */
HandleView.prototype.refresh = function() {
  if (this.header.element.offsetHeight) {
    this.header.height = this.header.element.offsetHeight;
  }
  this.element.style.left = this.calcElementLeft(this.header);
  this.element.style.height = this.header.height + "px";
  this.header.setWidth(this.header.width).resize();
}
/**
 * 移動する
 */
HandleView.prototype.move = function(pos) {
  if (!this.selected) return this;
  this.header.setWidth(
    Math.max(
      this.selected.width + pos - this.selected.pos,
      this.header.minWidth
    )
  );
  this.element.style.left = this.calcElementLeft(this.header);
  return this;
}
/**
 * 選択状態にする
 */
HandleView.prototype.select = function(pos) {
  this.selected = { pos: pos, width: this.header.width };
  return this.show();
}
/**
 * 要素が表示されているかどうかを返す
 */
HandleView.prototype.isVisible = function() {
  return this.element.offsetHeight > 0;
}
/**
 * 要素の座標を計算する
 */
HandleView.prototype.calcElementLeft = function(header) {
  return header.left + header.width - this.getWidth() / 2 + "px";
}
/**
 * この要素の子供として線を描写する
 */
HandleView.prototype.renderLine = function(height) {
  var line = new ResizingLineView(this);
  line.setHeight(height);
  this.getInnerElement().appendChild(line.element);
}
/**
 * 要素を作成する
 */
HandleView.prototype.createElement = function(header, width) {
  var outer = document.createElement("div");
  outer.style.height = header.height + "px";
  outer.className = "handle";
  outer.style.position = "absolute";
  outer.style.width = width.outer + "px";
  outer.style.left = header.left + header.width - width.outer / 2 + "px";
  outer.style.cursor = "ew-resize";
  outer.style.pointerEvents = "all";
  outer.style.userSelect = "none";
  outer.style.msUserSelect = "none";
  outer.style.webkitUserSelect = "none";
  var inner = document.createElement("div");
  inner.style.height = "100%";
  inner.style.width = width.inner + "px";
  inner.style.left = inner.style.left =
    width.outer / 2 - width.inner / 2 + "px";
  inner.style.position = "absolute";
  inner.style.pointerEvents = "none";
  outer.appendChild(inner);
  return outer;
}
/**
 * つまみの下に描写するライン
 */
function ResizingLineView(handle) {
  this.element = document.createElement("div");
  this.element.style.position = "absolute";
  this.element.style.backgroundColor = handle.line.backgroundColor;
  this.element.style.width = handle.line.width + "px";
  this.element.style.left = "50%";
}
/**
 * 高さを指定する
 */
ResizingLineView.prototype.setHeight = function(height) {
  this.element.style.height = height + "px";
}
/**
 * ローカルストレージのラッパー
 */
function LocalStorageRepository(key) {
  this.records = [];
  this.key = key;
  try {
    this.records = JSON.parse(localStorage[this.key] || "[]");
  } catch (e) {
    console.error(e);
  }
}
/**
 * 列の幅を保存する
 */
LocalStorageRepository.prototype.save = function(record) {
  // keyが存在しない場合保存しない
  if (!this.key) return;
  var width = Math.round(record.width);
  var existRecord = this.records.filter(function(r) {
    return r.name === record.name;
  })[0];
  existRecord
    ? (existRecord.width = width)
    : this.records.push({ name: record.name, width: width });
  localStorage[this.key] = JSON.stringify(this.records);
}
/**
 * このローカルストレージをリセットする
 */
LocalStorageRepository.prototype.reset = function() {
  localStorage.removeItem(this.key);
}

window.TableResizer = new TableResizer();
/**
 * 読み込まれた際、table.resizable要素に対して、管理対象として追加する
 */
var init = function() {
  var tableList = document.querySelectorAll("table.resizable");
  for (var key in tableList) {
    try {
      tableList.hasOwnProperty(key) && window.TableResizer.add(tableList[key]);
    } catch (e) {
      console.log(e.message);
    }
  }
}
// // HTMLがロード中の場合、ロードが完了したときにinitメソッドを実行する
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
