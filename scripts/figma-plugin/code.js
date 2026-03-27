// Select 컴포넌트 세트에 Error 상태 Variant 추가하는 플러그인
figma.skipInvisibleInstanceChildren = true;

const TARGET_NODE_ID = "19:2479";

// 컴포넌트 세트 찾기
const componentSet = figma.currentPage.findOne(n => n.id === TARGET_NODE_ID);

if (!componentSet) {
  figma.notify("❌ Select 컴포넌트 세트를 찾을 수 없습니다 (id: " + TARGET_NODE_ID + ")");
  figma.closePlugin();
} else if (componentSet.type !== "COMPONENT_SET") {
  figma.notify("❌ 해당 노드가 컴포넌트 세트가 아닙니다.");
  figma.closePlugin();
} else {
  addErrorVariants(componentSet);
}

function addErrorVariants(componentSet) {
  const children = componentSet.children;

  // 기존 variant 중 Size=48, Size=40 각각 하나씩 찾기
  let base48 = children.find(c =>
    c.type === "COMPONENT" &&
    c.name.includes("Size=48") &&
    (c.name.includes("Status=Default") || c.name.includes("Default"))
  );

  let base40 = children.find(c =>
    c.type === "COMPONENT" &&
    c.name.includes("Size=40") &&
    (c.name.includes("Status=Default") || c.name.includes("Default"))
  );

  // Default를 못 찾으면 첫 두 개 사용
  if (!base48) base48 = children.find(c => c.type === "COMPONENT" && c.name.includes("Size=48"));
  if (!base40) base40 = children.find(c => c.type === "COMPONENT" && c.name.includes("Size=40"));

  if (!base48 && !base40) {
    figma.notify("❌ 복제할 기존 Variant를 찾을 수 없습니다.");
    figma.closePlugin();
    return;
  }

  // 기존 컴포넌트들의 최대 Y + Height 계산 (아래에 배치)
  let maxY = 0;
  let rowHeight = 0;
  children.forEach(c => {
    if (c.type === "COMPONENT") {
      const bottom = c.y + c.height;
      if (bottom > maxY) {
        maxY = bottom;
        rowHeight = c.height;
      }
    }
  });

  const GAP = 20;
  const newY = maxY + GAP;

  // Size=48 Error variant 추가
  if (base48) {
    const error48 = base48.clone();
    error48.name = "Status=Error, Size=48";
    componentSet.appendChild(error48);
    error48.x = base48.x;
    error48.y = newY;
    applyErrorStyle(error48);
  }

  // Size=40 Error variant 추가
  if (base40) {
    const error40 = base40.clone();
    error40.name = "Status=Error, Size=40";
    componentSet.appendChild(error40);
    error40.x = base40.x;
    error40.y = newY;
    applyErrorStyle(error40);
  }

  // 컴포넌트 세트 크기 자동 조정
  figma.notify("✅ Error Variant 2개 추가 완료!");
  figma.closePlugin();
}

function applyErrorStyle(variant) {
  // input 프레임에 빨간 테두리 적용
  const inputFrame = variant.findOne(n => n.name === "input");
  if (inputFrame && "strokes" in inputFrame) {
    inputFrame.strokes = [{
      type: "SOLID",
      color: { r: 1, g: 0.267, b: 0.267 }, // #FF4444
      opacity: 1
    }];
    inputFrame.strokeWeight = 1;
  }

  // 텍스트 색상 변경 (에러 메시지)
  const errorText = variant.findOne(n => n.name === "error" || n.name === "error-text");
  if (errorText && errorText.type === "TEXT") {
    errorText.fills = [{
      type: "SOLID",
      color: { r: 1, g: 0.267, b: 0.267 }
    }];
  }
}
