const paint = document.querySelector(".paint");
const brush = document.querySelector(".brush");
const move = document.querySelector(".move");
const transform = document.querySelector(".transform");
const colors = document.querySelector(".colors");
const canvas = document.querySelector(".canvas");
const tools = {
  paintTool: false,
  brushTool: false,
  moveTool: false,
  transformTool: false,
};
let currentColor = "#41F795";

// функция для активации инструментов, стилизации активных инструментов
function activateTool (activeTool, activeClass){
  for (let key in tools) tools[key] = false;
  tools[activeTool] = true;
  
  paint.classList.remove("activeColor");
  paint.style.backgroundColor = "white";
  move.classList.remove("active");
  transform.classList.remove("active");
  brush.classList.remove("active");
  
  if(activeClass === paint) {
    activeClass.classList.add("activeColor");
    activeClass.style.backgroundColor = currentColor + "44";
  } else {
    activeClass.classList.add("active");
  }
}

// активация инструментов при клике 
paint.addEventListener("click", () => activateTool("paintTool", paint));

brush.addEventListener("click", () => activateTool("brushTool", brush));

move.addEventListener("click", () => activateTool("moveTool", move));

transform.addEventListener("click", () => activateTool("transformTool", transform));

// активация инструментов при нажатии горячих клавиш
window.addEventListener("keydown", function(event) {
  if (event.keyCode == 80) {
    activateTool("paintTool", paint);
  } else if (event.keyCode == 67) {
    activateTool("brushTool", brush);
  } else if (event.keyCode == 77) {
    activateTool("moveTool", move);
  } else if (event.keyCode == 84) {
    activateTool("transformTool", transform);
  } 
});

// смена текущего цвета по клику инструментами brushTool и paintTool
// смена цветов в поле colors при клике brushTool
colors.addEventListener("click", (event) => {
  const firstColor = document.querySelector(".colors .tool:nth-child(1) .icon");
  const secondColor = document.querySelector(".colors .tool:nth-child(2) .icon");
  const thirdColor = document.querySelector(".colors .tool:nth-child(4) .icon");
  const fourthColor = document.querySelector(".colors .tool:nth-child(5) .icon");

  if (tools.brushTool) {
    let t = event.target;
    currentColor = t.dataset.code;

    if (t.dataset.num === "second") {
      let temp1 = [firstColor.dataset.code, firstColor.dataset.color];
      let temp2 = [t.dataset.code, t.dataset.color];

      firstColor.style.backgroundColor = temp2[0];
      firstColor.dataset.code = temp2[0];
      firstColor.dataset.color = temp2[1];

      secondColor.style.backgroundColor = temp1[0];
      secondColor.dataset.code = temp1[0];
      secondColor.dataset.color = temp1[1];
    }

    if (t.dataset.num === "third" ||
      t.dataset.num === "fourth") {
      let temp1 = [firstColor.dataset.code, firstColor.dataset.color];
      let temp2 = [secondColor.dataset.code, secondColor.dataset.color];
      let temp3 = [t.dataset.code, t.dataset.color];

      firstColor.style.backgroundColor = temp3[0];
      firstColor.dataset.code = temp3[0];
      firstColor.dataset.color = temp3[1];

      secondColor.style.backgroundColor = temp1[0];
      secondColor.dataset.code = temp1[0];
      secondColor.dataset.color = temp1[1];

      t.style.backgroundColor = temp2[0];
      t.dataset.code = temp2[0];
      t.dataset.color = temp2[1];
      t.nextElementSibling.innerHTML = t.dataset.color;
    }
  }

  if (tools.paintTool) {
    currentColor = event.target.dataset.code;
    paint.style.backgroundColor = currentColor + "44";
    paint.style.filter = "none";
  };
});

// применение инструментов paintTool и transformTool к блокам элемента canvas
canvas.addEventListener("click", (event) => {
  let t = event.target;
  if (!t.classList.contains("block")) return;

  if (tools.paintTool) {
    t.style.backgroundColor = currentColor;
  };

  if (tools.transformTool) {
    t.classList.toggle("round");
    t.parentNode.classList.toggle("round");
  };
});

// применение инструмента moveTool к блокам элемента canvas - перетаскивание и swap
// https://learn.javascript.ru/drag-and-drop
canvas.addEventListener("mouseover", (event) => {
  let t = event.target;
  if (!t.classList.contains("block")) return;
  if(!tools.moveTool) {  
    t.style.cursor = "pointer";
    t.onmousedown = null;
    return;
  }
  t.style.cursor = "move";
  t.onmousedown = function(event) {

    t.style.position = "absolute";
    t.style.zIndex = 1000;

    function moveAt(event) {
      t.style.left = event.pageX - t.offsetWidth / 2 + "px";
      t.style.top = event.pageY - t.offsetHeight / 2 + "px";
    }

    document.onmousemove = function(event) {
      moveAt(event);
    }

    t.onmouseup = function(event) {
      const blockContainer = document.querySelectorAll(".block-container");

      blockContainer.forEach(item => {
        let x = t.offsetLeft;
        let y = t.offsetTop;
        let x1 = item.offsetLeft;
        let y1 = item.offsetTop;

        if (x > x1 - 125 && x < x1 + 125 &&
          y > y1 - 125 && y < y1 + 125) {

          let parent1 = item;
          let child1 = item.querySelector(".block");
          let parent0 = t.parentNode;
          let child0 = t;

          parent1.appendChild(child0);
          parent0.appendChild(child1);

          child0.style.position = "static";

          child0.classList.contains("round") ? parent1.classList.add("round") : parent1.classList.remove("round");

          child1.classList.contains("round") ? parent0.classList.add("round") : parent0.classList.remove("round");
        }
      });

      document.onmousemove = null;
      t.onmouseup = null;
    }
  }  
});

// сохранение состояния элементов в LocalStorage
canvas.addEventListener("click", (event) => {
  let t = event.target;
  if (!t.classList.contains("block")) return;

  let blockClass = t.dataset.class;
  let blockColor = t.style.backgroundColor || "#CFCFCF";
  let isRound = t.classList.contains("round");

  localStorage.setItem(blockClass, JSON.stringify({blockColor, isRound}));
});

// восстановления состояния элементов после перезагрузки
window.onload = function() {
  const blocks = document.querySelectorAll(".block");

  blocks.forEach((item, index) => {
    let styles = JSON.parse(localStorage.getItem(`block${index + 1}`));
    if (!styles) return;

    item.style.backgroundColor = styles.blockColor || "#CFCFCF";

    if (styles.isRound) {
      item.classList.add("round");
      item.parentNode.classList.add("round");
    } else if (!styles.isRound &&
      item.classList.contains("round")) {
      item.classList.remove("round");
      item.parentNode.classList.remove("round");
    }
  });
}